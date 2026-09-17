from app.modules.articles.route import router as article_router
from app.modules.summaries.route import router as summary_router
from app.modules.topics.route import router as topic_router
from fastapi import APIRouter
from loguru import logger

api_router = APIRouter(
    prefix="/api",
)

logger.debug("Registering routers: articles, summaries, topics")

api_router.include_router(topic_router)
api_router.include_router(article_router)
api_router.include_router(summary_router)
