from typing import Annotated

from app.modules.articles.route import get_article_service
from app.modules.articles.service import ArticleService
from app.modules.auth.dependency import get_current_user
from app.modules.summaries.route import get_summary_service
from app.modules.summaries.service import SummaryService
from app.modules.topics.repository import TopicRepository
from app.modules.topics.schema import (
    TopicContentResponse,
    TopicCreate,
    TopicResponse,
)
from app.modules.topics.service import TopicsService
from fastapi import APIRouter, Depends, status
from loguru import logger

logger.debug("Initializing topic router")

router = APIRouter(
    prefix="/topics",
    tags=["Topics"],
)


def get_topic_repository() -> TopicRepository:
    return TopicRepository()


def get_topics_service(
    article_service: Annotated[
        ArticleService,
        Depends(get_article_service),
    ],
    summary_service: Annotated[
        SummaryService,
        Depends(get_summary_service),
    ],
    repository: Annotated[
        TopicRepository,
        Depends(get_topic_repository),
    ],
) -> TopicsService:
    return TopicsService(
        article_service=article_service,
        summary_service=summary_service,
        repository=repository,
    )


@router.get(
    "",
    response_model=list[TopicResponse],
)
async def get_topics(
    user: Annotated[dict, Depends(get_current_user)],
    service: Annotated[
        TopicsService,
        Depends(get_topics_service),
    ],
):
    logger.debug(
        "Get active topics | user_id={}",
        user["_id"],
    )

    return await service.get_topics(user)


@router.post(
    "",
    response_model=TopicResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_topic(
    body: TopicCreate,
    user: Annotated[dict, Depends(get_current_user)],
    service: Annotated[
        TopicsService,
        Depends(get_topics_service),
    ],
):
    return await service.create_topic(
        user=user,
        topic=body,
    )


@router.patch(
    "/{topic_id}/deactivate",
    response_model=TopicResponse,
)
async def deactivate_topic(
    topic_id: str,
    user: Annotated[dict, Depends(get_current_user)],
    service: Annotated[
        TopicsService,
        Depends(get_topics_service),
    ],
):
    return await service.deactivate_topic(
        user=user,
        topic_id=topic_id,
    )


@router.patch(
    "/{topic_id}/reactivate",
    response_model=TopicResponse,
)
async def reactivate_topic(
    topic_id: str,
    user: Annotated[dict, Depends(get_current_user)],
    service: Annotated[
        TopicsService,
        Depends(get_topics_service),
    ],
):
    return await service.reactivate_topic(
        user=user,
        topic_id=topic_id,
    )


@router.delete(
    "/{topic_id}",
    response_model=TopicResponse,
)
async def delete_topic(
    topic_id: str,
    user: Annotated[dict, Depends(get_current_user)],
    service: Annotated[
        TopicsService,
        Depends(get_topics_service),
    ],
):
    return await service.delete_topic(
        user=user,
        topic_id=topic_id,
    )


@router.get(
    "/{topic_id}/content",
    response_model=TopicContentResponse,
)
async def get_topic_content(
    topic_id: str,
    user: Annotated[dict, Depends(get_current_user)],
    service: Annotated[
        TopicsService,
        Depends(get_topics_service),
    ],
):
    return await service.fetch_content(
        user=user,
        topic_id=topic_id,
    )
