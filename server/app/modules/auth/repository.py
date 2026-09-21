from datetime import datetime

from app.infra.db.mongodb import auth_collection


class AuthRepository:
    async def get_by_email(
        self,
        email: str,
    ) -> dict | None:
        return await auth_collection.find_one(
            {"email": email}
        )

    async def get_by_user_id(
        self,
        user_id: str,
    ) -> dict | None:
        return await auth_collection.find_one(
            {"user_id": user_id}
        )

    async def create(
        self,
        credential: dict,
    ):
        return await auth_collection.insert_one(
            credential
        )

    async def update_password(
        self,
        user_id: str,
        password_hash: str,
        password_changed_at: datetime,
    ):
        return await auth_collection.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "password_hash": password_hash,
                    "password_changed_at": password_changed_at,
                }
            },
        )

    async def get_status(
        self,
        user_id: str,
    ) -> dict | None:
        return await auth_collection.find_one(
            {"user_id": user_id},
            {
                "is_active": 1,
                "password_changed_at": 1,
            },
        )


auth_repository = AuthRepository()