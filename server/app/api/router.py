from fastapi import APIRouter
from app.modules.articles.routes import router as article_router
from app.modules.summaries.routes import router as summary_router

api_router = APIRouter(
    prefix="/api",
)

api_router.include_router(article_router)
api_router.include_router(summary_router)
