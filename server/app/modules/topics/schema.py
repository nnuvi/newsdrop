from datetime import datetime

from app.modules.articles.schema import ArticleListResponse
from pydantic import BaseModel, Field


class TopicCreate(BaseModel):
    name: str
    categories: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)


class TopicResponse(TopicCreate):
    id: str
    # created_at: datetime

class TopicContentResponse(BaseModel):
    articles: ArticleListResponse
    summary: str