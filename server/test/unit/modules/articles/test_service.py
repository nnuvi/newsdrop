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


@pytest.fixture
def repo():
    repository = AsyncMock()

    repository.get_stale_topics.return_value = [
        "category:technology"
    ]

    repository.upsert_articles.return_value = [
        make_db_article()
    ]

    repository.find_articles.return_value = [
        make_db_article()
    ]

    repository.count_articles.return_value = 1

    return repository


@pytest.fixture
def service(repo):
    with patch(
        "app.modules.articles.service.NewsDataAPI"
    ) as MockNewsAPI:
        instance = MockNewsAPI.return_value

        instance.fetch = AsyncMock(
            return_value=make_newsapi_response()
        )

        yield ArticleService(repo)


async def test_fetch_articles_normalizes_and_saves(
    service,
    repo,
):
    query = ArticleQuery(
        categories=["technology"],
        tags=[],
        page=1,
        limit=10,
    )

    result = await service.fetch_articles(query)

    assert result.total == 1
    assert len(result.articles) == 1
    assert result.articles[0].title == "Sample Headline"
    assert result.articles[0].source.name == "Example News"

    repo.get_stale_topics.assert_awaited_once_with(
        categories=["technology"],
        tags=[],
    )

    service.news_api.fetch.assert_awaited_once_with(query)

    repo.upsert_articles.assert_awaited_once()

    saved_articles = repo.upsert_articles.await_args.args[0]

    assert saved_articles[0].title == "Sample Headline"
    assert saved_articles[0].source.name == "Example News"
    assert str(saved_articles[0].source.url) == (
        "https://news.example.com/"
    )
    assert str(saved_articles[0].url) == (
        "https://news.example.com/article-1"
    )

    repo.update_topic_fetch_time.assert_awaited_once_with(
        ["category:technology"]
    )


async def test_fetch_articles_empty_response_skips_save(
    service,
    repo,
):
    service.news_api.fetch.return_value = {
        "articles": [],
        "totalResults": 0,
    }

    repo.find_articles.return_value = []
    repo.count_articles.return_value = 0

    query = ArticleQuery(
        categories=["technology"],
        tags=[],
        page=1,
        limit=10,
    )

    result = await service.fetch_articles(query)

    assert result.articles == []
    assert result.total == 0

    repo.upsert_articles.assert_not_awaited()

    repo.update_topic_fetch_time.assert_awaited_once_with(
        ["category:technology"]
    )


async def test_get_articles_returns_paginated_list(
    service,
    repo,
):
    repo.find_articles.return_value = [
        make_db_article()
    ]
    repo.count_articles.return_value = 1

    query = ArticleQuery(
        categories=["technology"],
        tags=[],
        page=1,
        limit=10,
    )

    result = await service.get_articles(query)

    assert result.total == 1
    assert result.page == 1
    assert result.limit == 10
    assert len(result.articles) == 1
    assert result.articles[0].title == "Sample Headline"

    repo.find_articles.assert_awaited_once_with(
        categories=["technology"],
        tags=[],
        page=1,
        limit=10,
    )

    repo.count_articles.assert_awaited_once_with(
        categories=["technology"],
        tags=[],
    )


async def test_get_article_by_id_success(
    service,
    repo,
):
    doc = make_db_article()

    repo.get_by_id.return_value = doc

    result = await service.get_article(
        str(doc["_id"])
    )

    assert result.id == str(doc["_id"])
    assert result.title == doc["title"]
    assert result.description == doc["description"]
    assert str(result.url) == doc["url"]

    repo.get_by_id.assert_awaited_once_with(
        doc["_id"]
    )


async def test_get_article_not_found_raises(
    service,
    repo,
):
    repo.get_by_id.return_value = None

    with pytest.raises(NotFoundError):
        await service.get_article(
            str(ObjectId())
        )

    repo.get_by_id.assert_awaited_once()


async def test_get_article_invalid_id_raises_bad_request(
    service,
    repo,
):
    with pytest.raises(BadRequestError):
        await service.get_article(
            "not-a-valid-object-id"
        )

    repo.get_by_id.assert_not_awaited()