import asyncio
import os
from datetime import datetime, timezone

import jwt
from app.core.exceptions import ConflictError, UnauthorizedError
from app.lib.security import (
    create_access_token,
    create_reset_token,
    decode_access_token,
    decode_reset_token,
    hasher,
    reset_token_matches,
)
from app.modules.auth.repository import (
    AuthRepository,
    auth_repository,
)
from app.modules.auth.schema import (
    AuthCredentialCreate,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
)
from app.modules.users.repository import (
    UserRepository,
    user_repository,
)
from app.modules.users.schema import UserCreate
from bson import ObjectId
from bson.errors import InvalidId
from loguru import logger
from pymongo.errors import DuplicateKeyError

RESET_URL = os.environ.get(
    "APP_RESET_URL",
    "myapp://reset-password",
)


class AuthService:
    def __init__(
        self,
        auth_repository: AuthRepository,
        user_repository: UserRepository,
    ):
        self.auth_repository = auth_repository
        self.user_repository = user_repository

    # ---------- private helpers ----------

    def _send_reset_email(
        self,
        email: str,
        token: str,
    ) -> None:
        # TODO: Replace with a real email provider.
        # Never log or return the token in production.
        print(f"[dev] password reset for {email}: {RESET_URL}?token={token}")

    async def _set_password(
        self,
        user_id: str,
        new_password: str,
    ) -> None:
        logger.debug(
            "Setting new password | user_id={}",
            user_id,
        )

        password_hash = await asyncio.to_thread(
            hasher.hash,
            new_password,
        )

        await self.auth_repository.update_password(
            user_id=user_id,
            password_hash=password_hash,
            password_changed_at=datetime.now(timezone.utc),
        )

        logger.debug(
            "Password updated | user_id={}",
            user_id,
        )

    # ---------- public API ----------

    async def register(
        self,
        body: RegisterRequest,
    ) -> TokenResponse:
        logger.debug(
            "Register started | email={} username={} full_name={}",
            body.email,
            body.username,
            body.full_name,
        )

        password_hash = await asyncio.to_thread(
            hasher.hash,
            body.password,
        )

        logger.debug(
            "Password hashed | username={}",
            body.username,
        )

        profile = UserCreate(
            username=body.username,
            full_name=body.full_name,
        )

        # 1. Create the user profile.
        try:
            result = await self.user_repository.create(
                {
                    **profile.model_dump(mode="json"),
                    "role": "user",
                    "created_at": datetime.now(timezone.utc),
                }
            )

            logger.debug(
                "User profile created | user_id={} username={}",
                result.inserted_id,
                body.username,
            )

        except DuplicateKeyError:
            logger.warning(
                "Registration failed | username already taken | username={}",
                body.username,
            )

            raise ConflictError("Username already taken")

        user_id = str(result.inserted_id)

        # 2. Create authentication credentials.
        credentials = AuthCredentialCreate(
            user_id=user_id,
            email=body.email.lower(),
            password_hash=password_hash,
        )

        try:
            await self.auth_repository.create(credentials.model_dump())

            logger.debug(
                "Auth credentials created | user_id={} email={}",
                user_id,
                body.email,
            )

        except DuplicateKeyError:
            logger.warning(
                "Registration failed | email already registered | email={}",
                body.email,
            )

            # Roll back the profile if the email is already registered.
            await self.user_repository.delete(result.inserted_id)

            raise ConflictError("Email already registered")

        except Exception:
            logger.exception(
                "Failed to create auth credentials | user_id={}",
                user_id,
            )

            # Prevent a partially-created account.
            await self.user_repository.delete(result.inserted_id)

            raise

        token = create_access_token(user_id)

        logger.debug(
            "Registration successful | user_id={} email={} username={}",
            user_id,
            body.email,
            body.username,
        )

        return TokenResponse(access_token=token)

    async def login(
        self,
        body: LoginRequest,
    ) -> TokenResponse:
        email = body.email.lower()

        logger.debug(
            "Login started | email={}",
            email,
        )

        credentials = await self.auth_repository.get_by_email(email)

        if not credentials:
            logger.debug(
                "Login failed | credentials not found | email={}",
                email,
            )

            raise UnauthorizedError("Invalid email or password")

        if not credentials.get(
            "is_active",
            True,
        ):
            logger.debug(
                "Login failed | account inactive | email={}",
                email,
            )

            raise UnauthorizedError("Invalid email or password")

        password_valid = await asyncio.to_thread(
            hasher.verify,
            body.password,
            credentials["password_hash"],
        )

        if not password_valid:
            logger.debug(
                "Login failed | invalid password | email={}",
                email,
            )

            raise UnauthorizedError("Invalid email or password")

        logger.debug(
            "Login successful | user_id={} email={}",
            credentials["user_id"],
            email,
        )

        return TokenResponse(access_token=create_access_token(credentials["user_id"]))

    async def forgot_password(
        self,
        body: ForgotPasswordRequest,
    ) -> MessageResponse:
        email = body.email.lower()

        logger.debug(
            "Forgot password requested | email={}",
            email,
        )

        credentials = await self.auth_repository.get_by_email(email)

        if credentials and credentials.get(
            "is_active",
            True,
        ):
            logger.debug(
                "Creating password reset token | user_id={}",
                credentials["user_id"],
            )

            token = create_reset_token(
                credentials["user_id"],
                credentials["password_hash"],
            )

            self._send_reset_email(
                credentials["email"],
                token,
            )

            logger.debug(
                "Password reset email dispatched | email={}",
                email,
            )
        else:
            logger.debug(
                "Password reset requested for unknown or inactive account | email={}",
                email,
            )

        # Same response whether the email exists or not.
        # Prevents account enumeration.
        return MessageResponse(
            message=("If that email is registered, a reset link has been sent.")
        )

    async def reset_password(
        self,
        body: ResetPasswordRequest,
    ) -> MessageResponse:
        logger.debug("Password reset started")

        try:
            payload = decode_reset_token(body.token)

            user_id = payload["sub"]

            logger.debug(
                "Reset token decoded | user_id={}",
                user_id,
            )

        except (
            jwt.PyJWTError,
            KeyError,
            TypeError,
        ):
            logger.debug("Password reset failed | invalid or expired token")

            raise UnauthorizedError("Invalid or expired reset link")

        credentials = await self.auth_repository.get_by_user_id(user_id)

        if not credentials:
            logger.debug(
                "Password reset failed | credentials not found | user_id={}",
                user_id,
            )

            raise UnauthorizedError("Invalid or expired reset link")

        if not credentials.get(
            "is_active",
            True,
        ):
            logger.debug(
                "Password reset failed | account inactive | user_id={}",
                user_id,
            )

            raise UnauthorizedError("Invalid or expired reset link")

        token_valid = reset_token_matches(
            payload,
            credentials["password_hash"],
        )

        if not token_valid:
            logger.debug(
                "Password reset failed | token mismatch | user_id={}",
                user_id,
            )

            raise UnauthorizedError("Invalid or expired reset link")

        await self._set_password(
            user_id,
            body.new_password,
        )

        logger.debug(
            "Password reset successful | user_id={}",
            user_id,
        )

        return MessageResponse(message="Password updated. Please log in.")

    async def change_password(
        self,
        user: dict,
        body: ChangePasswordRequest,
    ) -> TokenResponse:
        user_id = str(user["_id"])

        logger.debug(
            "Change password started | user_id={}",
            user_id,
        )

        credentials = await self.auth_repository.get_by_user_id(user_id)

        if not credentials:
            logger.warning(
                "Change password failed | credentials not found | user_id={}",
                user_id,
            )

            raise UnauthorizedError("Authentication credentials not found")

        current_password_valid = await asyncio.to_thread(
            hasher.verify,
            body.current_password,
            credentials["password_hash"],
        )

        if not current_password_valid:
            logger.debug(
                "Change password failed | current password incorrect | user_id={}",
                user_id,
            )

            raise UnauthorizedError("Current password is incorrect")

        await self._set_password(
            user_id,
            body.new_password,
        )

        # password_changed_at invalidates previously issued tokens.
        token = create_access_token(user_id)

        logger.debug(
            "Password change successful | user_id={}",
            user_id,
        )

        return TokenResponse(access_token=token)

    async def get_user_from_token(
        self,
        token: str,
    ) -> dict:
        """Validate an access token and return the user document."""

        logger.debug("Authenticating bearer token")

        try:
            payload = decode_access_token(token)

            user_id = payload["sub"]
            issued_at = payload["iat"]

            logger.debug(
                "Access token decoded | user_id={} issued_at={}",
                user_id,
                issued_at,
            )

            user_object_id = ObjectId(user_id)

        except (
            jwt.PyJWTError,
            InvalidId,
            KeyError,
            TypeError,
            ValueError,
        ):
            logger.debug("Authentication failed | invalid or expired token")

            raise UnauthorizedError("Invalid or expired token")

        user = await self.user_repository.get_by_id(user_object_id)

        if not user:
            logger.debug(
                "Authentication failed | user not found | user_id={}",
                user_id,
            )

            raise UnauthorizedError("User not found")

        credentials = await self.auth_repository.get_status(user_id)

        if not credentials:
            logger.debug(
                "Authentication failed | credentials not found | user_id={}",
                user_id,
            )

            raise UnauthorizedError("Account disabled")

        if not credentials.get(
            "is_active",
            True,
        ):
            logger.debug(
                "Authentication failed | account inactive | user_id={}",
                user_id,
            )

            raise UnauthorizedError("Account disabled")

        changed_at = credentials.get("password_changed_at")

        if changed_at and issued_at < int(changed_at.timestamp()):
            logger.debug(
                "Authentication failed | password changed after token issuance | user_id={}",
                user_id,
            )

            raise UnauthorizedError("Password changed, please log in again")

        logger.debug(
            "Authentication successful | user_id={}",
            user_id,
        )

        return user


auth_service = AuthService(
    auth_repository=auth_repository,
    user_repository=user_repository,
)
