from app.modules.articles.schema import ArticleQuery
from app.modules.articles.service import ArticleService
from app.modules.summaries.service import SummaryService
from app.modules.topics.repository import TopicRepository
from app.modules.topics.schema import TopicCreate, TopicResponse
from loguru import logger


class TopicsService:
    def __init__(
        self,
        article_service: ArticleService,
        summary_service: SummaryService,
        repository: TopicRepository,
    ):
        self.article_service = article_service
        self.summary_service = summary_service
        self.repository = repository

    async def create_topic(
        self,
        topic: TopicCreate,
    ) -> TopicResponse:
        saved = await self.repository.create(topic)
        return self._to_response(saved)

    async def get_topics(self) -> list[TopicResponse]:
        topics = await self.repository.get_all()

        return [self._to_response(topic) for topic in topics]

    async def fetch_content(
        self,
        query: ArticleQuery,
    ):
        logger.debug(
            "Fetch topics request | categories={} tags={} page={} limit={}",
            query.categories,
            query.tags,
            query.page,
            query.limit,
        )

        articles = await self.article_service.fetch_articles(query)

        logger.debug(
            "Fetch topics articles response | count={}",
            len(articles.articles),
        )

        if not articles.articles:
            logger.debug(
                "No articles found for the given query | categories={} tags={} page={} limit={}",
                query.categories,
                query.tags,
                query.page,
                query.limit,
                "Returning empty summary",
            )
            return {
                "articles": articles,
                "summary": "",
            }

        summary = await self.summary_service.summarize_articles(articles.articles)

        logger.debug(
            "Fetch topics response | articles={} summary_generated={}",
            len(articles.articles),
            bool(summary),
        )

        return {
            "articles": articles,
            "summary": summary,
        }

    @staticmethod
    def _to_response(
        topic: dict,
    ) -> TopicResponse:
        return TopicResponse(
            id=str(topic["_id"]),
            name=topic["name"],
            categories=topic.get("categories", []),
            tags=topic.get("tags", []),
            created_at=topic["created_at"],
        )
