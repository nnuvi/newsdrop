from typing import Annotated

from app.core.logger import logger
from app.modules.articles.repository import ArticleRepository
from app.modules.articles.service import ArticleService
from app.modules.auth.dependency import get_current_user
from app.modules.summaries.repository import SummaryRepository
from app.modules.summaries.schema import AdminSummaryResponse, SummaryResponse
from app.modules.summaries.service import SummaryService
from app.modules.topics.repository import TopicRepository
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(
    prefix="/summaries",
    tags=["Summaries"],
)


def get_summary_service() -> SummaryService:
    return SummaryService(
        repository=SummaryRepository(),
        topic_repository=TopicRepository(),
        article_service=ArticleService(
            repository=ArticleRepository(),
        ),
    )


@router.get(
    "",
    response_model=list[AdminSummaryResponse],
    response_description="Gets all summaries for the current user",
)
async def get_summaries(
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        SummaryService,
        Depends(get_summary_service),
    ],
) -> list[SummaryResponse]:
    logger.debug(
        "Get summaries | user_id={}",
        user["_id"],
    )

    return await service.get_all(
        # user_id=user["_id"],
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
) -> SummaryResponse:
    logger.debug(
        "Get article summary | article_id={} user_id={}",
        article_id,
        user["_id"],
    )

    try:
        return await service.get_by_article_id(
            article_id=article_id,
            user_id=user["_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/topic/{topic_id}",
    response_model=list[SummaryResponse],
    response_description="Gets summaries for the given topic",
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
) -> list[SummaryResponse]:
    logger.debug(
        "Get topic summaries | topic_id={} user_id={}",
        topic_id,
        user["_id"],
    )

    return await service.get_by_topic_id(
        topic_id=topic_id,
        user_id=user["_id"],
    )


@router.post(
    "/topic/{topic_id}",
    response_model=SummaryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def fetch_topic_summary(
    topic_id: str,
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        SummaryService,
        Depends(get_summary_service),
    ],
) -> SummaryResponse:
    logger.info(
        "Generate topic summary | topic_id={} user_id={}",
        topic_id,
        user["_id"],
    )

    try:
        summary = await service.generate_summary(
            topic_id=topic_id,
            user_id=user["_id"],
        )

        logger.info(
            "Topic summary generated | topic_id={} summary_id={}",
            topic_id,
            summary.id,
        )

        return summary

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


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
) -> SummaryResponse:
    logger.debug(
        "Get summary | summary_id={} user_id={}",
        summary_id,
        user["_id"],
    )

    try:
        return await service.get_by_id(
            summary_id=summary_id,
            user_id=user["_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
