from datetime import datetime

from pydantic import BaseModel, Field


class ArticleContext(BaseModel):
    id: str
    title: str
    description: str | None = None
    source: str
    published_at: datetime | None = None


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
        description="Values or breakdowns associated with the metric",
    )
    location: str | None = Field(
        default=None,
        description="Geographic or location context, if mentioned",
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
    topic_ids: list[str]
    article_ids: list[str]
    model: str
    created_at: datetime
