# from pymongo import AsyncMongoClient

# from core.config import settings


# client = AsyncMongoClient(settings.mongodb_uri)

# db = client[settings.mongodb_database]

# articles_collection = db["articles"]
# users_collection = db["users"]
# summaries_collection = db["summaries"]
# bookmarks_collection = db["bookmarks"]

from app.core.config import settings
from pymongo import AsyncMongoClient
from pymongo.asynchronous.collection import AsyncCollection
from pymongo.asynchronous.database import AsyncDatabase

client = AsyncMongoClient(settings.mongodb_uri)

db: AsyncDatabase = client[settings.mongodb_database]

articles_collection: AsyncCollection = db["articles"]
users_collection: AsyncCollection = db["users"]
summaries_collection: AsyncCollection = db["summaries"]

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

    await summaries_collection.create_index(
        "article_id",
        unique=True,
    )