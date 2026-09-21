from typing import Annotated

from app.modules.auth.service import auth_service
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

bearer = HTTPBearer()

BearerCredentials = Annotated[
    HTTPAuthorizationCredentials,
    Depends(bearer),
]


async def get_current_user(
    creds: BearerCredentials,
) -> dict:
    """Return the authenticated user from the bearer token."""

    return await auth_service.get_user_from_token(
        creds.credentials
    )