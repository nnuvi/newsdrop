from datetime import datetime, timezone

from app.core.exceptions import BadRequestError, NotFoundError
from app.infra.news.newsapi import NewsDataAPI
from app.modules.articles.schema import (
    ArticleCreate,
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
        response = await self.news_api.fetch(query)  # raw response from NewsData API

        logger.debug("Fetch articles response | response={} ", response)

        normalized_articles = [  # map the raw response to the normalized format for storage
            self._normalize_article(article) for article in response.get("articles", [])
        ]

        if normalized_articles:
            saved_articles = await self.repository.create_articles(normalized_articles)

            articles = [self._to_response(article) for article in saved_articles]
        else:
            articles = []

        return ArticleListResponse(  # return the response to the client
            articles=articles,
            total=response.get("totalResults", 0),
            page=query.page,
            limit=query.limit,
        )

    async def get_articles(
        self,
        query: ArticleQuery,
    ) -> ArticleListResponse:
        db_articles = await self.repository.find_articles(
            categories=query.categories,
            tags=query.tags,
            page=query.page,
            limit=query.limit,
        )

        total = await self.repository.count_articles(
            categories=query.categories,
            tags=query.tags,
        )

        articles = [
            self._to_response(article)
            for article in db_articles
        ]

        return ArticleListResponse(
            articles=articles,
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
        logger.debug(
            "Get article by ID | article_id={} article={}", article_id, article
        )
        return self._to_response(article)

    @staticmethod
    def _to_object_id(article_id: str) -> ObjectId:
        if not ObjectId.is_valid(article_id):
            raise BadRequestError("Invalid article ID")

        return ObjectId(article_id)

    @staticmethod
    def _normalize_article(article: dict) -> ArticleCreate:
        return ArticleCreate(  # map and return the article in the creation format
            title=article["title"],
            description=article.get("description"),
            url=article.get("link"),
            image_url=article.get("image_url"),
            source=ArticleSource(
                name=article.get("source_name"),
                url=article.get("source_url"),
            ),
            categories=article.get("category", []),
            tags=article.get("keywords", []),
            published_at=article.get("pubDate"),
            created_at=datetime.now(timezone.utc),
        )

    @staticmethod
    def _to_response(article: dict) -> ArticleResponse:
        return ArticleResponse(
            id=str(article["_id"]),
            title=article["title"],
            description=article.get("description"),
            url=article.get("link"),
            image_url=article.get("image_url"),
            source=ArticleSource(
                name=article["source"]["name"],
                url=article["source"].get("url"),
            ),
            categories=article.get("category", []),
            tags=article.get("keywords", []),
            published_at=article.get("pubDate"),
            created_at=article["created_at"],
        )
