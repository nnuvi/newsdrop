from datetime import datetime, timezone

from app.core.exceptions import ConflictError, NotFoundError
from app.modules.articles.schema import ArticleQuery
from app.modules.articles.service import ArticleService
from app.modules.summaries.service import SummaryService
from app.modules.topics.repository import TopicRepository
from app.modules.topics.schema import TopicCreate, TopicResponse
from loguru import logger

MAX_ACTIVE_TOPICS = 10


class TopicsService:
    def __init__(
        self,
        article_service: ArticleService,
        summary_service: SummaryService,
        repository: TopicRepository,
    ):
        self.article_service = article_service
        self.summary_service = summary_service
        self.repository = repository

    async def create_topic(
        self,
        user: dict,
        topic: TopicCreate,
    ) -> TopicResponse:
        user_id = user["_id"]

        active_count = await self.repository.count_active_by_user(
            user_id,
        )

        if active_count >= MAX_ACTIVE_TOPICS:
            raise ConflictError("You can have at most 10 active topics")

        saved = await self.repository.create(
            user_id=user_id,
            topic=topic,
        )

        logger.info(
            "Topic created | user_id={} topic_id={}",
            user_id,
            saved["_id"],
        )

        return self._to_response(saved)

    async def get_topics(
        self,
        user: dict,
    ) -> list[TopicResponse]:
        user_id = user["_id"]

        topics = await self.repository.get_active_by_user(
            user_id,
        )

        return [self._to_response(topic) for topic in topics]

    async def deactivate_topic(
        self,
        user: dict,
        topic_id: str,
    ) -> TopicResponse:
        user_id = user["_id"]

        topic = await self.repository.get_by_id_and_user(
            topic_id,
            user_id,
        )

        if topic is None:
            raise NotFoundError("Topic not found")

        if topic.get("is_deleted", False):
            raise NotFoundError("Topic not found")

        if not topic.get("is_active", False):
            return self._to_response(topic)

        updated = await self.repository.deactivate(
            topic_id,
            user_id,
        )

        logger.info(
            "Topic deactivated | user_id={} topic_id={}",
            user_id,
            topic_id,
        )

        return self._to_response(updated)

    async def reactivate_topic(
        self,
        user: dict,
        topic_id: str,
    ) -> TopicResponse:
        user_id = user["_id"]

        topic = await self.repository.get_by_id_and_user(
            topic_id,
            user_id,
        )

        if topic is None or topic.get("is_deleted", False):
            raise NotFoundError("Topic not found")

        if topic.get("is_active", False):
            return self._to_response(topic)

        active_count = await self.repository.count_active_by_user(
            user_id,
        )

        if active_count >= MAX_ACTIVE_TOPICS:
            raise ConflictError("You can have at most 10 active topics")

        updated = await self.repository.reactivate(
            topic_id,
            user_id,
        )

        logger.info(
            "Topic reactivated | user_id={} topic_id={}",
            user_id,
            topic_id,
        )

        return self._to_response(updated)

    async def delete_topic(
        self,
        user: dict,
        topic_id: str,
    ) -> TopicResponse:
        user_id = user["_id"]

        topic = await self.repository.get_by_id_and_user(
            topic_id,
            user_id,
        )

        if topic is None or topic.get("is_deleted", False):
            raise NotFoundError("Topic not found")

        deleted_at = datetime.now(timezone.utc)

        updated = await self.repository.soft_delete(
            topic_id,
            user_id,
            deleted_at,
        )

        logger.info(
            "Topic deleted | user_id={} topic_id={}",
            user_id,
            topic_id,
        )

        return self._to_response(updated)

    async def fetch_content(
        self,
        query: ArticleQuery,
    ):
        logger.debug(
            "Fetch topics request | categories={} tags={} page={} limit={}",
            query.categories,
            query.tags,
            query.page,
            query.limit,
        )

        articles = await self.article_service.fetch_articles(query)

        logger.debug(
            "Fetch topics articles response | count={}",
            len(articles.articles),
        )

        if not articles.articles:
            logger.debug(
                "No articles found for the given query | categories={} tags={} page={} limit={}",
                query.categories,
                query.tags,
                query.page,
                query.limit,
            )

            return {
                "articles": articles,
                "summary": "",
            }

        summary = await self.summary_service.summarize_articles(
            articles.articles,
        )

        logger.debug(
            "Fetch topics response | articles={} summary_generated={}",
            len(articles.articles),
            bool(summary),
        )

        return {
            "articles": articles,
            "summary": summary,
        }

    @staticmethod
    def _to_response(
        topic: dict,
    ) -> TopicResponse:
        return TopicResponse(
            id=str(topic["_id"]),
            user_id=str(topic["user_id"]),
            name=topic["name"],
            categories=topic.get("categories", []),
            tags=topic.get("tags", []),
            is_active=topic.get("is_active", False),
            is_deleted=topic.get("is_deleted", False),
            created_at=topic["created_at"],
            updated_at=topic["updated_at"],
            deleted_at=topic.get("deleted_at"),
        )
