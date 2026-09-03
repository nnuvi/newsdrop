# from infra.ai.gemini import GeminiAI


# class SummaryService:

#     def __init__(self):
#         self.ai = GeminiAI()

#     async def summarize_article(self, article_text: str):
#         return await self.ai.summarize(article_text)

from bson import ObjectId

from core.exceptions import BadRequestError, NotFoundError
from modules.summaries.schema import SummaryResponse
from repositories.summary_repository import SummaryRepository


class SummaryService:
    def __init__(self, repository: SummaryRepository):
        self.repository = repository

    async def get_by_article_id(
        self,
        article_id: str,
    ) -> SummaryResponse | None:
        object_id = self._to_object_id(article_id)

        summary = await self.repository.get_by_article_id(
            object_id
        )

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