from datetime import datetime

from pydantic import BaseModel


class SummaryResponse(BaseModel):
    id: str
    topic_ids: list[str]
    article_ids: list[str]
    summary: str
    model: str
    created_at: datetime