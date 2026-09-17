from app.core.exceptions import BadRequestError, NotFoundError
from app.infra.ai.gemini import GeminiAI
from app.modules.articles.schema import ArticleResponse
from app.modules.summaries.repository import SummaryRepository
from app.modules.summaries.schema import SummaryResponse
from bson import ObjectId
from loguru import logger


class SummaryService:
    def __init__(self, repository: SummaryRepository):
        self.repository = repository
        self.gemini_ai = GeminiAI()

    async def summarize_articles(
        self,
        articles: list[ArticleResponse],
    ) -> str:
        logger.debug(
            "Summarize articles request | count={}",
            len(articles),
        )

        if not articles:
            logger.debug(
                "No articles to summarize | returning empty summary"
            )
            return ""

        article_ids = [
            article.id
            for article in articles
            if article.id
        ]

        if not article_ids:
            logger.debug(
                "No article IDs to summarize | returning empty summary"
            )
            return ""

        logger.debug(
            "Articles selected for summary | count={} article_ids={}",
            len(article_ids),
            article_ids,
        )

        article_text = self._build_article_text(articles)

        if not article_text:
            logger.debug(
                "No article text to summarize | count={} | returning empty summary",
                len(articles),
            )
            return ""

        summary_text = await self.gemini_ai.summarize(
            article_text
        )

        logger.debug(
            "Gemini summary generated | count={} article_ids={}",
            len(articles),
            article_ids,
        )

        await self.create_summary(
            articles=articles,
            summary_text=summary_text,
        )

        logger.debug(
            "Summary saved | article_count={} article_ids={}",
            len(articles),
            article_ids,
        )

        return summary_text

    async def create_summary(
        self,
        articles: list[ArticleResponse],
        summary_text: str,
    ) -> SummaryResponse:
        article_ids = [
            self._to_object_id(article.id)
            for article in articles
        ]

        if not article_ids:
            logger.debug(
                "No article IDs available | summary not saved"
            )
            raise BadRequestError("No article IDs provided")

        summary = await self.repository.create(
            article_ids=article_ids,
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
        article_id: str,
    ) -> ObjectId:
        if not ObjectId.is_valid(article_id):
            raise BadRequestError("Invalid article ID")

        return ObjectId(article_id)

    @staticmethod
    def _to_response(
        summary: dict,
    ) -> SummaryResponse:
        return SummaryResponse(
            id=str(summary["_id"]),
            article_ids=[
                str(article_id)
                for article_id in summary["article_ids"]
            ],
            summary=summary["summary"],
            model=summary["model"],
            created_at=summary["created_at"],
        )