from unittest.mock import AsyncMock, patch

import pytest
from app.core.exceptions import BadRequestError, NotFoundError
from app.modules.summaries.service import SummaryService
from bson import ObjectId
from factories.article import make_article_response
from factories.summary import make_db_summary


@pytest.fixture
def repository():
    repository = AsyncMock()

    repository.create.return_value = make_db_summary()

    repository.get_latest.return_value = make_db_summary(
        summary="Latest summary."
    )

    return repository


@pytest.fixture
def service(repository):
    with patch(
        "app.modules.summaries.service.GeminiAI"
    ) as MockGeminiAI:

        gemini = MockGeminiAI.return_value

        gemini.summarize = AsyncMock(
            return_value="This is a summary of the articles."
        )

        yield SummaryService(repository)


@pytest.fixture
def articles():
    return [
        make_article_response(
            title="Sample Headline",
            description="Sample description text.",
        ),
        make_article_response(
            title="Second Headline",
            description="Second article description.",
        ),
    ]


async def test_summarize_articles(
    service,
    articles,
):
    result = await service.summarize_articles(articles)

    assert result == "This is a summary of the articles."

    service.gemini_ai.summarize.assert_awaited_once()

    article_text = (
        service.gemini_ai.summarize
        .await_args
        .args[0]
    )

    assert "Title: Sample Headline" in article_text
    assert "Description: Sample description text." in article_text

    assert "Title: Second Headline" in article_text
    assert "Description: Second article description." in article_text


async def test_create_summary(
    service,
    repository,
    articles,
):
    summary_text = "This is a summary of the articles."

    result = await service.create_summary(
        articles=articles,
        summary_text=summary_text,
    )

    assert result.summary == summary_text
    assert result.model == "gemini"
    assert result.id is not None
    assert len(result.article_ids) == 2

    repository.create.assert_awaited_once()

    kwargs = repository.create.await_args.kwargs

    assert kwargs["summary"] == summary_text
    assert len(kwargs["article_ids"]) == 2

    assert all(
        isinstance(article_id, ObjectId)
        for article_id in kwargs["article_ids"]
    )


async def test_create_summary_invalid_article_id(
    service,
    repository,
    articles,
):
    articles[0].id = "invalid-id"

    with pytest.raises(BadRequestError):
        await service.create_summary(
            articles=articles,
            summary_text="Summary",
        )

    repository.create.assert_not_awaited()


async def test_get_latest_summary(
    service,
    repository,
):
    result = await service.get_latest_summary()

    assert result.summary == "Latest summary."
    assert result.model == "gemini"
    assert result.id is not None
    assert len(result.article_ids) == 2

    repository.get_latest.assert_awaited_once()


async def test_get_latest_summary_not_found(
    service,
    repository,
):
    repository.get_latest.return_value = None

    with pytest.raises(NotFoundError):
        await service.get_latest_summary()

    repository.get_latest.assert_awaited_once()