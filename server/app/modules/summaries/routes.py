from fastapi import APIRouter, Depends, HTTPException, status

from modules.summaries.schema import SummaryResponse
from modules.summaries.service import SummaryService
from repositories.summary_repository import SummaryRepository


router = APIRouter(
    prefix="/summaries",
    tags=["Summaries"],
)


def get_summary_service() -> SummaryService:
    return SummaryService(SummaryRepository())


@router.get(
    "/article/{article_id}",
    response_model=SummaryResponse,
)
async def get_article_summary(
    article_id: str,
    service: SummaryService = Depends(get_summary_service),
):
    try:
        summary = await service.get_by_article_id(article_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    if summary is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Summary not found",
        )

    return summary