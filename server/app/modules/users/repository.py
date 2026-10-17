from app.infra.db.mongodb import users_collection
from app.modules.auth.repository import auth_collection
from bson import ObjectId


class UserRepository:
    async def get_by_id(
        self,
        user_id: ObjectId,
    ) -> dict | None:
        return await users_collection.find_one({"_id": user_id})

    async def get_email_by_user_id(
        self,
        user_id: ObjectId,
    ) -> str | None:
        credential = await auth_collection.find_one(
            {"user_id": str(user_id)},
            {"email": 1, "_id": 0},
        )
        return credential.get("email") if credential else None

    async def create(self, user: dict):
        return await users_collection.insert_one(user)

    async def update(
        self,
        user_id: ObjectId,
        changes: dict,
    ):
        # Keep email in the auth collection.
        email = changes.pop("email", None)

        result = None

        if changes:
            result = await users_collection.update_one(
                {"_id": user_id},
                {"$set": changes},
            )

        if email is not None:
            await auth_collection.update_one(
                {"user_id": str(user_id)},
                {"$set": {"email": email}},
            )

        return result

    async def delete(self, user_id: ObjectId):
        return await users_collection.delete_one({"_id": user_id})


user_repository = UserRepository()
