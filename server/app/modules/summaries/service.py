from app.core.exceptions import BadRequestError, NotFoundError
from app.infra.ai.gemini import GeminiAI
from app.lib.object_id import to_object_id
from app.modules.articles.schema import ArticleResponse
from app.modules.summaries.repository import SummaryRepository
from app.modules.summaries.schema import (
    AIResponse,
    ArticleContext,
    SummaryInput,
    SummaryResponse,
)
from app.modules.topics.repository import TopicRepository
from bson import ObjectId
from loguru import logger


class SummaryService:
    def __init__(
        self,
        repository: SummaryRepository,
        topic_repository: TopicRepository,
    ):
        self.repository = repository
        self.topic_repository = topic_repository
        self.gemini_ai = GeminiAI()

    async def summarize_articles(
        self,
        articles: list[ArticleResponse],
        topic_ids: list[str],
    ) -> SummaryResponse | None:
        logger.debug(
            "Summarize articles request | count={} topic_ids={}",
            len(articles),
            topic_ids,
        )

        if not articles:
            logger.debug(
                "No articles to summarize | returning empty result",
            )
            return None

        if not topic_ids:
            raise BadRequestError(
                "At least one topic ID is required",
            )

        article_ids = [article.id for article in articles if article.id]

        if not article_ids:
            logger.debug(
                "No article IDs to summarize | returning empty result",
            )
            return None

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

        if not summary_input.articles:
            logger.debug(
                "No summary input to summarize | returning empty result",
            )
            return None

        ai_response = await self.gemini_ai.summarize(
            summary_input,
        )

        summary = await self.create_summary(
            articles=articles,
            topic_ids=topic_ids,
            summary_data=ai_response,
        )

        logger.debug(
            "Summary saved | article_count={} article_ids={} topic_ids={}",
            len(article_ids),
            article_ids,
            topic_ids,
        )

        return summary

    async def create_summary(
        self,
        articles: list[ArticleResponse],
        topic_ids: list[str],
        summary_data: AIResponse,
    ) -> SummaryResponse:
        if not topic_ids:
            raise BadRequestError(
                "At least one topic ID is required",
            )

        article_ids = [to_object_id(article.id) for article in articles if article.id]

        if not article_ids:
            raise BadRequestError(
                "No article IDs provided",
            )

        object_topic_ids = [to_object_id(topic_id) for topic_id in topic_ids]

        summary = await self.repository.create(
            article_ids=article_ids,
            topic_ids=object_topic_ids,
            title=summary_data.title,
            summary=summary_data.summary,
            statistics=[
                statistic.model_dump() for statistic in summary_data.statistics
            ],
            model=summary_data.model,
        )

        return self._to_response(summary)

    async def get_latest_summary(
        self,
    ) -> SummaryResponse:
        summary = await self.repository.get_latest()

        if summary is None:
            raise NotFoundError("Summary not found")

        return self._to_response(summary)

    async def get_by_id(
        self,
        summary_id: str,
        user_id: ObjectId,
    ) -> SummaryResponse | None:
        summary_object_id = to_object_id(summary_id)

        summary = await self.repository.get_by_id(
            summary_object_id,
        )

        if summary is None:
            return None

        if not await self._user_owns_summary(
            summary,
            user_id,
        ):
            return None

        return self._to_response(summary)

    async def get_by_topic_id(
        self,
        topic_id: str,
        user_id: ObjectId,
    ) -> list[SummaryResponse]:
        topic_object_id = to_object_id(topic_id)

        topic = await self.topic_repository.get_by_id_and_user(
            topic_object_id,
            user_id,
        )

        if topic is None:
            return []

        summaries = await self.repository.get_by_topic_id(
            topic_object_id,
        )

        return [self._to_response(summary) for summary in summaries]

    async def get_by_article_id(
        self,
        article_id: str,
        user_id: ObjectId,
    ) -> SummaryResponse | None:
        article_object_id = to_object_id(article_id)

        summary = await self.repository.get_by_article_id(
            article_object_id,
        )

        if summary is None:
            return None

        if not await self._user_owns_summary(
            summary,
            user_id,
        ):
            return None

        return self._to_response(summary)

    async def _user_owns_summary(
        self,
        summary: dict,
        user_id: ObjectId,
    ) -> bool:
        topic_ids = summary.get("topic_ids", [])

        if not topic_ids:
            return False

        for topic_id in topic_ids:
            topic = await self.topic_repository.get_by_id_and_user(
                topic_id,
                user_id,
            )

            if topic is not None:
                return True

        return False

    @staticmethod
    def _to_response(
        summary: dict,
    ) -> SummaryResponse:
        return SummaryResponse(
            id=str(summary["_id"]),
            topic_ids=[str(topic_id) for topic_id in summary.get("topic_ids", [])],
            article_ids=[
                str(article_id) for article_id in summary.get("article_ids", [])
            ],
            title=summary["title"],
            summary=summary["summary"],
            statistics=summary.get("statistics", []),
            model=summary["model"],
            created_at=summary["created_at"],
        )
