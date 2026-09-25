from datetime import datetime, timezone
from typing import Any

from app.infra.db.mongodb import topics_collection
from app.modules.topics.schema import TopicCreate
from bson import ObjectId
from pymongo import ReturnDocument
from pymongo.asynchronous.collection import AsyncCollection


class TopicRepository:
    def __init__(
        self,
        collection: AsyncCollection = topics_collection,
    ):
        self.collection = collection

    async def create(
        self,
        user_id: ObjectId,
        topic: TopicCreate,
    ) -> dict[str, Any]:
        now = datetime.now(timezone.utc)

        topic_data = topic.model_dump()

        topic_data.update(
            {
                "user_id": user_id,
                "is_active": True,
                "is_deleted": False,
                "created_at": now,
                "updated_at": now,
                "deleted_at": None,
            }
        )

        result = await self.collection.insert_one(topic_data)

        created_topic = await self.collection.find_one({"_id": result.inserted_id})

        if created_topic is None:
            raise RuntimeError("Topic was created but could not be retrieved.")

        return created_topic

    async def get_active_by_user(
        self,
        user_id: ObjectId,
    ) -> list[dict[str, Any]]:
        cursor = self.collection.find(
            {
                "user_id": user_id,
                "is_active": True,
                "is_deleted": False,
            }
        ).sort("created_at", -1)

        return await cursor.to_list()

    async def count_active_by_user(
        self,
        user_id: ObjectId,
    ) -> int:
        return await self.collection.count_documents(
            {
                "user_id": user_id,
                "is_active": True,
                "is_deleted": False,
            }
        )

    async def get_by_id_and_user(
        self,
        topic_id: ObjectId,
        user_id: ObjectId,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one(
            {
                "_id": topic_id,
                "user_id": user_id,
            }
        )

    async def deactivate(
        self,
        topic_id: ObjectId,
        user_id: ObjectId,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one_and_update(
            {
                "_id": topic_id,
                "user_id": user_id,
                "is_active": True,
                "is_deleted": False,
            },
            {
                "$set": {
                    "is_active": False,
                    "updated_at": datetime.now(timezone.utc),
                }
            },
            return_document=ReturnDocument.AFTER,
        )

    async def reactivate(
        self,
        topic_id: ObjectId,
        user_id: ObjectId,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one_and_update(
            {
                "_id": topic_id,
                "user_id": user_id,
                "is_active": False,
                "is_deleted": False,
            },
            {
                "$set": {
                    "is_active": True,
                    "updated_at": datetime.now(timezone.utc),
                }
            },
            return_document=ReturnDocument.AFTER,
        )

    async def soft_delete(
        self,
        topic_id: ObjectId,
        user_id: ObjectId,
        deleted_at: datetime,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one_and_update(
            {
                "_id": topic_id,
                "user_id": user_id,
                "is_deleted": False,
            },
            {
                "$set": {
                    "is_active": False,
                    "is_deleted": True,
                    "deleted_at": deleted_at,
                    "updated_at": deleted_at,
                }
            },
            return_document=ReturnDocument.AFTER,
        )
