
from typing import Annotated

from app.modules.auth.dependency import get_current_user
from app.modules.jobs.repository import JobRepository
from app.modules.jobs.schema import JobResponse
from app.modules.jobs.service import JobService
from app.modules.summaries.route import get_summary_service
from app.modules.summaries.service import SummaryService
from app.modules.topics.repository import TopicRepository
from app.modules.topics.route import get_topic_repository
from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    status,
)
from pydantic import BaseModel, Field

router = APIRouter(prefix="/jobs", tags=["Jobs"])


class SummaryJobRequest(BaseModel):
    topic_id: str = Field(min_length=1)


def get_job_repository() -> JobRepository:
    return JobRepository()


def get_job_service(
    job_repository: Annotated[
        JobRepository,
        Depends(get_job_repository),
    ],
    summary_service: Annotated[
        SummaryService,
        Depends(get_summary_service),
    ],
    topic_repository: Annotated[
        TopicRepository,
        Depends(get_topic_repository),
    ],
) -> JobService:
    return JobService(
        job_repository=job_repository,
        topic_repository=topic_repository,
        summary_service=summary_service
    )


@router.post(
    "/summary",
    response_model=JobResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def create_summary_job(
    payload: SummaryJobRequest,
    background_tasks: BackgroundTasks,
    current_user: Annotated[dict, Depends(get_current_user)],
    service: Annotated[JobService, Depends(get_job_service)],
) -> JobResponse:
    user_id = str(current_user["_id"])

    job = await service.create_summary_job(
        topic_id=payload.topic_id,
        user_id=user_id,
    )

    background_tasks.add_task(
        service.run_summary_job,
        job_id=job.id,
        topic_id=payload.topic_id,
        user_id=user_id,
    )

    return job


@router.get(
    "/{job_id}",
    response_model=JobResponse,
    status_code=status.HTTP_200_OK,
)
async def get_job_status(
    job_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    repository: Annotated[
        JobRepository,
        Depends(get_job_repository),
    ],
) -> JobResponse:
    job = await repository.get_by_id(
        job_id=job_id,
        user_id=str(current_user["_id"]),
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found.",
        )

    return job
