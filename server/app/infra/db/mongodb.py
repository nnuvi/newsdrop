from app.core.config import settings

# from loguru import logger
from pymongo import AsyncMongoClient
from pymongo.asynchronous.collection import AsyncCollection
from pymongo.asynchronous.database import AsyncDatabase

client = AsyncMongoClient(settings.mongodb_uri)

# logger.debug(
#     "MongoDB connection established | URI={} Database={}",
#     settings.mongodb_uri,
#     settings.mongodb_database,
# )

db: AsyncDatabase = client[settings.mongodb_database]

articles_collection: AsyncCollection = db["articles"]
users_collection: AsyncCollection = db["users"]
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

