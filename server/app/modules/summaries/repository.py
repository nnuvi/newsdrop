from datetime import datetime, timezone
from typing import Any

from app.infra.db.mongodb import summaries_collection
from bson import ObjectId
from pymongo import DESCENDING
from pymongo.asynchronous.collection import AsyncCollection


class SummaryRepository:
    def __init__(
        self,
        collection: AsyncCollection = summaries_collection,
    ):
        self.collection = collection

    async def get_latest(
        self,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one(
            sort=[("created_at", DESCENDING)],
        )

    async def get_by_id(
        self,
        summary_id: ObjectId,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one(
            {"_id": summary_id},
        )

    async def get_by_topic_id(
        self,
        topic_id: ObjectId,
    ) -> list[dict[str, Any]]:
        cursor = self.collection.find(
            {
                "topic_ids": topic_id,
            }
        ).sort("created_at", DESCENDING)

        return await cursor.to_list()

    async def get_by_article_id(
        self,
        article_id: ObjectId,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one(
            {
                "article_ids": article_id,
            },
            sort=[("created_at", DESCENDING)],
        )

    async def create(
        self,
        topic_ids: list[ObjectId],
        article_ids: list[ObjectId],
        title: str,
        summary: str,
        statistics: list[dict[str, Any]],
        model: str,
    ) -> dict[str, Any]:
        document = {
            "topic_ids": topic_ids,
            "article_ids": article_ids,
            "title": title,
            "summary": summary,
            "statistics": statistics,
            "model": model,
            "created_at": datetime.now(timezone.utc),
        }

        result = await self.collection.insert_one(document)

        created_summary = await self.collection.find_one(
            {"_id": result.inserted_id},
        )

        if created_summary is None:
            raise RuntimeError(
                "Summary was created but could not be retrieved.",
            )

        return created_summary
