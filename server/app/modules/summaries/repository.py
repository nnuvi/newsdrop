from datetime import UTC, datetime
from typing import Any

from app.infra.db.mongodb import articles_collection, summaries_collection
from bson import ObjectId
from pymongo import DESCENDING
from pymongo.asynchronous.collection import AsyncCollection


class SummaryRepository:
    def __init__(
        self,
        collection: AsyncCollection = summaries_collection,
        article_collection: AsyncCollection = articles_collection,
    ):
        self.collection = collection
        self.article_collection = article_collection

    async def _attach_articles(
        self,
        summary: dict[str, Any],
    ) -> dict[str, Any]:
        summaries = await self._attach_articles_to_many([summary])
        return summaries[0]

    async def _attach_articles_to_many(
        self,
        summaries: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        article_ids = list(
            dict.fromkeys(
                article_id
                for summary in summaries
                for article_id in summary.get("article_ids", [])
            )
        )

        if not article_ids:
            for summary in summaries:
                summary["articles"] = []
            return summaries

        cursor = self.article_collection.find(
            {"_id": {"$in": article_ids}},
            {
                "_id": 1,
                "title": 1,
                "url": 1,
                "image_url": 1,
                "source": 1,
            },
        )

        articles = await cursor.to_list()

        articles_by_id = {
            article["_id"]: {
                "id": str(article["_id"]),
                "title": article.get("title", ""),
                "url": article.get("url", ""),
                "image_url": article.get("image_url"),
                "source": (
                    article.get("source", {}).get("name", "")
                    if isinstance(article.get("source"), dict)
                    else ""
                ),
            }
            for article in articles
        }

        for summary in summaries:
            summary["articles"] = [
                articles_by_id[article_id]
                for article_id in summary.get("article_ids", [])
                if article_id in articles_by_id
            ]

        return summaries

    async def get_all(self) -> list[dict[str, Any]]:
        cursor = self.collection.find({}).sort(
            "created_at",
            DESCENDING,
        )
        summaries = await cursor.to_list()

        return await self._attach_articles_to_many(summaries)

    async def get_all_by_user(
        self,
        user_id: ObjectId,
    ) -> list[dict[str, Any]]:
        cursor = self.collection.find(
            {"user_id": user_id},
        ).sort(
            "created_at",
            DESCENDING,
        )
        summaries = await cursor.to_list()

        return await self._attach_articles_to_many(summaries)

    async def get_latest(self) -> dict[str, Any] | None:
        summary = await self.collection.find_one(
            sort=[("created_at", DESCENDING)],
        )

        if summary is None:
            return None

        return await self._attach_articles(summary)

    async def get_by_id(
        self,
        summary_id: ObjectId,
    ) -> dict[str, Any] | None:
        summary = await self.collection.find_one(
            {"_id": summary_id},
        )

        if summary is None:
            return None

        return await self._attach_articles(summary)

    async def get_by_topic_id(
        self,
        topic_id: ObjectId,
    ) -> list[dict[str, Any]]:
        cursor = self.collection.find(
            {"topic_id": topic_id},
        ).sort(
            "created_at",
            DESCENDING,
        )
        summaries = await cursor.to_list()

        return await self._attach_articles_to_many(summaries)

    async def get_by_article_id(
        self,
        article_id: ObjectId,
    ) -> dict[str, Any] | None:
        summary = await self.collection.find_one(
            {"article_ids": article_id},
            sort=[("created_at", DESCENDING)],
        )

        if summary is None:
            return None

        return await self._attach_articles(summary)

    async def create(
        self,
        topic_id: ObjectId,
        # user_id: ObjectId,
        article_ids: list[ObjectId],
        title: str,
        summary: str,
        statistics: list[dict[str, Any]],
        model: str,
    ) -> dict[str, Any]:
        now = datetime.now(UTC)

        document = {
            "topic_id": topic_id,
            # "user_id": user_id,
            "article_ids": list(dict.fromkeys(article_ids)),
            "title": title,
            "summary": summary,
            "statistics": statistics,
            "model": model,
            "created_at": now,
        }

        result = await self.collection.insert_one(document)

        created_summary = await self.collection.find_one(
            {"_id": result.inserted_id},
        )

        if created_summary is None:
            raise RuntimeError(
                "Summary was created but could not be retrieved.",
            )

        return await self._attach_articles(created_summary)
