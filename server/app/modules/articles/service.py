from app.core.exceptions import NotFoundError
from app.core.logger import logger
from app.infra.news.newsapi import NewsDataAPI
from app.lib.object_id import to_object_id
from app.modules.articles.repository import ArticleRepository
from app.modules.articles.schema import (
    ArticleCreate,
    ArticleListResponse,
    ArticleProvider,
    ArticleQuery,
    ArticleResponse,
    ArticleSource,
)


class ArticleService:
    def __init__(self, repository: ArticleRepository):
        self.repository = repository
        self.news_api = NewsDataAPI()

    async def fetch_articles(
        self,
        query: ArticleQuery,
    ) -> ArticleListResponse:
        logger.debug(
            "Fetch articles | keywords={}",
            query.keywords,
        )

        response = await self.news_api.fetch(query)
        raw_articles = response.get("results", [])

        logger.debug(
            "News API response | keywords={} count={}",
            query.keywords,
            len(raw_articles),
        )

        articles = [self._normalize(article) for article in raw_articles]

        logger.debug(
            "Articles normalized | count={}",
            len(articles),
        )

        if not articles:
            logger.debug(
                "No articles to save | keywords={}",
                query.keywords,
            )
            return self._build_article_list([])

        saved_articles = await self.repository.upsert_articles(
            articles,
        )

        article_ids = [article["_id"] for article in saved_articles]

        logger.debug(
            "Articles resolved | count={} article_ids={}",
            len(article_ids),
            article_ids,
        )

        return self._build_article_list(saved_articles)

    async def get_by_summary(
        self,
        summary_id: str,
    ) -> ArticleListResponse:
        logger.debug(
            "Get articles by summary | summary_id={}",
            summary_id,
        )

        db_articles = await self.repository.find_articles(
            summary_id=summary_id,
        )

        logger.debug(
            "Articles retrieved by summary | summary_id={} count={}",
            summary_id,
            len(db_articles),
        )

        return self._build_article_list(db_articles)

    async def get_by_id(
        self,
        article_id: str,
    ) -> ArticleResponse:
        object_id = to_object_id(article_id)

        article = await self.repository.get_by_id(object_id)

        if article is None:
            logger.debug(
                "Article not found | article_id={}",
                article_id,
            )
            raise NotFoundError("Article not found")

        logger.debug(
            "Article retrieved | article_id={}",
            article_id,
        )

        return self._to_response(article)

    @staticmethod
    def _build_article_list(
        db_articles: list[dict],
    ) -> ArticleListResponse:
        return ArticleListResponse(
            articles=[ArticleService._to_response(article) for article in db_articles],
            total=len(db_articles),
        )

    @staticmethod
    def _normalize(
        article: dict,
    ) -> ArticleCreate:
        normalized = ArticleCreate(
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
                    name="NewsData",
                    article_id=article.get("article_id"),
                ),
            ],
            categories=[
                category.strip().lower()
                for category in article.get("category") or []
                if category
            ],
            tags=[tag.strip().lower() for tag in article.get("tags") or [] if tag],
            published_at=article.get("pubDate"),
        )

        logger.debug(
            "Article normalized | provider_id={} title={}",
            article.get("article_id"),
            normalized.title,
        )

        return normalized

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
                ArticleProvider(**provider) for provider in article.get("providers", [])
            ],
            categories=article.get("categories", []),
            tags=article.get("tags", []),
            published_at=article.get("published_at"),
            created_at=article["created_at"],
        )
