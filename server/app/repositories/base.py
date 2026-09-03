from typing import Any, Generic, TypeVar

from bson import ObjectId
from pymongo.asynchronous.collection import AsyncCollection
from pymongo.results import DeleteResult, InsertOneResult, UpdateResult


T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, collection: AsyncCollection):
        self.collection = collection

    async def create(self, document: dict[str, Any]) -> InsertOneResult:
        return await self.collection.insert_one(document)

    async def get_by_id(self, document_id: ObjectId) -> dict[str, Any] | None:
        return await self.collection.find_one({"_id": document_id})

    async def update_by_id(
        self,
        document_id: ObjectId,
        updates: dict[str, Any],
    ) -> UpdateResult:
        return await self.collection.update_one(
            {"_id": document_id},
            {"$set": updates},
        )

    async def delete_by_id(self, document_id: ObjectId) -> DeleteResult:
        return await self.collection.delete_one({"_id": document_id})