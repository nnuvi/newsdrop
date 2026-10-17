import asyncio

from app.modules.articles.repository import ArticleRepository
from app.modules.articles.service import ArticleService
from app.modules.jobs.service import JobService
from app.modules.summaries.repository import SummaryRepository
from app.modules.summaries.service import SummaryService
from app.modules.topics.repository import TopicRepository


async def main() -> None:
    topic_repository = TopicRepository()
    summary_repository = SummaryRepository()
    article_repository = ArticleRepository()

    article_service = ArticleService(article_repository)

    summary_service = SummaryService(
        summary_repository,
        topic_repository,
        article_service,
    )

    job_service = JobService(
        TopicRepository(),
        summary_service,
    )

    await job_service.refresh_active_topics()


if __name__ == "__main__":
    asyncio.run(main())
