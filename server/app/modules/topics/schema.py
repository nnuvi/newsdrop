
from datetime import datetime

from pydantic import BaseModel, Field, field_validator, model_validator


def normalize_name(value: str) -> str:
    return value.strip().lower()


def normalize_values(values: list[str]) -> list[str]:
    normalized = [value.strip().lower() for value in values]

    if any(not value for value in normalized):
        raise ValueError("Values cannot be empty")

    return list(dict.fromkeys(normalized))


class TopicQuery(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    keywords: list[str] = Field(default_factory=list, max_length=50)
    categories: list[str] = Field(default_factory=list, max_length=5)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = normalize_name(value)
        if not value:
            raise ValueError("Name cannot be empty")
        return value

    @field_validator("keywords", "categories")
    @classmethod
    def validate_filters(cls, values: list[str]) -> list[str]:
        return normalize_values(values)

    @model_validator(mode="after")
    def validate_at_least_one_filter(self):
        if not (self.keywords or self.categories):
            raise ValueError(
                "At least one keyword or category must be provided"
            )
        return self


class TopicCreate(TopicQuery):
    pass


class TopicUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    keywords: list[str] | None = Field(default=None, max_length=50)
    categories: list[str] | None = Field(default=None, max_length=5)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = normalize_name(value)
        if not value:
            raise ValueError("Name cannot be empty")
        return value

    @field_validator("keywords", "categories")
    @classmethod
    def validate_lists(
        cls, values: list[str] | None
    ) -> list[str] | None:
        if values is None:
            return None
        return normalize_values(values)

    @model_validator(mode="after")
    def validate_at_least_one_field(self):
        if not self.model_fields_set.intersection(
            {"name", "keywords", "categories"}
        ):
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
