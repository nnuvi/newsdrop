from app.core.exceptions import BadRequestError, NotFoundError
from app.infra.news.newsapi import NewsDataAPI
from app.modules.articles.repository import ArticleRepository
from app.modules.articles.schema import (
    ArticleCreate,
    ArticleListResponse,
    ArticleProvider,
    ArticleQuery,
    ArticleResponse,
    ArticleSource,
)
from bson import ObjectId
from loguru import logger


class ArticleService:
    def __init__(self, repository: ArticleRepository):
        self.repository = repository
        self.news_api = NewsDataAPI()

    async def fetch_articles(
        self,
        query: ArticleQuery,
    ) -> ArticleListResponse:

        logger.debug(
            "Fetch articles request | categories={} tags={} page={} limit={}",
            query.categories,
            query.tags,
            query.page,
            query.limit,
        )

        # stale_topics = await self.repository.get_stale_topics(
        #     categories=query.categories,
        #     tags=query.tags,
        # )

        # logger.debug(
        #     "Article fetch state | requested_categories={} "
        #     "requested_tags={}",
        #     query.categories,
        #     query.tags,
        #     stale_topics,
        # )

        # if stale_topics:
        response = await self.news_api.fetch(query)

        raw_articles = response.get("results", [])

        logger.debug(
            "Fetch articles response | requested_categories={} "
            "requested_tags={} fetched_articles_count={}",
            query.categories,
            query.tags,
            len(raw_articles),
        )

        logger.debug(
            "Top 3 raw articles | articles={}",
            raw_articles[:3],
        )

        normalized_articles = [
            self._normalize_article(article)
            for article in raw_articles
        ]

        if normalized_articles:
            logger.debug(
                "Normalized articles | requested_categories={} "
                "requested_tags={} normalized_articles_count={}",
                query.categories,
                query.tags,
                len(normalized_articles),
            )

            await self.repository.upsert_articles(
                normalized_articles
            )

            # await self.repository.update_topic_fetch_time(
            #     stale_topics
            # )

        return await self.get_articles(query)

    async def get_articles(
        self,
        query: ArticleQuery,
    ) -> ArticleListResponse:

        logger.debug(
            "Get articles request | categories={} tags={} page={} limit={}",
            query.categories,
            query.tags,
            query.page,
            query.limit,
        )

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

        logger.debug(
            "Retrieved articles | categories={} tags={} "
            "page={} limit={} total={}",
            query.categories,
            query.tags,
            query.page,
            query.limit,
            total,
        )

        articles = [
            self._to_response(article)
            for article in db_articles
        ]

        logger.debug(
            "Articles response | categories={} tags={} "
            "page={} limit={} articles_count={}",
            query.categories,
            query.tags,
            query.page,
            query.limit,
            len(articles),
        )

        return ArticleListResponse(
            articles=articles,
            total=total,
            page=query.page,
            limit=query.limit,
        )

    async def get_article(
        self,
        article_id: str,
    ) -> ArticleResponse:

        object_id = self._to_object_id(article_id)

        article = await self.repository.get_by_id(object_id)

        if article is None:
            raise NotFoundError("Article not found")

        logger.debug(
            "Get article by ID | article_id={} article={}",
            article_id,
            article,
        )

        return self._to_response(article)

    @staticmethod
    def _to_object_id(article_id: str) -> ObjectId:
        if not ObjectId.is_valid(article_id):
            raise BadRequestError("Invalid article ID")

        return ObjectId(article_id)

    @staticmethod
    def _normalize_article(
        article: dict,
    ) -> ArticleCreate:

        logger.debug(
            "Normalizing article | article_id={} title={}",
            article.get("article_id"),
            article.get("title"),
        )

        provider_name = "NewsData"
        provider_article_id = article.get("article_id")

        return ArticleCreate(
            title=article["title"],
            description=article.get("description"),
            url=article.get("link"),
            image_url=article.get("image_url"),
            source=ArticleSource(
                name=article.get("source_name", "Unknown"),
                url=article.get("source_url"),
            ),
            providers=[
                ArticleProvider(
                    name=provider_name,
                    article_id=provider_article_id,
                )
            ],
            categories=article.get("category") or [],
            tags=article.get("tags") or [],
            published_at=article.get("pubDate"),
        )

    @staticmethod
    def _to_response(
        article: dict,
    ) -> ArticleResponse:

        return ArticleResponse(
            id=str(article["_id"]),
            title=article["title"],
            description=article.get("description"),
            url=article.get("url"),
            image_url=article.get("image_url"),
            source=ArticleSource(
                name=article["source"]["name"],
                url=article["source"].get("url"),
            ),
            providers=[
                ArticleProvider(**provider)
                for provider in article.get("providers", [])
            ],
            categories=article.get("categories", []),
            tags=article.get("tags", []),
            published_at=article.get("published_at"),
            created_at=article["created_at"],
        )