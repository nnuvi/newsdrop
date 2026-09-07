from typing import Any

from app.infra.db.mongodb import users_collection
from app.repositories.base import BaseRepository
from pymongo.asynchronous.collection import AsyncCollection


class UserRepository(BaseRepository):
    def __init__(
        self,
        collection: AsyncCollection = users_collection,
    ):
        super().__init__(collection)

    async def get_by_email(
        self,
        email: str,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one(
            {"email": email}
        )

    async def email_exists(self, email: str) -> bool:
        user = await self.collection.find_one(
            {"email": email},
            {"_id": 1},
        )

        return user is not None