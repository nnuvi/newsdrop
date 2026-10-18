from datetime import UTC, datetime

from bson import ObjectId


def make_db_topic(**overrides):
    """Mimics a saved topic document stored in MongoDB."""

    base = {
        "_id": ObjectId(),
        "name": "AI News",
        "categories": ["technology"],
        "tags": ["ai", "machine-learning"],
        "created_at": datetime.now(UTC),
    }

    base.update(overrides)

    return base
