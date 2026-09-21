from app.infra.db.mongodb import users_collection
from bson import ObjectId


class UserRepository:
    async def get_by_id(
        self,
        user_id: ObjectId,
    ) -> dict | None:
        return await users_collection.find_one(
            {"_id": user_id}
        )

    async def create(
        self,
        user: dict,
    ):
        return await users_collection.insert_one(user)

    async def update(
        self,
        user_id: ObjectId,
        changes: dict,
    ):
        return await users_collection.update_one(
            {"_id": user_id},
            {"$set": changes},
        )

    async def delete(
        self,
        user_id: ObjectId,
    ):
        return await users_collection.delete_one(
            {"_id": user_id}
        )


user_repository = UserRepository()