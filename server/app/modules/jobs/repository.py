from datetime import UTC, datetime
from uuid import uuid4

from app.infra.db.mongodb import jobs_collection
from app.modules.jobs.schema import JobCreate, JobResponse
from pymongo import ReturnDocument
from pymongo.asynchronous.collection import AsyncCollection


class JobRepository:
    def __init__(self):
        self.collection: AsyncCollection = jobs_collection

    async def create(self, data: JobCreate) -> JobResponse:
        now = datetime.now(UTC)

        document = {
            "_id": str(uuid4()),
            **data.model_dump(mode="json"),
            "status": "queued",
            "stage": "queued",
            "message": "Your summary is waiting to be generated…",
            "error": None,
            "created_at": now,
            "updated_at": now,
            "completed_at": None,
        }

        await self.collection.insert_one(document)

        return JobResponse.model_validate(document)

    async def get_by_id(
        self,
        job_id: str,
        user_id: str | None = None,
    ) -> JobResponse | None:
        query: dict[str, str] = {"_id": job_id}

        if user_id is not None:
            query["user_id"] = user_id

        document = await self.collection.find_one(query)

        if document is None:
            return None

        return JobResponse.model_validate(document)

    async def update_fields(
        self,
        job_id: str,
        fields: dict,
    ) -> JobResponse | None:
        document = await self.collection.find_one_and_update(
            {"_id": job_id},
            {"$set": fields},
            return_document=ReturnDocument.AFTER,
        )

        if document is None:
            return None

        return JobResponse.model_validate(document)

    async def list_by_user(
        self,
        user_id: str,
        limit: int = 20,
    ) -> list[JobResponse]:
        cursor = (
            self.collection.find({"user_id": user_id})
            .sort("created_at", -1)
            .limit(limit)
        )

        return [JobResponse.model_validate(document) async for document in cursor]
