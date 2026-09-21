from typing import Annotated

from app.modules.auth.dependency import get_current_user
from app.modules.auth.schema import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
)
from app.modules.auth.service import auth_service
from fastapi import APIRouter, Depends
from loguru import logger

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=201,
)
async def register(body: RegisterRequest):
    logger.debug(
        "Register request | email={} username={} full_name={}",
        body.email,
        body.username,
        body.full_name,
    )

    result = await auth_service.register(body)

    logger.debug(
        "Register successful | email={} username={}",
        body.email,
        body.username,
    )

    return result


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(body: LoginRequest):
    logger.debug(
        "Login request | email={}",
        body.email,
    )

    result = await auth_service.login(body)

    logger.debug(
        "Login successful | email={}",
        body.email,
    )

    return result


@router.post(
    "/forgot-password",
    response_model=MessageResponse,
)
async def forgot_password(body: ForgotPasswordRequest):
    logger.debug(
        "Forgot password request | email={}",
        body.email,
    )

    result = await auth_service.forgot_password(body)

    logger.debug(
        "Forgot password request processed | email={}",
        body.email,
    )

    return result


@router.post(
    "/reset-password",
    response_model=MessageResponse,
)
async def reset_password(body: ResetPasswordRequest):
    logger.debug(
        "Reset password request received",
    )

    result = await auth_service.reset_password(body)

    logger.debug(
        "Password reset successful",
    )

    return result


@router.post(
    "/change-password",
    response_model=TokenResponse,
)
async def change_password(
    body: ChangePasswordRequest,
    user: Annotated[dict, Depends(get_current_user)],
):
    logger.debug(
        "Change password request | user_id={}",
        user["_id"],
    )

    result = await auth_service.change_password(
        user,
        body,
    )

    logger.debug(
        "Password change successful | user_id={}",
        user["_id"],
    )

    return result