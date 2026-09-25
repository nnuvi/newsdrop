from app.core.exceptions import BadRequestError, NotFoundError
from app.infra.ai.gemini import GeminiAI
from app.modules.articles.schema import ArticleResponse
from app.modules.summaries.repository import SummaryRepository
from app.modules.summaries.schema import SummaryResponse
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
    ) -> str:
        logger.debug(
            "Summarize articles request | count={} topic_ids={}",
            len(articles),
            topic_ids,
        )

        if not articles:
            logger.debug(
                "No articles to summarize | returning empty summary",
            )
            return ""

        article_ids = [article.id for article in articles if article.id]

        if not article_ids:
            logger.debug(
                "No article IDs to summarize | returning empty summary",
            )
            return ""

        if not topic_ids:
            raise BadRequestError(
                "At least one topic ID is required",
            )

        article_text = self._build_article_text(articles)

        if not article_text:
            logger.debug(
                "No article text to summarize | returning empty summary",
            )
            return ""

        summary_text = await self.gemini_ai.summarize(
            article_text,
        )

        await self.create_summary(
            articles=articles,
            topic_ids=topic_ids,
            summary_text=summary_text,
        )

        logger.debug(
            "Summary saved | article_count={} article_ids={} topic_ids={}",
            len(articles),
            article_ids,
            topic_ids,
        )

        return summary_text

    async def create_summary(
        self,
        articles: list[ArticleResponse],
        topic_ids: list[str],
        summary_text: str,
    ) -> SummaryResponse:
        if not topic_ids:
            raise BadRequestError(
                "At least one topic ID is required",
            )

        article_ids = [
            self._to_object_id(article.id) for article in articles if article.id
        ]

        if not article_ids:
            raise BadRequestError(
                "No article IDs provided",
            )

        object_topic_ids = [self._to_object_id(topic_id) for topic_id in topic_ids]

        summary = await self.repository.create(
            article_ids=article_ids,
            topic_ids=object_topic_ids,
            summary=summary_text,
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
        summary_object_id = self._to_object_id(summary_id)

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
        topic_object_id = self._to_object_id(topic_id)

        topic = await self.topic_repository.get_by_id_and_user(
            topic_object_id,
            user_id,
        )

        logger.debug("Get by Topic ID: {}", topic)

        if topic is None:
            return []

        summaries = await self.repository.get_by_topic_id(
            topic_object_id,
        )

        logger.debug("Get by Topic ID Summaries: {}", summaries)

        return [self._to_response(summary) for summary in summaries]

    async def get_by_article_id(
        self,
        article_id: str,
        user_id: ObjectId,
    ) -> SummaryResponse | None:
        article_object_id = self._to_object_id(article_id)

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
    def _build_article_text(
        articles: list[ArticleResponse],
    ) -> str:
        return "\n\n".join(
            (
                f"Title: {article.title}\n"
                f"Description: {article.description or ''}\n"
                f"Source: {article.source.name}\n"
                f"Published: {article.published_at or ''}"
            )
            for article in articles
        )

    @staticmethod
    def _to_object_id(
        value: str,
    ) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise BadRequestError("Invalid ID")

        return ObjectId(value)

    @staticmethod
    def _to_response(
        summary: dict,
    ) -> SummaryResponse:
        return SummaryResponse(
            id=str(summary["_id"]),
            topic_ids=[str(topic_id) for topic_id in summary.get("topic_ids", [])],
            article_ids=[str(article_id) for article_id in summary["article_ids"]],
            summary=summary["summary"],
            model=summary["model"],
            created_at=summary["created_at"],
        )
