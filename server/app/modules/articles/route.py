from typing import Annotated

from app.core.logger import logger
from app.modules.articles.repository import ArticleRepository
from app.modules.articles.schema import (
    ArticleListResponse,
    ArticleQuery,
    ArticleResponse,
)
from app.modules.articles.service import ArticleService
from fastapi import APIRouter, Depends, Query

router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
)


def get_article_service() -> ArticleService:
    return ArticleService(
        repository=ArticleRepository(),
    )


@router.get(
    "/fetch",
    response_model=ArticleListResponse,
)
async def fetch_articles(
    service: Annotated[
        ArticleService,
        Depends(get_article_service),
    ],
    query: Annotated[
        ArticleQuery,
        Query(),
    ],
) -> ArticleListResponse:
    logger.debug(
        "Fetch articles | keyword={}",
        query.keyword,
    )

    result = await service.fetch_articles(query)

    logger.debug(
        "Articles fetched | count={}",
        len(result.articles),
    )

    return result


@router.get(
    "/{article_id}",
    response_model=ArticleResponse,
)
async def get_article(
    article_id: str,
    service: Annotated[
        ArticleService,
        Depends(get_article_service),
    ],
) -> ArticleResponse:
    logger.debug(
        "Get article | article_id={}",
        article_id,
    )

    return await service.get_article(article_id)
