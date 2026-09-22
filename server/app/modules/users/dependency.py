from typing import Annotated

from app.core.exceptions import ForbiddenError
from app.modules.auth.dependency import get_current_user
from app.modules.users.service import UserService, user_service
from fastapi import Depends


def get_user_service() -> UserService:
    return user_service


UserServiceDep = Annotated[
    UserService,
    Depends(get_user_service),
]


CurrentUserDep = Annotated[
    dict,
    Depends(get_current_user),
]


async def require_admin(
    user: CurrentUserDep,
) -> dict:
    if user.get("role") != "admin":
        raise ForbiddenError("Admin access required")

    return user


AdminUserDep = Annotated[
    dict,
    Depends(require_admin),
]
