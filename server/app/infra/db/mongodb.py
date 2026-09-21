from app.core.config import settings
from pymongo import AsyncMongoClient
from pymongo.asynchronous.collection import AsyncCollection
from pymongo.asynchronous.database import AsyncDatabase

client = AsyncMongoClient(settings.mongodb_uri)

db: AsyncDatabase = client[settings.mongodb_database]


articles_collection: AsyncCollection = db["articles"]
users_collection: AsyncCollection = db["users"]
auth_collection: AsyncCollection = db["auth"]
summaries_collection: AsyncCollection = db["summaries"]
topics_collection: AsyncCollection = db["topics"]
fetch_state_collection: AsyncCollection = db["fetch_state"]


async def create_indexes() -> None:
    await articles_collection.create_index(
        "url",
        unique=True,
        sparse=True,
    )

    await articles_collection.create_index(
        "published_at",
    )

    await users_collection.create_index(
        "email",
        unique=True,
    )

    await users_collection.create_index(
        "username",
        unique=True,
    )

    await auth_collection.create_index(
        "email",
        unique=True,
    )

    await auth_collection.create_index(
        "user_id",
        unique=True,
    )
