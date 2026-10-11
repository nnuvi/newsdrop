from datetime import datetime

from pydantic import BaseModel, Field, field_validator, model_validator


class TopicQuery(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    keywords: list[str] = Field(
        min_length=1,
        max_length=10,
    )

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("keywords")
    @classmethod
    def normalize_keywords(cls, values: list[str]) -> list[str]:
        normalized = [keyword.strip().lower() for keyword in values]

        if any(not keyword for keyword in normalized):
            raise ValueError("Keywords cannot be empty")

        return list(dict.fromkeys(normalized))


class TopicCreate(TopicQuery):
    categories: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)


class TopicUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    keywords: list[str] | None = Field(
        default=None,
        min_length=1,
        max_length=10,
    )

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str | None) -> str | None:
        return value.strip().lower() if value is not None else None

    @field_validator("keywords")
    @classmethod
    def normalize_keywords(
        cls,
        values: list[str] | None,
    ) -> list[str] | None:
        if values is None:
            return None

        normalized = [keyword.strip().lower() for keyword in values]

        if any(not keyword for keyword in normalized):
            raise ValueError("Keywords cannot be empty")

        return list(dict.fromkeys(normalized))

    @model_validator(mode="after")
    def validate_at_least_one_field(self):
        if self.name is None and self.keywords is None:
            raise ValueError("At least one field must be provided for update")

        return self


class TopicResponse(TopicCreate):
    id: str
    user_id: str
    is_active: bool
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None
