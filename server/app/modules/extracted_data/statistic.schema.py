from datetime import datetime

from pydantic import BaseModel, Field


class StatisticValue(BaseModel):
    label: str
    value: float
    unit: str | None = None


class Statistic(BaseModel):
    id: str

    article_id: str
    story_id: str | None = None

    metric: str
    description: str | None = None

    values: list[StatisticValue]

    source_text: str
    source_location: str | None = None

    created_at: datetime