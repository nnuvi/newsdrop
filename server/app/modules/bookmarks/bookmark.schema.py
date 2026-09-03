from datetime import datetime

from pydantic import BaseModel


class BookmarkCreate(BaseModel):
    article_id: str


class BookmarkResponse(BaseModel):
    id: str
    article_id: str
    created_at: datetime