from typing import Annotated

from app.modules.users.repository import user_repository
from app.modules.users.service import UserService
from fastapi import Depends


def get_user_service() -> UserService:
    return UserService(user_repository)


# use in routes:  service: UserServiceDep
UserServiceDep = Annotated[UserService, Depends(get_user_service)]