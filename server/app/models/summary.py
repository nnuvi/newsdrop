from datetime import datetime, timezone

from bson import ObjectId
from pydantic import BaseModel, Field


class SummaryModel(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId)

    article_id: ObjectId

    summary: str

    model: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )