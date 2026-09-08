from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl


class ArticleSource(BaseModel):
    name: str
    url: HttpUrl | None = None


class ArticleCreate(BaseModel):
    title: str
    description: str | None = None
    url: HttpUrl | None = None
    image_url: HttpUrl | None = None
    source: ArticleSource
    categories: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    published_at: datetime | None = None
    created_at: datetime


class ArticleResponse(ArticleCreate):
    id: str


class ArticleListResponse(BaseModel):
    articles: list[ArticleResponse]
    total: int
    page: int
    limit: int


class ArticleQuery(BaseModel):
    categories: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    limit: int = Field(default=10, ge=1, le=100)
    page: int = Field(default=1, ge=1)
