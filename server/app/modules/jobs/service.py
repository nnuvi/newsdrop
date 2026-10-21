from datetime import UTC, datetime

from app.core.exceptions import BadRequestError, NotFoundError
from app.core.logger import logger
from app.modules.jobs.repository import JobCreate, JobRepository
from app.modules.jobs.schema import (
    JobResource,
    JobStage,
    JobStatus,
    JobType,
    JobUpdate,
)
from app.modules.summaries.service import SummaryService
from app.modules.topics.repository import TopicRepository
from bson import ObjectId

STAGE_MESSAGES = {
    JobStage.QUEUED: "Your summary is waiting to be generated…",
    JobStage.FETCHING_ARTICLES: "Finding the latest articles…",
    JobStage.SAVING_ARTICLES: "Saving articles…",
    JobStage.GENERATING_SUMMARY: "Generating your summary with AI…",
    JobStage.SAVING_SUMMARY: "Saving your summary…",
    JobStage.REFRESHING_SUMMARY_DATA: "Updating your news feed…",
    JobStage.COMPLETED: "Your summary is ready.",
    JobStage.FAILED: "We couldn't generate your summary. Please try again.",
}


class JobService:
    def __init__(
        self,
        job_repository: JobRepository,
        topic_repository: TopicRepository,
        summary_service: SummaryService,
    ):
        self.job_repository = job_repository
        self.topic_repository = topic_repository
        self.summary_service = summary_service

    async def refresh_active_topics(self) -> None:
        topics = await self.topic_repository.get_active_topics()

        succeeded = 0
        skipped = 0
        failed = 0

        logger.info(
            "Scheduled refresh started | topics={}",
            len(topics),
        )

        for topic in topics:
            topic_id = str(topic["_id"])
            user_id = str(topic["user_id"])

            # Let unexpected failures propagate.
            summary = await self.summary_service.generate_summary(
                topic_id=topic_id,
                user_id=user_id,
            )

            if summary is None:
                skipped += 1
                continue

            succeeded += 1

        logger.info(
            "Scheduled refresh completed | total={} succeeded={} skipped={} failed={}",
            len(topics),
            succeeded,
            skipped,
            failed,
        )

    async def update_stage(
        self,
        job_id: str,
        stage: JobStage,
        *,
        error: str | None = None,
        message: str | None = None,
    ) -> None:
        if stage == JobStage.QUEUED:
            status: JobStatus = "queued"
        elif stage == JobStage.COMPLETED:
            status = "completed"
        elif stage == JobStage.FAILED:
            status = "failed"
        else:
            status = "running"

        now = datetime.now(UTC)
        update = JobUpdate(
            status=status,
            stage=stage,
            message=message or STAGE_MESSAGES[stage],
            error=error,
        )

        fields = update.model_dump(mode="json")
        fields["updated_at"] = now
        fields["completed_at"] = (
            now if stage in (JobStage.COMPLETED, JobStage.FAILED) else None
        )

        job = await self.repository.update_fields(job_id, fields)
        if job is None:
            raise NotFoundError("Job not found.")

    async def create_summary_job(
        self,
        topic_id: str,
        user_id: ObjectId,
    ):
        job = await self.job_repository.create(
            JobCreate(
                type=JobType.SUMMARY_GENERATION,
                user_id=str(user_id),
                resource=JobResource.TOPIC,
                resource_id=topic_id,
            )
        )

        logger.info(
            "Summary job created | job_id={} topic_id={}",
            job.id,
            topic_id,
        )

        return job

    async def run_summary_job(
        self,
        job_id: str,
        topic_id: str,
        user_id: ObjectId,
    ) -> None:
        logger.info(
            "Summary job started | job_id={} topic_id={}",
            job_id,
            topic_id,
        )

        try:
            summary = await self.summary_service.generate_summary(
                topic_id=topic_id,
                user_id=user_id,
                job_id=job_id,
            )
        except (BadRequestError, NotFoundError) as exc:
            await self.update_stage(
                job_id,
                JobStage.FAILED,
                error=str(exc),
            )
            logger.warning(
                "Summary job rejected | job_id={} error={}",
                job_id,
                exc,
            )
            return

        await self.update_stage(
            job_id,
            JobStage.COMPLETED,
            message=(
                "Your summary is ready."
                if summary is not None
                else "No new articles found."
            ),
        )

        logger.info(
            "Summary job finished | job_id={} has_summary={}",
            job_id,
            summary is not None,
        )
