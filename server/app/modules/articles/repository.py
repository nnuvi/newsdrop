from datetime import datetime, timedelta, timezone
from typing import Any

from app.infra.db.mongodb import (
    articles_collection,
    fetch_state_collection,
)
from app.modules.articles.schema import ArticleCreate
from loguru import logger
from pymongo.asynchronous.collection import AsyncCollection

# FETCH_INTERVAL = timedelta(hours=6)
# FETCH_STATE_ID = "fetch_state"


class ArticleRepository:
    def __init__(
        self,
        collection: AsyncCollection = articles_collection,
        fetch_state: AsyncCollection = fetch_state_collection,
    ):
        super().__init__(collection)
        self.fetch_state = fetch_state

    # async def get_stale_topics(
    #     self,
    #     categories: list[str],
    #     tags: list[str],
    # ) -> list[str]:
    #     logger.debug(
    #         "Get stale topics request | categories={} tags={}",
    #         categories,
    #         tags,
    #     )
    #
    #     topics = [
    #         *(f"category:{category}" for category in categories),
    #         *(f"tag:{tag}" for tag in tags),
    #     ]
    #
    #     if not topics:
    #         logger.debug(
    #             "No topics provided | categories={} tags={}",
    #             categories,
    #             tags,
    #         )
    #         return []
    #
    #     fetch_state = await self.fetch_state.find_one({"_id": FETCH_STATE_ID})
    #
    #     logger.debug(
    #         "Fetch state retrieved | categories={} tags={} fetch_state={}",
    #         categories,
    #         tags,
    #         fetch_state,
    #     )
    #
    #     fetched_topics = fetch_state.get("topics", {}) if fetch_state else {}
    #
    #     logger.debug(
    #         "Fetched topics | categories={} tags={} fetched_topics={}",
    #         categories,
    #         tags,
    #         fetched_topics,
    #     )
    #
    #     now = datetime.now(timezone.utc)
    #     stale_topics = []
    #
    #     for topic in topics:
    #         last_fetched = fetched_topics.get(topic)
    #
    #         if last_fetched is None:
    #             stale_topics.append(topic)
    #             continue
    #
    #         # PyMongo decodes BSON datetimes as naive UTC by default.
    #         if last_fetched.tzinfo is None:
    #             last_fetched = last_fetched.replace(tzinfo=timezone.utc)
    #
    #         if now - last_fetched >= FETCH_INTERVAL:
    #             stale_topics.append(topic)
    #
    #     logger.debug(
    #         "Stale topics determined | categories={} tags={} stale_topics={}",
    #         categories,
    #         tags,
    #         stale_topics,
    #     )
    #
    #     return stale_topics

    # async def update_topic_fetch_time(
    #     self,
    #     topics: list[str],
    # ) -> None:
    #     if not topics:
    #         logger.debug(
    #             "No topics to update fetch time | topics={}",
    #             topics,
    #         )
    #         return
    #
    #     now = datetime.now(timezone.utc)
    #
    #     updates = {f"topics.{topic}": now for topic in topics}
    #
    #     logger.debug(
    #         "Updating topic fetch time | topics={} updates={}",
    #         topics,
    #         updates,
    #     )
    #
    #     await self.fetch_state.update_one(
    #         {"_id": FETCH_STATE_ID},
    #         {
    #             "$set": updates,
    #             "$setOnInsert": {
    #                 "type": "fetch_state",
    #             },
    #         },
    #         upsert=True,
    #     )

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

        # Convert Pydantic types such as HttpUrl into
        # MongoDB-compatible primitive values such as str.
        article_data = article.model_dump(mode="json")

        if article_data.get("tags"):
            article_data["tags"] = [tag.lower() for tag in article_data["tags"]]

        if article_data.get("categories"):
            article_data["categories"] = [
                category.lower() for category in article_data["categories"]
            ]

        logger.debug(
            "Resolving article | article_data={}",
            article_data,
        )

        url = article_data.get("url")

        if not url:
            logger.debug(
                "Skipping article without URL | title={}",
                article_data.get("title"),
            )
            return None

        logger.debug(
            "Checking for existing article by URL | url={}",
            url,
        )

        existing = await self.collection.find_one({"url": url})

        logger.debug(
            "Existing article check | url={} existing={}",
            url,
            existing,
        )

        if existing is not None:
            logger.debug(
                "Article already exists | id={} url={}",
                existing["_id"],
                url,
            )

            return existing

        article_data["created_at"] = datetime.now(timezone.utc)

        result = await self.collection.insert_one(article_data)

        logger.debug(
            "Article inserted | id={} url={}",
            result.inserted_id,
            url,
        )

        return await self.collection.find_one({"_id": result.inserted_id})

    # @staticmethod
    # def _merge_unique(
    #     existing: list[Any],
    #     incoming: list[Any],
    # ) -> list[Any]:
    #     result = list(existing)
    #
    #     logger.debug(
    #         "Merging unique values | existing={} incoming={}",
    #         existing,
    #         incoming,
    #     )
    #
    #     for value in incoming:
    #         if value not in result:
    #             result.append(value)
    #
    #     return result

    # @staticmethod
    # def _merge_providers(
    #     existing: list[dict[str, Any]],
    #     incoming: list[dict[str, Any]],
    # ) -> list[dict[str, Any]]:
    #     result = list(existing)
    #
    #     logger.debug(
    #         "Merging providers | existing={} incoming={}",
    #         existing,
    #         incoming,
    #     )
    #
    #     for provider in incoming:
    #         exists = any(
    #             item.get("name") == provider.get("name")
    #             and item.get("article_id") == provider.get("article_id")
    #             for item in result
    #         )
    #
    #         if not exists:
    #             result.append(provider)
    #
    #     return result

    async def find_articles(
        self,
        categories: list[str] | None = None,
        tags: list[str] | None = None,
        page: int = 1,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        logger.debug(
            "Finding articles | categories={} tags={} page={} limit={}",
            categories,
            tags,
            page,
            limit,
        )

        filters: dict[str, Any] = {}

        if categories:
            filters["categories"] = {
                "$in": [category.lower() for category in categories]
            }

        if tags:
            filters["tags"] = {"$in": [tag.lower() for tag in tags]}

        skip = (page - 1) * limit

        cursor = (
            self.collection.find(filters)
            .sort("published_at", -1)
            .skip(skip)
            .limit(limit)
        )

        articles = await cursor.to_list()

        logger.debug(
            "Articles found | count={}",
            len(articles),
        )

        return articles

    async def count_articles(
        self,
        categories: list[str] | None = None,
        tags: list[str] | None = None,
    ) -> int:
        filters: dict[str, Any] = {}

        if categories:
            filters["categories"] = {
                "$in": [category.lower() for category in categories]
            }

        if tags:
            filters["tags"] = {"$in": [tag.lower() for tag in tags]}

        count = await self.collection.count_documents(filters)

        logger.debug(
            "Article count | categories={} tags={} count={}",
            categories,
            tags,
            count,
        )

        return count

    async def get_by_url(
        self,
        url: str,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one({"url": str(url)})
