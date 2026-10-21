
from datetime import datetime
from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

JobStatus = Literal["queued", "running", "completed", "failed"]


class JobType(StrEnum):
    SUMMARY_GENERATION = "summary_generation"
    ARTICLE_REFRESH = "article_refresh"


class JobResource(StrEnum):
    TOPIC = "topic"
    ARTICLE = "article"
    SUMMARY = "summary"
    USER = "user"


class JobStage(StrEnum):
    QUEUED = "queued"
    FETCHING_ARTICLES = "fetching_articles"
    SAVING_ARTICLES = "saving_articles"
    GENERATING_SUMMARY = "generating_summary"
    SAVING_SUMMARY = "saving_summary"
    REFRESHING_SUMMARY_DATA = "refreshing_summary_data"
    COMPLETED = "completed"
    FAILED = "failed"


class JobCreate(BaseModel):
    type: JobType
    user_id: str
    resource: JobResource
    resource_id: str | None = None


class JobUpdate(BaseModel):
    status: JobStatus | None = None
    stage: JobStage | None = None
    message: str | None = Field(default=None, max_length=200)
    error: str | None = None


class JobResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    type: JobType
    user_id: str
    resource: JobResource
    resource_id: str | None = None
    status: JobStatus = "queued"
    stage: JobStage = JobStage.QUEUED
    message: str = "Your summary is waiting to be generated…"
    error: str | None = None
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None = None
