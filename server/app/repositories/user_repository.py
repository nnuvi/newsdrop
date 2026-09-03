from typing import Any

from bson import ObjectId
from pymongo.asynchronous.collection import AsyncCollection

from infra.db.mongodb import users_collection
from repositories.base import BaseRepository


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