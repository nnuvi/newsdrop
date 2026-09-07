# from fastapi import APIRouter, Query

# from modules.articles import ArticleService

# router = APIRouter(prefix="/articles", tags=["Articles"])

# service = ArticleService()


# @router.get("/search")
# async def search_articles(
#     q: str = Query(min_length=1),
# ):
#     return await service.search_articles(q)

from typing import Annotated

from app.modules.articles.schema import (
    ArticleListResponse,
    ArticleQuery,
    ArticleResponse,
)
from app.modules.articles.service import ArticleService
from app.repositories.article_repository import ArticleRepository
from fastapi import APIRouter, Depends, Query
from loguru import logger

router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
)


def get_article_service() -> ArticleService:
    return ArticleService(ArticleRepository())


@router.get(
    "/fetch",
    response_model=ArticleListResponse,
)
async def fetch_articles(
    service: Annotated[ArticleService, Depends(get_article_service)],
    query: Annotated[ArticleQuery, Query()],
    # categories: Annotated[list[str] | None, Query()] = None,
    # tags: Annotated[list[str] | None, Query()] = None,
    # page: Annotated[int, Query(ge=1)] = 1,
    # limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    # query = ArticleQuery(
    #     categories=query.categories,
    #     tags=query.tags,
    #     page=query.page,
    #     limit=query.limit,
    # )
    logger.debug(
        "Get articles request | categories={} tags={} page={} limit={}",
        query.categories,
        query.tags,
        query.page,
        query.limit
    )
    return await service.fetch_articles(query)


@router.get(
    "/{article_id}",
    response_model=ArticleResponse,
)
async def get_article(
    article_id: str,
    service: Annotated[ArticleService, Depends(get_article_service)],
):
    article = await service.get_article(article_id)

    return article
