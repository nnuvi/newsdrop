from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Sign-up request."""

    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
    )
    username: str = Field(
        min_length=3,
        max_length=30,
        pattern=r"^[A-Za-z0-9_]+$",
    )
    full_name: str | None = Field(
        default=None,
        max_length=120,
    )


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthCredentialCreate(BaseModel):
    """Credential data used to create an auth credential document."""

    user_id: str
    email: EmailStr
    password_hash: str
    is_active: bool = True
    password_changed_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Reset-password request using the token from the emailed link."""

    token: str
    new_password: str = Field(
        min_length=8,
        max_length=128,
    )


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(
        min_length=8,
        max_length=128,
    )


class MessageResponse(BaseModel):
    message: str
