from datetime import UTC, datetime
from typing import Any

from app.infra.db.mongodb import topics_collection
from app.modules.topics.schema import TopicCreate, TopicUpdate
from bson import ObjectId
from pymongo import ReturnDocument
from pymongo.asynchronous.collection import AsyncCollection


class TopicRepository:
    def __init__(
        self,
        collection: AsyncCollection = topics_collection,
    ):
        self.collection = collection

    # Creates and persists a topic for a user.
    async def create(
        self,
        user_id: ObjectId,
        topic: TopicCreate,
    ) -> dict[str, Any]:
        now = datetime.now(UTC)

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

        created_topic = await self.collection.find_one(
            {"_id": result.inserted_id},
        )

        if created_topic is None:
            raise RuntimeError(
                "Topic was created but could not be retrieved.",
            )

        return created_topic

    # Retrieves all active, non-deleted topics belonging to a user.
    async def get_active_by_user(
        self,
        user_id: ObjectId,
    ) -> list[dict[str, Any]]:
        cursor = self.collection.find(
            {
                "user_id": user_id,
                # "is_active": True,
                "is_deleted": False,
            }
        ).sort(
            [
                ("is_active", -1),
                ("created_at", -1),
            ]
        )

        return await cursor.to_list()

    # Counts the user's active, non-deleted topics.
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

    # Retrieves a non-deleted topic by ID while verifying ownership.
    async def get_by_id_and_user(
        self,
        topic_id: ObjectId,
        user_id: ObjectId,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one(
            {
                "_id": topic_id,
                "user_id": user_id,
                "is_deleted": False,
            }
        )

    # Updates the supplied fields of a non-deleted topic.
    async def update(
        self,
        topic_id: ObjectId,
        user_id: ObjectId,
        updates: TopicUpdate,
    ) -> dict[str, Any] | None:
        update_data = updates.model_dump(exclude_unset=True)

        if not update_data:
            return None

        update_data["updated_at"] = datetime.now(UTC)

        return await self.collection.find_one_and_update(
            {
                "_id": topic_id,
                "user_id": user_id,
                "is_deleted": False,
            },
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
        )

    # Deactivates an active topic without deleting its record.
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
                    "updated_at": datetime.now(UTC),
                }
            },
            return_document=ReturnDocument.AFTER,
        )

    # Reactivates a previously deactivated topic.
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
                    "updated_at": datetime.now(UTC),
                }
            },
            return_document=ReturnDocument.AFTER,
        )

    # Soft-deletes a topic while keeping its database record.
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
