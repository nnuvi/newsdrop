# from fastapi import APIRouter, Query

# from modules.articles import ArticleService

# router = APIRouter(prefix="/articles", tags=["Articles"])

# service = ArticleService()


# @router.get("/search")
# async def search_articles(
#     q: str = Query(min_length=1),
# ):
#     return await service.search_articles(q)

from fastapi import APIRouter, Depends, HTTPException, Query, status

from modules.articles.schema import (
    ArticleListResponse,
    ArticleQuery,
    ArticleResponse,
)
from modules.articles.service import ArticleService
from repositories.article_repository import ArticleRepository


router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
)


def get_article_service() -> ArticleService:
    return ArticleService(ArticleRepository())


@router.get(
    "",
    response_model=ArticleListResponse,
)
async def get_articles(
    categories: list[str] = Query(default=[]),
    tags: list[str] = Query(default=[]),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    service: ArticleService = Depends(get_article_service),
):
    query = ArticleQuery(
        categories=categories,
        tags=tags,
        page=page,
        limit=limit,
    )

    return await service.get_articles(query)


@router.get(
    "/{article_id}",
    response_model=ArticleResponse,
)
async def get_article(
    article_id: str,
    service: ArticleService = Depends(get_article_service),
):
    article = await service.get_article(article_id)

    return article