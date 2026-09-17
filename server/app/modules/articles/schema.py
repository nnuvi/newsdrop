from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl


class ArticleSource(BaseModel):
    """Original publisher of the article."""

    name: str
    url: HttpUrl | None = None


class ArticleProvider(BaseModel):
    """API/provider that supplied the article."""

    name: str
    article_id: str | None = None


class FetchState(BaseModel):
    """Tracks when a category or tag was last fetched."""

    key: str
    last_fetched_at: datetime | None = None


class ArticleCreate(BaseModel):
    title: str
    description: str | None = None

    # Original article URL.
    # Used as the primary cross-provider deduplication key.
    url: HttpUrl | None = None

    image_url: HttpUrl | None = None

    source: ArticleSource

    # APIs that supplied this article.
    providers: list[ArticleProvider] = Field(default_factory=list)

    categories: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)

    published_at: datetime | None = None


class ArticleResponse(ArticleCreate):
    id: str
    created_at: datetime


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