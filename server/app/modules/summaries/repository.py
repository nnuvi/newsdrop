from datetime import datetime, timezone
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

    async def get_latest(
        self,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one(
            sort=[("created_at", -1)]
        )

    async def create(
        self,
        article_ids: list[ObjectId],
        summary: str,
        model: str = "gemini-3.6-flash",
    ) -> dict[str, Any]:
        document = {
            "article_ids": article_ids,
            "summary": summary,
            "model": model,
            "created_at": datetime.now(timezone.utc),
        }

        result = await self.collection.insert_one(document)

        return await self.collection.find_one(
            {"_id": result.inserted_id}
        )