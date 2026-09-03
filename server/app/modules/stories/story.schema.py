from datetime import datetime

from pydantic import BaseModel


class StoryResponse(BaseModel):
    id: str
    title: str
    article_ids: list[str]
    topics: list[str]
    created_at: datetime
    updated_at: datetime