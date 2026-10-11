from datetime import datetime, timezone
from typing import Any

from app.core.logger import logger
from app.infra.db.mongodb import articles_collection
from app.modules.articles.schema import ArticleCreate
from bson import ObjectId
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
            "Resolved articles | count={}",
            len(saved_articles),
        )

        return saved_articles

    async def upsert_article(
        self,
        article: ArticleCreate,
    ) -> dict[str, Any] | None:
        article_data = article.model_dump(mode="json")

        logger.debug(
            "Resolving article | title={}",
            article_data.get("title"),
        )

        url = article_data.get("url")

        if not url:
            logger.debug(
                "Skipping article without URL | title={}",
                article_data.get("title"),
            )
            return None

        existing = await self.collection.find_one(
            {"url": url},
        )

        if existing is not None:
            logger.debug(
                "Article already exists | id={} url={}",
                existing["_id"],
                url,
            )
            return existing

        article_data["created_at"] = datetime.now(timezone.utc)

        result = await self.collection.insert_one(
            article_data,
        )

        logger.debug(
            "Article inserted | id={} url={}",
            result.inserted_id,
            url,
        )

        return await self.collection.find_one(
            {"_id": result.inserted_id},
        )

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
