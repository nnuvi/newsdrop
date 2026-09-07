from datetime import datetime, timezone

from app.core.exceptions import BadRequestError, NotFoundError
from app.infra.news.newsapi import NewsDataAPI
from app.modules.articles.schema import (
    ArticleListResponse,
    ArticleQuery,
    ArticleResponse,
    ArticleSource,
)
from app.repositories.article_repository import ArticleRepository
from bson import ObjectId
from loguru import logger


class ArticleService:
    def __init__(self, repository: ArticleRepository):
        self.repository = repository
        self.news_api = NewsDataAPI()
        self.article_repository = repository

    async def fetch_articles(self, query: ArticleQuery) -> ArticleListResponse:
        logger.debug(
            "Fetch articles request | categories={} tags={} page={} limit={}",
            query.categories,
            query.tags,
            query.page,
            query.limit,
        )
        response = await self.news_api.fetch(query)

        logger.debug("Fetch articles response | response={} ", response)

        articles = [
            self._to_response(article) for article in response.get("articles", [])
        ]

        if articles:
            await self.article_repository.create_articles(articles)

        return ArticleListResponse(
            articles=articles,
            total=response.get("totalResults", 0),
            page=query.page,
            limit=query.limit,
        )

    async def get_articles(
        self,
        query: ArticleQuery,
    ) -> ArticleListResponse:
        articles = await self.repository.find_articles(
            categories=query.categories,
            tags=query.tags,
            page=query.page,
            limit=query.limit,
        )

        total = await self.repository.count_articles(
            categories=query.categories,
            tags=query.tags,
        )

        return ArticleListResponse(
            articles=[self._to_response(article) for article in articles],
            total=total,
            page=query.page,
            limit=query.limit,
        )

    async def get_article(
        self,
        article_id: str,
    ) -> ArticleResponse | None:
        object_id = self._to_object_id(article_id)

        article = await self.repository.get_by_id(object_id)

        if article is None:
            raise NotFoundError("Article not found")

        return self._to_response(article)

    @staticmethod
    def _to_object_id(article_id: str) -> ObjectId:
        if not ObjectId.is_valid(article_id):
            raise BadRequestError("Invalid article ID")

        return ObjectId(article_id)

    @staticmethod
    # def _to_response(article: dict) -> ArticleResponse:
    #     # source = article.get("source", {})

    #     return ArticleResponse(
    #         # id=str(article["_id"]),
    #         title=article["title"],
    #         description=article.get("description"),
    #         url=article.get("link"),
    #         image_url=article.get("image_url"),
    #         source=ArticleSource(
    #             name=article.get("source_name"),
    #             url=article.get("source_url"),
    #         ),
    #         categories=article.get("category", []),
    #         tags=article.get("keywords", []),
    #         published_at=article.get("pubDate"),
    #         # created_at=article["created_at"],
    #     )
    @staticmethod
    def _normalize_article(article: dict) -> dict:
        return {
            "title": article["title"],
            "description": article.get("description"),
            "link": article.get("link"),
            "image_url": article.get("image_url"),

            "source": {
                "name": article.get("source_name"),
                "url": article.get("source_url"),
            },

            "category": article.get("category", []),
            "keywords": article.get("keywords", []),
            "pubDate": article.get("pubDate"),

            "created_at": datetime.now(timezone.utc),
        }

    @staticmethod
    def _to_response(article: dict) -> ArticleResponse:
        source = article["source"]

        return ArticleResponse(
            id=str(article["_id"]),
            title=article["title"],
            description=article.get("description"),
            url=article.get("link"),
            image_url=article.get("image_url"),

            source=ArticleSource(
                name=source["name"],
                url=source.get("url"),
            ),

            categories=article.get("category", []),
            tags=article.get("keywords", []),
            published_at=article.get("pubDate"),
            created_at=article["created_at"],
        )
