from unittest.mock import AsyncMock, patch

import pytest
from app.core.exceptions import BadRequestError, NotFoundError
from app.modules.articles.schema import ArticleQuery
from app.modules.articles.service import ArticleService
from bson import ObjectId
from factories.article import (
    make_db_article,
    make_newsapi_response,
)
from loguru import logger


@pytest.fixture
def repo():
    repository = AsyncMock()
    repository.create_articles.return_value = [make_db_article()]
    return repository


@pytest.fixture
def service(
    repo,
):  # service fixture that patches NewsDataAPI for testing ArticleService
    # Patch NewsDataAPI at the point ArticleService imports it,
    # since it's instantiated internally rather than injected.
    with patch("app.modules.articles.service.NewsDataAPI") as MockNewsAPI:
        instance = MockNewsAPI.return_value
        instance.fetch = AsyncMock(return_value=make_newsapi_response())
        yield ArticleService(repo)


async def test_fetch_articles_normalizes_and_saves(service, repo):
    query = ArticleQuery(categories=["technology"], page=1, limit=10)

    result = await service.fetch_articles(query)

    assert result.total == 1
    assert len(result.articles) == 1
    assert result.articles[0].title == "Sample Headline"
    assert result.articles[0].source.name == "Example News"
    # confirms normalized articles were persisted
    repo.create_articles.assert_awaited_once()

    saved_articles = repo.create_articles.await_args.args[0]

    assert saved_articles[0].title == "Sample Headline"
    assert saved_articles[0].source.name == "Example News"
    assert str(saved_articles[0].source.url) == "https://news.example.com/"


async def test_fetch_articles_empty_response_skips_save(service, repo):
    service.news_api.fetch.return_value = {"articles": [], "totalResults": 0}
    query = ArticleQuery(page=1, limit=10)

    result = await service.fetch_articles(query)

    logger.debug("Fetch articles result: {}", result)

    assert result.articles == []
    assert result.total == 0
    repo.create_articles.assert_not_awaited()


async def test_get_articles_returns_paginated_list(service, repo):
    repo.find_articles.return_value = [make_db_article()]
    repo.count_articles.return_value = 1
    query = ArticleQuery(categories=["technology"], page=1, limit=10)

    result = await service.get_articles(query)

    assert result.total == 1
    assert result.page == 1
    assert result.articles[0].title == "Sample Headline"
    repo.find_articles.assert_awaited_once_with(
        categories=["technology"], tags=[], page=1, limit=10
    )


async def test_get_article_by_id_success(service, repo):
    doc = make_db_article()
    repo.get_by_id.return_value = doc

    result = await service.get_article(str(doc["_id"]))

    assert result.id == str(doc["_id"])
    assert result.title == doc["title"]
    assert result.description == doc["description"]


async def test_get_article_not_found_raises(service, repo):
    repo.get_by_id.return_value = None

    with pytest.raises(NotFoundError):
        await service.get_article(str(ObjectId()))


async def test_get_article_invalid_id_raises_bad_request(service, repo):
    with pytest.raises(BadRequestError):
        await service.get_article("not-a-valid-object-id")
    repo.get_by_id.assert_not_awaited()
