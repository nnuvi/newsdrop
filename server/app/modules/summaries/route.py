from typing import Annotated

from app.modules.auth.dependency import get_current_user
from app.modules.summaries.repository import SummaryRepository
from app.modules.summaries.schema import SummaryResponse
from app.modules.summaries.service import SummaryService
from app.modules.topics.repository import TopicRepository
from fastapi import APIRouter, Depends, HTTPException, status
from loguru import logger

router = APIRouter(
    prefix="/summaries",
    tags=["Summaries"],
)


def get_summary_service() -> SummaryService:
    return SummaryService(
        repository=SummaryRepository(),
        topic_repository=TopicRepository(),
    )


@router.get(
    "/article/{article_id}",
    response_model=SummaryResponse,
)
async def get_article_summary(
    article_id: str,
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        SummaryService,
        Depends(get_summary_service),
    ],
):
    try:
        summary = await service.get_by_article_id(
            article_id=article_id,
            user_id=user["_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    if summary is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Summary not found",
        )

    return summary


@router.get(
    "/topic/{topic_id}",
    response_model=list[SummaryResponse],
)
async def get_topic_summaries(
    topic_id: str,
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        SummaryService,
        Depends(get_summary_service),
    ],
):
    try:
        logger.debug("Here topic_id: {}", topic_id)
        summaries = await service.get_by_topic_id(
            topic_id=topic_id,
            user_id=user["_id"],
        )
        logger.debug("Summaries from topic_id: {}",
            summaries
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return summaries


@router.get(
    "/{summary_id}",
    response_model=SummaryResponse,
)
async def get_summary(
    summary_id: str,
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        SummaryService,
        Depends(get_summary_service),
    ],
):
    try:
        summary = await service.get_by_id(
            summary_id=summary_id,
            user_id=user["_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    if summary is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Summary not found",
        )

    return summary
