import pytest
from app.modules.topics.repository import TopicRepository
from app.modules.topics.schema import TopicCreate
from bson import ObjectId


@pytest.fixture
def topic_repository():
    return TopicRepository()


@pytest.fixture
async def clean_topics():
    from app.infra.db.mongodb import topics_collection

    await topics_collection.delete_many({})

    yield

    await topics_collection.delete_many({})


@pytest.mark.asyncio
async def test_create_topic(
    topic_repository,
    clean_topics,
):
    topic = TopicCreate(
        name="AI News",
        categories=["technology"],
        tags=["ai", "machine-learning"],
    )

    result = await topic_repository.create(topic)

    assert result is not None
    assert isinstance(result["_id"], ObjectId)

    assert result["name"] == "AI News"
    assert result["categories"] == ["technology"]
    assert result["tags"] == [
        "ai",
        "machine-learning",
    ]
    assert "created_at" in result


@pytest.mark.asyncio
async def test_get_all_topics(
    topic_repository,
    clean_topics,
):
    await topic_repository.create(
        TopicCreate(
            name="AI News",
            categories=["technology"],
            tags=["ai"],
        )
    )

    await topic_repository.create(
        TopicCreate(
            name="Startup News",
            categories=["business"],
            tags=["startups"],
        )
    )

    result = await topic_repository.get_all()

    assert len(result) == 2

    names = {topic["name"] for topic in result}

    assert names == {
        "AI News",
        "Startup News",
    }


@pytest.mark.asyncio
async def test_get_topic_by_id(
    topic_repository,
    clean_topics,
):
    created = await topic_repository.create(
        TopicCreate(
            name="AI News",
            categories=["technology"],
            tags=["ai"],
        )
    )

    result = await topic_repository.get_by_id(
        created["_id"]
    )

    assert result is not None
    assert result["_id"] == created["_id"]
    assert result["name"] == "AI News"


@pytest.mark.asyncio
async def test_delete_topic(
    topic_repository,
    clean_topics,
):
    created = await topic_repository.create(
        TopicCreate(
            name="AI News",
            categories=["technology"],
            tags=["ai"],
        )
    )

    deleted = await topic_repository.delete(
        created["_id"]
    )

    assert deleted is True

    result = await topic_repository.get_by_id(
        created["_id"]
    )

    assert result is None