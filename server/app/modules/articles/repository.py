from datetime import UTC, datetime
from typing import Any

from app.core.logger import logger
from app.infra.db.mongodb import articles_collection
from app.modules.articles.schema import ArticleCreate
from bson import ObjectId
from pymongo import ReturnDocument
from pymongo.asynchronous.collection import AsyncCollection


class ArticleRepository:
    def __init__(
        self,
        collection: AsyncCollection = articles_collection,
    ):
        self.collection = collection

    async def upsert_articles(
        self,
        articles: list[ArticleCreate],
    ) -> list[dict[str, Any]]:
        saved_articles = []

        for article in articles:
            saved = await self.upsert_article(article)

            if saved is not None:
                saved_articles.append(saved)

        logger.debug(
            "Articles resolved | count={}",
            len(saved_articles),
        )

        return saved_articles

    async def upsert_article(
        self,
        article: ArticleCreate,
    ) -> dict[str, Any] | None:
        article_data = article.model_dump(mode="json")
        url = article_data.get("url")

        if not url:
            logger.debug(
                "Skipping article without URL | title={}",
                article_data.get("title"),
            )
            return None

        now = datetime.now(UTC)

        update = {
            "$setOnInsert": {
                **{
                    key: value
                    for key, value in article_data.items()
                    if key not in {"categories", "tags", "providers"}
                },
                "created_at": now,
            },
            "$set": {
                "updated_at": now,
            },
            "$addToSet": {
                "categories": {
                    "$each": article_data.get("categories", []),
                },
                "tags": {
                    "$each": article_data.get("tags", []),
                },
                "providers": {
                    "$each": article_data.get("providers", []),
                },
            },
        }

        saved = await self.collection.find_one_and_update(
            {"url": url},
            update,
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )

        if saved is None:
            raise RuntimeError(
                "Article was upserted but could not be retrieved.",
            )

        logger.debug(
            "Article resolved | article_id={} url={}",
            saved["_id"],
            url,
        )

        return saved

    async def find_articles_by_ids(
        self,
        article_ids: list[ObjectId],
    ) -> list[dict[str, Any]]:
        if not article_ids:
            return []

        logger.debug(
            "Finding articles by IDs | count={}",
            len(article_ids),
        )

        cursor = self.collection.find(
            {
                "_id": {
                    "$in": article_ids,
                },
            }
        ).sort(
            "published_at",
            -1,
        )

        articles = await cursor.to_list()

        logger.debug(
            "Articles found by IDs | count={}",
            len(articles),
        )

        return articles

    async def get_by_url(
        self,
        url: str,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one(
            {"url": str(url)},
        )
