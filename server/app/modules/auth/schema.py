from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Sign-up body. Split into a user profile and a credential on the server."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    # Profile fields (copied into UserCreate)
    username: str = Field(min_length=3, max_length=30, pattern=r"^[A-Za-z0-9_]+$")
    full_name: str | None = Field(default=None, max_length=120)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthCredentialCreate(BaseModel):
    """Stored in the `auth_credentials` collection. Never returned by the API."""

    # users._id as a string. Also the JWT "sub".
    user_id: str

    # Stored lowercase. Used as the login identifier.
    email: EmailStr

    password_hash: str
    is_active: bool = True

    # Access tokens issued before this moment are rejected (see get_current_user).
    password_changed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """`token` is the reset token from the emailed link."""

    token: str
    new_password: str = Field(min_length=8, max_length=128)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


class MessageResponse(BaseModel):
    message: str