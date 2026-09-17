from datetime import datetime

from pydantic import BaseModel


class UserTopicCreate(BaseModel):
    topic_id: str


class UserTopicResponse(BaseModel):
    id: str
    user_id: str
    topic_id: str
    created_at: datetime