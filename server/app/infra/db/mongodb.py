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
jobs_collection: AsyncCollection = db["jobs"]


async def create_indexes() -> None:
    await articles_collection.create_index(
        "url",
        unique=True,
        sparse=True,
    )

    await articles_collection.create_index(
        "published_at",
    )

    # await users_collection.create_index(
    #     "email",
    #     unique=True,
    # )

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

    await jobs_collection.create_index(
        [("user_id", 1), ("created_at", -1)],
        name="user_jobs_created_at",
    )

    await jobs_collection.create_index(
        [("status", 1), ("updated_at", 1)],
        name="job_status_updated_at",
    )

    await jobs_collection.create_index(
        [
            ("type", 1),
            ("resource", 1),
            ("resource_id", 1),
            ("created_at", -1),
        ],
        name="job_type_resource_created_at",
    )
