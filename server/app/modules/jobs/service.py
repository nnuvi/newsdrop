
from app.core.logger import logger
from app.modules.summaries.service import SummaryService

# from app.jobs.repo import JobRepository
from app.modules.topics.repository import TopicRepository


class JobService:
    def __init__(
        self,
        repository: TopicRepository,
        summary_service: SummaryService,
    ):
        self.repository = repository
        self.summary_service = summary_service

    async def refresh_active_topics(self) -> None:
        topics = await self.repository.get_active_topics()

        succeeded = 0
        skipped = 0
        failed = 0

        logger.info(
            "Scheduled refresh started | topics={}",
            len(topics),
        )

        for topic in topics:
            topic_id = str(topic["_id"])
            user_id = topic["user_id"]

            try:
                summary = await self.summary_service.generate_summary(
                    topic_id=topic_id,
                    user_id=user_id,
                )

                if summary is None:
                    skipped += 1
                    continue

                succeeded += 1

            except Exception:
                failed += 1
                logger.exception(
                    "Topic refresh failed | topic_id={} user_id={}",
                    topic_id,
                    user_id,
                )

        logger.info(
            "Scheduled refresh completed | total={} succeeded={} skipped={} failed={}",
            len(topics),
            succeeded,
            skipped,
            failed,
        )
