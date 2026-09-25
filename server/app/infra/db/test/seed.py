from datetime import datetime, timedelta, timezone

from bson import ObjectId
from loguru import logger

from app.infra.db.mongodb import (
    articles_collection,
    summaries_collection,
    topics_collection,
    users_collection,
)

SEED_TOPIC_NAMES = {
    "Technology",
    "Science",
}

SEED_ARTICLE_URLS = {
    "https://newsdrop.test/articles/ai-development",
    "https://newsdrop.test/articles/deep-space",
}


async def seed() -> None:
    user = await users_collection.find_one({})

    if user is None:
        raise RuntimeError("No user found. Create a user before running the seed.")

    now = datetime.now(timezone.utc)

    # Remove previous seed topics.
    old_topics = await topics_collection.find(
        {
            "user_id": user["_id"],
            "name": {"$in": list(SEED_TOPIC_NAMES)},
        }
    ).to_list()

    old_topic_ids = [topic["_id"] for topic in old_topics]

    if old_topic_ids:
        await summaries_collection.delete_many(
            {"topic_ids": {"$in": old_topic_ids}}
        )

        await topics_collection.delete_many(
            {"_id": {"$in": old_topic_ids}}
        )

    # Remove previous seed articles.
    await summaries_collection.delete_many(
        {"article_ids": {"$in": []}}
    )

    await articles_collection.delete_many(
        {"url": {"$in": list(SEED_ARTICLE_URLS)}}
    )

    # Remove deleted seed topic IDs from the user.
    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$pull": {
                "topic_ids": {
                    "$in": [str(topic_id) for topic_id in old_topic_ids]
                }
            }
        },
    )

    existing_topic_ids = user.get("topic_ids", [])

    if len(existing_topic_ids) + 2 > 10:
        raise RuntimeError(
            "Cannot seed 2 topics because the user would exceed "
            "the 10 active topic limit."
        )

    # IDs
    topic1_id = ObjectId()
    topic2_id = ObjectId()

    article1_id = ObjectId()
    article2_id = ObjectId()

    # Topics
    await topics_collection.insert_many(
        [
            {
                "_id": topic1_id,
                "user_id": user["_id"],
                "name": "Technology",
                "categories": ["technology"],
                "tags": ["AI", "software", "cloud"],
                "is_active": True,
                "is_deleted": False,
                "created_at": now - timedelta(hours=2),
                "updated_at": now - timedelta(hours=2),
                "deleted_at": None,
            },
            {
                "_id": topic2_id,
                "user_id": user["_id"],
                "name": "Science",
                "categories": ["science"],
                "tags": ["space", "research", "physics"],
                "is_active": True,
                "is_deleted": False,
                "created_at": now - timedelta(hours=1),
                "updated_at": now - timedelta(hours=1),
                "deleted_at": None,
            },
        ]
    )

    # Keep User.topic_ids authoritative for active topics.
    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$addToSet": {
                "topic_ids": {
                    "$each": [
                        str(topic1_id),
                        str(topic2_id),
                    ]
                }
            }
        },
    )

    # Articles
    await articles_collection.insert_many(
        [
            {
                "_id": article1_id,
                "title": "New AI Tools Reshape Software Development",
                "description": (
                    "Developers are increasingly using AI tools "
                    "for coding, testing, and documentation."
                ),
                "url": "https://newsdrop.test/articles/ai-development",
                "source": {
                    "name": "Tech Daily",
                },
                "published_at": now - timedelta(hours=3),
                "categories": ["technology"],
                "tags": ["AI", "software"],
            },
            {
                "_id": article2_id,
                "title": "Researchers Detect New Signals From Deep Space",
                "description": (
                    "Astronomers have reported unusual signals "
                    "that may provide new information about distant objects."
                ),
                "url": "https://newsdrop.test/articles/deep-space",
                "source": {
                    "name": "Science Journal",
                },
                "published_at": now - timedelta(hours=4),
                "categories": ["science"],
                "tags": ["space", "research"],
            },
        ]
    )

    # Summaries
    await summaries_collection.insert_many(
        [
            {
                "_id": ObjectId(),
                "topic_ids": [topic1_id],
                "article_ids": [article1_id],
                "summary": (
                    "Recent advances in artificial intelligence are "
                    "changing how software teams approach coding, "
                    "testing, and documentation."
                ),
                "model": "gemini-3.6-flash",
                "created_at": now - timedelta(hours=2),
            },
            {
                "_id": ObjectId(),
                "topic_ids": [topic2_id],
                "article_ids": [article2_id],
                "summary": (
                    "New astronomical observations are giving "
                    "researchers additional information about "
                    "unusual signals detected from deep space."
                ),
                "model": "gemini-3.6-flash",
                "created_at": now - timedelta(hours=1),
            },
        ]
    )

    logger.success(
        "Seed completed | user_id={} topics=2 articles=2 summaries=2",
        user["_id"],
    )


async def main() -> None:
    await seed()


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())