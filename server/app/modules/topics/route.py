from typing import Annotated

from app.core.logger import logger
from app.modules.auth.dependency import get_current_user
from app.modules.topics.repository import TopicRepository
from app.modules.topics.schema import (
    TopicCreate,
    TopicResponse,
    TopicUpdate,
)
from app.modules.topics.service import TopicService
from fastapi import APIRouter, Depends, status

logger.debug("Initializing topic router")

router = APIRouter(
    prefix="/topics",
    tags=["Topics"],
)


def get_topic_repository() -> TopicRepository:
    return TopicRepository()


def get_topic_service(
    repository: Annotated[
        TopicRepository,
        Depends(get_topic_repository),
    ],
) -> TopicService:
    return TopicService(
        repository=repository,
    )


@router.get(
    "",
    response_model=list[TopicResponse],
)
async def get_topics(
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        TopicService,
        Depends(get_topic_service),
    ],
) -> list[TopicResponse]:
    logger.debug(
        "Get topics | user_id={}",
        user["_id"],
    )

    topics = await service.get_topics(user)

    logger.debug(
        "Get topics completed | user_id={} count={}",
        user["_id"],
        len(topics),
    )

    return topics


@router.get(
    "/{topic_id}",
    response_model=TopicResponse,
)
async def get_topic(
    topic_id: str,
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        TopicService,
        Depends(get_topic_service),
    ],
) -> TopicResponse:
    logger.debug(
        "Get topic | user_id={} topic_id={}",
        user["_id"],
        topic_id,
    )

    topic = await service.get_topic(
        user=user,
        topic_id=topic_id,
    )

    logger.debug(
        "Get topic completed | topic_id={}",
        topic_id,
    )

    return topic


@router.post(
    "",
    response_model=TopicResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_topic(
    body: TopicCreate,
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        TopicService,
        Depends(get_topic_service),
    ],
) -> TopicResponse:
    logger.info(
        "Create topic | user_id={} name={}",
        user["_id"],
        body.name,
    )

    topic = await service.create_topic(
        user=user,
        topic=body,
    )

    logger.info(
        "Topic created | user_id={} topic_id={}",
        user["_id"],
        topic.id,
    )

    return topic


@router.patch(
    "/{topic_id}",
    response_model=TopicResponse,
)
async def update_topic(
    topic_id: str,
    body: TopicUpdate,
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        TopicService,
        Depends(get_topic_service),
    ],
) -> TopicResponse:
    logger.info(
        "Update topic | user_id={} topic_id={}",
        user["_id"],
        topic_id,
    )

    topic = await service.update_topic(
        user=user,
        topic_id=topic_id,
        updates=body,
    )

    logger.info(
        "Topic updated | topic_id={}",
        topic_id,
    )

    return topic


@router.patch(
    "/{topic_id}/deactivate",
    response_model=TopicResponse,
)
async def deactivate_topic(
    topic_id: str,
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        TopicService,
        Depends(get_topic_service),
    ],
) -> TopicResponse:
    logger.info(
        "Deactivate topic | user_id={} topic_id={}",
        user["_id"],
        topic_id,
    )

    topic = await service.deactivate_topic(
        user=user,
        topic_id=topic_id,
    )

    logger.info(
        "Topic deactivated | topic_id={}",
        topic_id,
    )

    return topic


@router.patch(
    "/{topic_id}/reactivate",
    response_model=TopicResponse,
)
async def reactivate_topic(
    topic_id: str,
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        TopicService,
        Depends(get_topic_service),
    ],
) -> TopicResponse:
    logger.info(
        "Reactivate topic | user_id={} topic_id={}",
        user["_id"],
        topic_id,
    )

    topic = await service.reactivate_topic(
        user=user,
        topic_id=topic_id,
    )

    logger.info(
        "Topic reactivated | topic_id={}",
        topic_id,
    )

    return topic


@router.patch(
    "/{topic_id}/delete",
    response_model=TopicResponse,
)
async def delete_topic(
    topic_id: str,
    user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    service: Annotated[
        TopicService,
        Depends(get_topic_service),
    ],
) -> TopicResponse:
    logger.info(
        "Delete topic | user_id={} topic_id={}",
        user["_id"],
        topic_id,
    )

    topic = await service.delete_topic(
        user=user,
        topic_id=topic_id,
    )

    logger.info(
        "Topic deleted | topic_id={}",
        topic_id,
    )

    return topic
