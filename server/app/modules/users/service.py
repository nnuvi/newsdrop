from app.core.exceptions import ConflictError, NotFoundError
from app.modules.users.repository import (
    UserRepository,
    user_repository,
)
from app.modules.users.schema import User, UserUpdate
from loguru import logger
from pymongo.errors import DuplicateKeyError


class UserService:
    def __init__(
        self,
        repository: UserRepository,
    ):
        self.repository = repository

    async def update_profile(
        self,
        user: dict,
        body: UserUpdate,
    ) -> User:
        user_id = user["_id"]

        changes = body.model_dump(
            mode="json",
            exclude_unset=True,
        )

        logger.debug(
            "Updating user profile | user_id={} fields={}",
            user_id,
            list(changes.keys()),
        )

        if changes:
            try:
                await self.repository.update(
                    user_id,
                    changes,
                )

            except DuplicateKeyError:
                logger.warning(
                    "Username already taken | user_id={}",
                    user_id,
                )

                raise ConflictError("Username already taken")

        updated_user = await self.repository.get_by_id(user_id)

        if updated_user is None:
            logger.error(
                "User not found after profile update | user_id={}",
                user_id,
            )

            raise NotFoundError("User not found")

        return self.to_response(updated_user)

    @staticmethod
    def to_response(doc: dict) -> User:
        return User.model_validate(
            {
                **doc,
                "id": str(doc["_id"]),
            }
        )


user_service = UserService(
    repository=user_repository,
)
