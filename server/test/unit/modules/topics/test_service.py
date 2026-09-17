from unittest.mock import AsyncMock

import pytest
from app.modules.articles.schema import (
    ArticleListResponse,
    ArticleQuery,
)
from app.modules.topics.schema import TopicCreate
from app.modules.topics.service import TopicsService
from factories.topic import make_db_topic


@pytest.fixture
def repository():
    repository = AsyncMock()

    repository.create.return_value = make_db_topic()

    repository.get_all.return_value = [
        make_db_topic(),
        make_db_topic(
            name="Startup News",
            categories=["business"],
            tags=["startups", "funding"],
        ),
    ]

    return repository


@pytest.fixture
def article_service():
    return AsyncMock()


@pytest.fixture
def summary_service():
    return AsyncMock()


@pytest.fixture
def service(
    article_service,
    summary_service,
    repository,
):
    return TopicsService(
        article_service=article_service,
        summary_service=summary_service,
        repository=repository,
    )


async def test_create_topic(
    service,
    repository,
):
    topic = TopicCreate(
        name="AI News",
        categories=["technology"],
        tags=["ai", "machine-learning"],
    )

    result = await service.create_topic(topic)

    assert result.id is not None
    assert result.name == "AI News"
    assert result.categories == ["technology"]
    assert result.tags == [
        "ai",
        "machine-learning",
    ]

    repository.create.assert_awaited_once_with(topic)


async def test_get_topics(
    service,
    repository,
):
    result = await service.get_topics()

    assert len(result) == 2

    assert result[0].name == "AI News"
    assert result[0].categories == ["technology"]
    assert result[0].tags == [
        "ai",
        "machine-learning",
    ]

    assert result[1].name == "Startup News"
    assert result[1].categories == ["business"]
    assert result[1].tags == [
        "startups",
        "funding",
    ]

    repository.get_all.assert_awaited_once()


async def test_fetch_content(
    service,
    article_service,
    summary_service,
):
    articles_response = ArticleListResponse(
        articles=[],
        total=0,
        page=1,
        limit=10,
    )

    article_service.fetch_articles.return_value = (
        articles_response
    )

    summary_service.summarize_articles.return_value = (
        "AI news summary."
    )

    query = ArticleQuery(
        categories=["technology"],
        tags=["ai"],
        page=1,
        limit=10,
    )

    result = await service.fetch_content(query)

    assert result["articles"] == articles_response
    assert result["summary"] == "AI news summary."

    article_service.fetch_articles.assert_awaited_once_with(
        query
    )

    summary_service.summarize_articles.assert_awaited_once_with(
        articles_response.articles
    )