from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl, model_validator


class ArticleSource(BaseModel):
    """Original publisher of the article."""

    name: str
    url: HttpUrl | None = None


class ArticleProvider(BaseModel):
    """API/provider that supplied the article."""

    name: str
    article_id: str | None = None


class FetchState(BaseModel):
    """Tracks when a set of article keywords was last fetched."""

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
    # page: int
    # limit: int


class ArticleQuery(BaseModel):
    """Normalized search criteria shared across news providers."""

    keywords: list[str] = Field(default_factory=list, max_length=50)
    categories: list[str] = Field(default_factory=list, max_length=5)
    # tags: list[str] = Field(default_factory=list, max_length=10)

    @model_validator(mode="after")
    def validate_query(self):
        for field_name in ("keywords", "categories"):
            values = getattr(self, field_name)
            normalized = list(
                dict.fromkeys(value.strip() for value in values if value.strip())
            )
            setattr(self, field_name, normalized)

        if not (self.keywords or self.categories):
            raise ValueError("At least one keyword, category, is required.")

        return self


class ArticleContext(BaseModel):
    id: str
    title: str
    description: str | None = None
    source: str
    published_at: datetime | None = None


class SummaryArticle(BaseModel):
    id: str
    title: str
    url: str
    image_url: HttpUrl | None = None
    source: str

    # limit: int = Field(default=10, ge=1, le=100)
    # page: int = Field(default=1, ge=1)
