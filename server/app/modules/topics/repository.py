from datetime import datetime, timezone
from typing import Any

from app.infra.db.mongodb import topics_collection
from app.modules.topics.schema import TopicCreate
from app.repositories.base import BaseRepository
from bson import ObjectId


class TopicRepository(BaseRepository):
    def __init__(self, collection=topics_collection):
        super().__init__(collection)

    async def create(
        self,
        topic: TopicCreate,
    ) -> dict[str, Any]:
        topic_data = topic.model_dump()

        topic_data["created_at"] = datetime.now(timezone.utc)

        result = await self.collection.insert_one(
            topic_data
        )

        return await self.collection.find_one(
            {"_id": result.inserted_id}
        )

    async def get_all(self) -> list[dict[str, Any]]:
        cursor = self.collection.find({}).sort(
            "created_at",
            -1,
        )

        return await cursor.to_list()

    async def get_by_id(
        self,
        topic_id: ObjectId,
    ) -> dict[str, Any] | None:
        return await self.collection.find_one(
            {"_id": topic_id}
        )

    async def delete(
        self,
        topic_id: ObjectId,
    ) -> bool:
        result = await self.collection.delete_one(
            {"_id": topic_id}
        )

        return result.deleted_count > 0