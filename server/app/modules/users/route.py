from typing import Annotated

from app.modules.auth.dependency import get_current_user
from app.modules.users.dependency import CurrentUserDep
from app.modules.users.schema import User, UserUpdate
from app.modules.users.service import user_service
from fastapi import APIRouter, Depends
from loguru import logger

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/me",
    response_model=User,
)
async def get_me(
    user: CurrentUserDep,
):
    logger.debug("Get current user | user_id={} user={}", user["_id"], user)

    return user_service.to_response(user)


@router.patch(
    "/me",
    response_model=User,
)
async def update_me(
    body: UserUpdate,
    user: CurrentUserDep,
):
    logger.debug(
        "Update current user | user_id={} fields={}",
        user["_id"],
        list(
            body.model_dump(
                exclude_unset=True,
            ).keys()
        ),
    )

    return await user_service.update_profile(
        user,
        body,
    )
