from datetime import datetime, timezone

from bson import ObjectId
from pydantic import BaseModel, Field, HttpUrl


class ArticleSourceModel(BaseModel):
    name: str
    url: HttpUrl | None = None


class ArticleModel(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId)

    title: str
    description: str | None = None

    url: HttpUrl | None = None
    image_url: HttpUrl | None = None

    source: ArticleSourceModel

    categories: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)

    published_at: datetime | None = None
    # created_at: datetime = Field(
    #     default_factory=lambda: datetime.now(timezone.utc)
    # )