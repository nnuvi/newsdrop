from datetime import datetime, timezone

from bson import ObjectId
from pydantic import BaseModel, Field


class UserModel(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId)

    email: str
    name: str | None = None

    password_hash: str | None = None

    # created_at: datetime = Field(
    #     default_factory=lambda: datetime.now(timezone.utc)
    # )
    # updated_at: datetime = Field(
    #     default_factory=lambda: datetime.now(timezone.utc)
    # )