from app.core.exceptions import BadRequestError, NotFoundError
from app.core.logger import logger
from app.infra.ai.gemini import GeminiAI
from app.lib.object_id import to_object_id
from app.modules.articles.schema import ArticleQuery, ArticleResponse
from app.modules.articles.service import ArticleService
from app.modules.summaries.repository import SummaryRepository
from app.modules.summaries.schema import (
    AdminSummaryResponse,
    ArticleContext,
    SummaryArticle,
    SummaryInput,
    SummaryResponse,
)
from app.modules.topics.repository import TopicRepository
from bson import ObjectId


class SummaryService:
    def __init__(
        self,
        repository: SummaryRepository,
        topic_repository: TopicRepository,
        article_service: ArticleService,
    ):
        self.repository = repository
        self.topic_repository = topic_repository
        self.article_service = article_service
        self.gemini_ai = GeminiAI()

    async def get_all(self) -> list[AdminSummaryResponse]:
        summaries = await self.repository.get_all()

        return [
            self._to_admin_response(summary)
            for summary in summaries
        ]

    async def get_all_by_user(
        self,
        user_id: ObjectId,
    ) -> list[SummaryResponse]:
        summaries = await self.repository.get_all_by_user(user_id)

        return [
            self._to_response(summary)
            for summary in summaries
        ]

    async def summarize_articles(
        self,
        articles: list[ArticleResponse],
        topic_id: str,
    ) -> SummaryResponse | None:
        logger.debug(
            "Summarize articles | topic_id={} count={}",
            topic_id,
            len(articles),
        )

        if not articles:
            logger.debug(
                "No articles to summarize | topic_id={}",
                topic_id,
            )
            return None

        if not topic_id:
            raise BadRequestError("Topic ID is required")

        article_ids = [
            article.id
            for article in articles
            if article.id
        ]

        logger.debug(
            "Articles validated | topic_id={} count={}",
            topic_id,
            len(article_ids),
        )

        if not article_ids:
            logger.debug(
                "No valid article IDs | topic_id={}",
                topic_id,
            )
            return None

        topic_object_id = to_object_id(
            topic_id,
            "topic ID",
        )

        article_object_ids = [
            to_object_id(article_id, "article ID")
            for article_id in article_ids
        ]

        summary_input = SummaryInput(
            articles=[
                ArticleContext(
                    id=article.id,
                    title=article.title,
                    description=article.description,
                    source=article.source.name,
                    published_at=article.published_at,
                )
                for article in articles
                if article.id
            ],
        )

        logger.debug(
            "Summary input prepared | topic_id={} article_count={}",
            topic_id,
            len(summary_input.articles),
        )

        ai_response = await self.gemini_ai.summarize(
            summary_input,
        )

        logger.debug(
            "AI summary generated | topic_id={} model={} statistics={}",
            topic_id,
            ai_response.model,
            len(ai_response.statistics),
        )

        summary = await self.repository.create(
            topic_id=topic_object_id,
            article_ids=article_object_ids,
            title=ai_response.title,
            summary=ai_response.summary,
            statistics=[
                statistic.model_dump()
                for statistic in ai_response.statistics
            ],
            model=ai_response.model,
        )

        logger.debug(
            "Summary saved | summary_id={} topic_id={} article_count={}",
            summary["_id"],
            topic_id,
            len(article_ids),
        )

        return self._to_response(summary)

    async def generate_summary(
        self,
        topic_id: str,
        user_id: ObjectId,
    ) -> SummaryResponse | None:
        logger.debug(
            "Generate summary | topic_id={} user_id={}",
            topic_id,
            user_id,
        )

        if not topic_id:
            raise BadRequestError("Topic ID is required")

        topic_object_id = to_object_id(
            topic_id,
            "topic ID",
        )

        topic = await self.topic_repository.get_by_id_and_user(
            topic_object_id,
            user_id,
        )

        if topic is None:
            logger.debug(
                "Topic not found or not owned | topic_id={} user_id={}",
                topic_id,
                user_id,
            )
            raise NotFoundError("Topic not found")

        keywords = topic.get("keywords", [])
        categories = topic.get("categories", [])
        # tags = topic.get("tags", [])

        logger.debug(
            "Topic loaded | topic_id={} keywords={} categories={}",
            topic_id,
            keywords,
            categories,
            # tags,
        )

        query = ArticleQuery(
            keywords=keywords,
            categories=categories,
            # tags=tags,
        )

        logger.debug(
            "Article query created | topic_id={} keywords={} categories={}",
            topic_id,
            query.keywords,
            query.categories,
           
        )

        articles = await self.article_service.fetch_articles(query)

        logger.debug(
            "Articles fetched | topic_id={} count={} total={}",
            topic_id,
            len(articles.articles),
            articles.total,
        )

        if not articles.articles:
            logger.debug(
                "No articles found | topic_id={}",
                topic_id,
            )
            return None

        logger.debug(
            "Passing articles to summarization | topic_id={} count={}",
            topic_id,
            len(articles.articles),
        )

        return await self.summarize_articles(
            articles=articles.articles,
            topic_id=topic_id,
        )

    async def get_latest_summary(self) -> SummaryResponse:
        summary = await self.repository.get_latest()

        if summary is None:
            raise NotFoundError("Summary not found")

        return self._to_response(summary)

    async def get_by_id(
        self,
        summary_id: str,
        user_id: ObjectId,
    ) -> SummaryResponse:
        summary_object_id = to_object_id(
            summary_id,
            "summary ID",
        )

        summary = await self.repository.get_by_id(
            summary_object_id,
        )

        if summary is None:
            raise NotFoundError("Summary not found")

        if not await self._user_owns_summary(
            summary,
            user_id,
        ):
            raise NotFoundError("Summary not found")

        return self._to_response(summary)

    async def get_by_topic_id(
        self,
        topic_id: str,
        user_id: ObjectId,
    ) -> list[SummaryResponse]:
        logger.debug(
            "Get summaries by topic | topic_id={} user_id={}",
            topic_id,
            user_id,
        )

        topic_object_id = to_object_id(
            topic_id,
            "topic ID",
        )

        topic = await self.topic_repository.get_by_id_and_user(
            topic_object_id,
            user_id,
        )

        if topic is None:
            logger.debug(
                "Topic not found or not owned | topic_id={} user_id={}",
                topic_id,
                user_id,
            )
            raise NotFoundError("Topic not found")

        summaries = await self.repository.get_by_topic_id(
            topic_object_id,
        )

        logger.debug(
            "Summaries retrieved by topic | topic_id={} count={}",
            topic_id,
            len(summaries),
        )

        return [
            self._to_response(summary)
            for summary in summaries
        ]

    async def get_by_article_id(
        self,
        article_id: str,
        user_id: ObjectId,
    ) -> SummaryResponse:
        article_object_id = to_object_id(
            article_id,
            "article ID",
        )

        summary = await self.repository.get_by_article_id(
            article_object_id,
        )

        if summary is None:
            raise NotFoundError("Summary not found")

        if not await self._user_owns_summary(
            summary,
            user_id,
        ):
            raise NotFoundError("Summary not found")

        return self._to_response(summary)

    async def _user_owns_summary(
        self,
        summary: dict,
        user_id: ObjectId,
    ) -> bool:
        topic_id = summary.get("topic_id")

        if topic_id is None:
            return False

        topic = await self.topic_repository.get_by_id_and_user(
            topic_id,
            user_id,
        )

        return topic is not None

    @staticmethod
    def _to_response(
        summary: dict,
    ) -> SummaryResponse:
        return SummaryResponse(
            id=str(summary["_id"]),
            topic_id=str(summary["topic_id"]),
            article_ids=[
                str(article_id)
                for article_id in summary.get("article_ids", [])
            ],
            articles=[
                SummaryArticle(
                    id=article["id"],
                    title=article["title"],
                    url=article["url"],
                    image_url=article.get("image_url"),
                    source=article.get("source", ""),
                )
                for article in summary.get("articles", [])
            ],
            title=summary["title"],
            summary=summary["summary"],
            statistics=summary.get("statistics", []),
            model=summary["model"],
            created_at=summary["created_at"],
        )

    def _to_admin_response(
        self,
        summary: dict,
    ) -> AdminSummaryResponse:
        return AdminSummaryResponse(
            id=str(summary["_id"]),
            topic_id=(
                str(summary["topic_id"])
                if summary.get("topic_id")
                else None
            ),
            title=summary.get("title"),
            summary=summary["summary"],
            statistics=summary.get("statistics", []),
            model=summary["model"],
            article_ids=[
                str(article_id)
                for article_id in summary.get("article_ids", [])
            ],
            articles=[
                SummaryArticle(
                    id=article["id"],
                    title=article["title"],
                    url=article["url"],
                    image_url=article.get("image_url"),
                    source=article.get("source", ""),
                )
                for article in summary.get("articles", [])
            ],
            created_at=summary["created_at"],
        )