from datetime import datetime, timezone

from bson import ObjectId


def make_db_summary(**overrides):
    """Mimics a summary document stored in MongoDB."""

    base = {
        "_id": ObjectId(),
        "article_ids": [
            ObjectId(),
            ObjectId(),
        ],
        "summary": "This is a summary of the articles.",
        "model": "gemini",
        "created_at": datetime.now(timezone.utc),
    }

    base.update(overrides)

    return base


def make_summary_response_data(**overrides):
    """Mimics summary data returned by the API."""

    summary = make_db_summary(**overrides)

    return {
        "id": str(summary["_id"]),
        "article_ids": [
            str(article_id)
            for article_id in summary["article_ids"]
        ],
        "summary": summary["summary"],
        "model": summary["model"],
        "created_at": summary["created_at"],
    }