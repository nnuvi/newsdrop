from datetime import datetime

from app.modules.articles.schema import ArticleContext, SummaryArticle
from pydantic import BaseModel, Field


class SummaryInput(BaseModel):
    articles: list[ArticleContext]


class StatisticValue(BaseModel):
    label: str = Field(
        description="Label for this value, such as '2023 Actual' or 'Q1 Target'",
    )
    value: float = Field(
        description="Numerical value extracted from the article",
    )
    unit: str | None = Field(
        default=None,
        description="Unit of measurement, such as '%', 'USD', 'tons', or 'people'",
    )


class Statistic(BaseModel):
    article_id: str = Field(
        description="ID of the article from which this statistic was extracted",
    )
    metric: str = Field(
        description="Main metric name, such as 'Revenue Growth' or 'Unemployment Rate'",
    )
    description: str | None = Field(
        default=None,
        description="Additional context explaining the metric",
    )
    values: list[StatisticValue] = Field(
        default_factory=list,
        description="Values or breakdowns associated with this metric",
    )
    location: str | None = Field(
        default=None,
        description="Geographic or location context, if mentioned",
    )
    event_time: datetime | None = Field(
        default=None,
        description=(
            "Date and time when the event or measurement occurred, "
            "if explicitly stated in the article. Do not infer or estimate it."
        ),
    )


class SummaryDetails(BaseModel):
    title: str = Field(
        description="A concise title for the news summary",
    )
    summary: str = Field(
        description=(
            "Overview of the key takeaways, important details, and why the news matters"
        ),
    )
    statistics: list[Statistic] = Field(
        default_factory=list,
        description=(
            "Important numerical facts, metrics, or statistics "
            "found in the provided articles, if mentioned"
        ),
    )


class AIResponse(SummaryDetails):
    model: str


class SummaryResponse(AIResponse):
    id: str
    topic_id: str
    article_ids: list[str]
    articles: list[SummaryArticle] = Field(default_factory=list)
    created_at: datetime


class AdminSummaryResponse(BaseModel):
    id: str
    topic_id: str | None = None
    title: str | None = None
    summary: str
    statistics: list[Statistic] = Field(default_factory=list)
    model: str
    article_ids: list[str]
    articles: list[SummaryArticle] = Field(default_factory=list)
    created_at: datetime
