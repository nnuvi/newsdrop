from datetime import datetime, timezone

from app.modules.articles.schema import ArticleResponse, ArticleSource
from bson import ObjectId


def make_raw_article(**overrides):
    """Mimics one article returned by NewsData API."""
    base = {
        "article_id": "52a3bfb4657f036025253ea51edd9249",
        "title": "Sample Headline",
        "description": "Sample description text",
        "link": "https://news.example.com/article-1",
        "image_url": "https://news.example.com/img.png",
        "source_name": "Example News",
        "source_url": "https://news.example.com",
        "category": ["technology"],
        "keywords": ["ai", "startups"],
        "pubDate": "2026-09-01 10:00:00",
        "pubDateTZ": "Asia/Dhaka",
    }

    base.update(overrides)
    return base


def make_db_article(**overrides):
    """Mimics a normalized document stored in MongoDB."""
    base = {
        "_id": ObjectId(),
        "title": "Sample Headline",
        "description": "Sample description text",
        "url": "https://news.example.com/article-1",
        "image_url": "https://news.example.com/img.png",
        "source": {
            "name": "Example News",
            "url": "https://news.example.com",
        },
        "providers": [
            {
                "name": "NewsData",
                "article_id": "52a3bfb4657f036025253ea51edd9249",
            }
        ],
        "categories": ["technology"],
        "tags": ["ai", "startups"],
        "published_at": datetime(
            2026,
            9,
            1,
            10,
            0,
            tzinfo=timezone.utc,
        ),
        "created_at": datetime.now(timezone.utc),
    }

    base.update(overrides)
    return base


def make_newsapi_response(
    articles=None,
    total=1,
):
    return {
        "articles": (articles if articles is not None else [make_raw_article()]),
        "totalResults": total,
    }


def make_article_response(**overrides):
    """Mimics an ArticleResponse returned by the article service."""

    article = make_db_article()

    data = {
        "id": str(article["_id"]),
        "title": article["title"],
        "description": article["description"],
        "url": article["url"],
        "image_url": article["image_url"],
        "source": ArticleSource(
            name=article["source"]["name"],
            url=article["source"]["url"],
        ),
        "providers": article["providers"],
        "categories": article["categories"],
        "tags": article["tags"],
        "published_at": article["published_at"],
        "created_at": article["created_at"],
    }

    data.update(overrides)

    return ArticleResponse(**data)
