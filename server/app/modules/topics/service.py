from datetime import datetime, timezone

from app.core.exceptions import ConflictError, NotFoundError
from app.core.logger import logger
from app.lib.object_id import to_object_id
from app.modules.topics.repository import TopicRepository
from app.modules.topics.schema import (
    TopicCreate,
    TopicResponse,
    TopicUpdate,
)

MAX_ACTIVE_TOPICS = 10


class TopicService:
    def __init__(
        self,
        repository: TopicRepository,
    ):
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

        logger.debug(
            "Create topic | user_id={} active_count={}",
            user_id,
            active_count,
        )

        if active_count >= MAX_ACTIVE_TOPICS:
            logger.debug(
                "Active topic limit reached | user_id={} count={}",
                user_id,
                active_count,
            )
            raise ConflictError(
                "You can have at most 10 active topics",
            )

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

        logger.debug(
            "Topics retrieved | user_id={} count={}",
            user_id,
            len(topics),
        )

        return [self._to_response(topic) for topic in topics]

    async def get_topic(
        self,
        user: dict,
        topic_id: str,
    ) -> TopicResponse:
        user_id = user["_id"]
        topic_object_id = to_object_id(topic_id, "topic ID")

        topic = await self.repository.get_by_id_and_user(
            topic_object_id,
            user_id,
        )

        if topic is None:
            logger.debug(
                "Topic not found | user_id={} topic_id={}",
                user_id,
                topic_id,
            )
            raise NotFoundError("Topic not found")

        logger.debug(
            "Topic retrieved | user_id={} topic_id={}",
            user_id,
            topic_id,
        )

        return self._to_response(topic)

    async def deactivate_topic(
        self,
        user: dict,
        topic_id: str,
    ) -> TopicResponse:
        user_id = user["_id"]
        topic_object_id = to_object_id(topic_id, "topic ID")

        topic = await self.repository.get_by_id_and_user(
            topic_object_id,
            user_id,
        )

        if topic is None:
            logger.debug(
                "Topic not found | user_id={} topic_id={}",
                user_id,
                topic_id,
            )
            raise NotFoundError("Topic not found")

        if not topic.get("is_active", False):
            logger.debug(
                "Topic already inactive | user_id={} topic_id={}",
                user_id,
                topic_id,
            )
            return self._to_response(topic)

        updated = await self.repository.deactivate(
            topic_object_id,
            user_id,
        )

        if updated is None:
            raise NotFoundError("Topic not found")

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
        topic_object_id = to_object_id(topic_id, "topic ID")

        topic = await self.repository.get_by_id_and_user(
            topic_object_id,
            user_id,
        )

        if topic is None:
            logger.debug(
                "Topic not found | user_id={} topic_id={}",
                user_id,
                topic_id,
            )
            raise NotFoundError("Topic not found")

        if topic.get("is_active", False):
            logger.debug(
                "Topic already active | user_id={} topic_id={}",
                user_id,
                topic_id,
            )
            return self._to_response(topic)

        active_count = await self.repository.count_active_by_user(
            user_id,
        )

        logger.debug(
            "Reactivate topic | user_id={} active_count={}",
            user_id,
            active_count,
        )

        if active_count >= MAX_ACTIVE_TOPICS:
            logger.debug(
                "Active topic limit reached | user_id={} count={}",
                user_id,
                active_count,
            )
            raise ConflictError(
                "You can have at most 10 active topics",
            )

        updated = await self.repository.reactivate(
            topic_object_id,
            user_id,
        )

        if updated is None:
            raise NotFoundError("Topic not found")

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
        topic_object_id = to_object_id(topic_id, "topic ID")

        topic = await self.repository.get_by_id_and_user(
            topic_object_id,
            user_id,
        )

        if topic is None:
            logger.debug(
                "Topic not found | user_id={} topic_id={}",
                user_id,
                topic_id,
            )
            raise NotFoundError("Topic not found")

        deleted_at = datetime.now(timezone.utc)

        updated = await self.repository.soft_delete(
            topic_object_id,
            user_id,
            deleted_at,
        )

        if updated is None:
            raise NotFoundError("Topic not found")

        logger.info(
            "Topic deleted | user_id={} topic_id={}",
            user_id,
            topic_id,
        )

        return self._to_response(updated)

    async def update_topic(
        self,
        user: dict,
        topic_id: str,
        updates: TopicUpdate,
    ) -> TopicResponse:
        user_id = user["_id"]
        topic_object_id = to_object_id(topic_id, "topic ID")

        existing = await self.repository.get_by_id_and_user(
            topic_object_id,
            user_id,
        )

        if existing is None:
            logger.debug(
                "Topic not found for update | user_id={} topic_id={}",
                user_id,
                topic_id,
            )
            raise NotFoundError("Topic not found")

        updated = await self.repository.update(
            topic_object_id,
            user_id,
            updates,
        )

        if updated is None:
            raise NotFoundError("Topic not found")

        logger.info(
            "Topic updated | user_id={} topic_id={}",
            user_id,
            topic_id,
        )

        return self._to_response(updated)

    @staticmethod
    def _to_response(
        topic: dict,
    ) -> TopicResponse:
        return TopicResponse(
            id=str(topic["_id"]),
            user_id=str(topic["user_id"]),
            name=topic["name"],
            keywords=topic.get("keywords", []),
            categories=topic.get("categories", []),
            tags=topic.get("tags", []),
            is_active=topic.get("is_active", False),
            is_deleted=topic.get("is_deleted", False),
            created_at=topic["created_at"],
            updated_at=topic["updated_at"],
            deleted_at=topic.get("deleted_at"),
        )