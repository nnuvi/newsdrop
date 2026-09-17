from typing import Annotated

from app.modules.articles.route import get_article_service
from app.modules.articles.schema import ArticleQuery
from app.modules.articles.service import ArticleService
from app.modules.summaries.route import get_summary_service
from app.modules.summaries.service import SummaryService
from app.modules.topics.repository import TopicRepository
from app.modules.topics.schema import TopicContentResponse
from app.modules.topics.service import TopicsService
from fastapi import APIRouter, Depends, Query
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
    response_model=TopicContentResponse,
)
async def get_topics(
    query: Annotated[ArticleQuery, Query()],
    service: Annotated[
        TopicsService,
        Depends(get_topics_service),
    ],
):
    logger.debug(
        "Get topics request | categories={} tags={} page={} limit={}",
        query.categories,
        query.tags,
        query.page,
        query.limit,
    )

    return await service.fetch_content(query)
