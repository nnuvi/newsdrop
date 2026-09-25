from datetime import datetime

from app.modules.articles.route import ArticleListResponse
from pydantic import BaseModel, Field


class TopicCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    categories: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)


class TopicResponse(TopicCreate):
    id: str
    user_id: str
    is_active: bool
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None


class TopicContentResponse(BaseModel):
    articles: ArticleListResponse
    summary: str


# from app.modules.articles.schema import ArticleListResponse
# from pydantic import BaseModel, Field


# class TopicCreate(BaseModel):
#     name: str = Field(
#         min_length=1,
#         max_length=100,
#     )
#     categories: list[str] = Field(default_factory=list)
#     tags: list[str] = Field(default_factory=list)


# class TopicResponse(TopicCreate):
#     id: str
#     user_id: str


# class TopicContentResponse(BaseModel):
#     articles: ArticleListResponse
#     summary: str
