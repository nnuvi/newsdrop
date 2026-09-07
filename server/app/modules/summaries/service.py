from app.core.exceptions import BadRequestError, NotFoundError
from app.infra.ai.gemini import GeminiAI
from app.modules.articles.schema import (
    ArticleListResponse,
    ArticleQuery,
    ArticleResponse,
)
from app.modules.summaries.schema import SummaryResponse
from app.repositories.summary_repository import SummaryRepository
from bson import ObjectId
from loguru import logger


class SummaryService:
    def __init__(self, repository: SummaryRepository):
        self.repository = repository
        self.gemini_ai = GeminiAI()

    async def summarize_with_gemini(self, article_text: str):
        return await self.gemini_ai.summarize(article_text)

    async def summarize_article(self, articles: ArticleResponse):
        logger.debug("Summarize article request | articles={} ", articles)
        summary_text = await self.summarize_with_gemini(articles)
        logger.debug("Summarize article response | summary_text={} ", summary_text)
        return summary_text

    async def create_summary(
        self,
        article_id: str,
        summary_text: str,
    ):
        object_id = self._to_object_id(article_id)

        summary = await self.repository.create(
            article_id=object_id, summary=summary_text
        )

        return self._to_response(summary)

    async def get_by_article_id(
        self,
        article_id: str,
    ) -> SummaryResponse | None:
        object_id = self._to_object_id(article_id)

        summary = await self.repository.get_by_article_id(object_id)

        if summary is None:
            raise NotFoundError("Summary not found")

        return self._to_response(summary)

    @staticmethod
    def _to_object_id(article_id: str) -> ObjectId:
        if not ObjectId.is_valid(article_id):
            raise BadRequestError("Invalid article ID")

        return ObjectId(article_id)

    @staticmethod
    def _to_response(summary: dict) -> SummaryResponse:
        return SummaryResponse(
            id=str(summary["_id"]),
            article_id=str(summary["article_id"]),
            summary=summary["summary"],
            model=summary["model"],
            created_at=summary["created_at"],
        )
