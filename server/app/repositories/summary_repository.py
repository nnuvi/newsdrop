from typing import Any

from app.infra.db.mongodb import summaries_collection
from app.repositories.base import BaseRepository
from bson import ObjectId
from pymongo.asynchronous.collection import AsyncCollection


class SummaryRepository(BaseRepository):
    def __init__(
        self,
        collection: AsyncCollection = summaries_collection,
    ):
        super().__init__(collection)

    async def get_by_article_id(
        self,
        article_id: ObjectId,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one(
            {"article_id": article_id}
        )

    async def create_for_article(
        self,
        document: dict[str, Any],
    ):
        return await self.collection.insert_one(document)