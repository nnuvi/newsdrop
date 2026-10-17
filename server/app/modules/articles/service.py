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
            "Fetching articles | keywords={} categories={} ",
            query.keywords,
            query.categories,
            # query.tags,
        )

        response = await self.news_api.fetch(query)
        raw_articles = response.get("results", [])

        logger.debug(
            "News API response | result_count={}",
            len(raw_articles),
        )

        articles = [
            normalized
            for article in raw_articles
            if (normalized := self._normalize(article)) is not None
        ]

        logger.debug(
            "Articles normalized | count={}",
            len(articles),
        )

        if not articles:
            logger.info("No matching articles returned by NewsData")
            return self._build_article_list([])

        saved_articles = await self.repository.upsert_articles(articles)

        logger.debug(
            "Articles saved or resolved | count={}",
            len(saved_articles),
        )

        return self._build_article_list(saved_articles)

    async def get_by_summary(
        self,
        summary_id: str,
    ) -> ArticleListResponse:
        logger.debug(
            "Getting articles by summary | summary_id={}",
            summary_id,
        )

        db_articles = await self.repository.find_articles(
            summary_id=summary_id,
        )

        logger.debug(
            "Articles retrieved | summary_id={} count={}",
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
    ) -> ArticleCreate | None:
        title = article.get("title")

        if not isinstance(title, str) or not title.strip():
            logger.warning("Skipping article without a valid title | provider=NewsData")
            return None

        normalized = ArticleCreate(
            title=title.strip(),
            description=article.get("description"),
            url=article.get("link"),
            image_url=article.get("image_url"),
            source=ArticleSource(
                name=article.get("source_name") or "Unknown",
                url=article.get("source_url"),
            ),
            providers=[
                ArticleProvider(
                    name="NewsData",
                    article_id=article.get("article_id"),
                ),
            ],
            categories=ArticleService._normalize_values(
                article.get("category"),
            ),
            tags=ArticleService._normalize_values(
                article.get("tags"),
            ),
            published_at=article.get("pubDate"),
        )

        return normalized

    @staticmethod
    def _normalize_values(
        values: list[str] | None,
    ) -> list[str]:
        if not values:
            return []

        normalized: list[str] = []
        seen: set[str] = set()

        for value in values:
            if not isinstance(value, str):
                continue

            value = value.strip().lower()

            if value and value not in seen:
                normalized.append(value)
                seen.add(value)

        return normalized

    @staticmethod
    def _to_response(
        article: dict,
    ) -> ArticleResponse:
        source = article.get("source") or {}

        return ArticleResponse(
            id=str(article["_id"]),
            title=article["title"],
            description=article.get("description"),
            url=article.get("url"),
            image_url=article.get("image_url"),
            source=ArticleSource(
                name=source.get("name", "Unknown"),
                url=source.get("url"),
            ),
            providers=[
                ArticleProvider(**provider) for provider in article.get("providers", [])
            ],
            categories=article.get("categories", []),
            tags=article.get("tags", []),
            published_at=article.get("published_at"),
            created_at=article["created_at"],
        )
