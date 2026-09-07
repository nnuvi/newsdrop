from unittest.mock import AsyncMock, patch

import pytest
from app.main import app
from app.modules.articles.routes import get_article_service
from app.modules.articles.service import ArticleService
from bson import ObjectId
from test.factories.article import make_db_article


@pytest.fixture
def mock_article_repository():
    return AsyncMock()


@pytest.fixture
async def client(base_client, mock_article_repository):
    with patch("app.modules.articles.service.NewsDataAPI") as MockNewsAPI:
        MockNewsAPI.return_value.fetch = AsyncMock(
            return_value={
                "articles": [],
                "totalResults": 0,
            }
        )
        app.dependency_overrides[get_article_service] = lambda: ArticleService(
            mock_article_repository
        )
        yield base_client


async def test_fetch_articles_endpoint(client, mock_article_repository):
    response = await client.get("/articles/fetch", params={"page": 1, "limit": 10})

    assert response.status_code == 200
    data = response.json()
    assert "articles" in data
    assert data["page"] == 1
    assert data["limit"] == 10


async def test_fetch_articles_invalid_limit_rejected(client):
    response = await client.get("/articles/fetch", params={"limit": 500})  # over le=100
    assert response.status_code == 422


async def test_get_article_by_id_success(client, mock_article_repository):
    doc = make_db_article()
    mock_article_repository.get_by_id.return_value = doc

    response = await client.get(f"/articles/{doc['_id']}")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == str(doc["_id"])
    assert body["title"] == doc["title"]


async def test_get_article_not_found_returns_404(client, mock_article_repository):
    mock_article_repository.get_by_id.return_value = None

    response = await client.get(f"/articles/{ObjectId()}")

    assert response.status_code == 404


async def test_get_article_invalid_id_returns_400(client):
    response = await client.get("/articles/not-a-valid-id")
    assert response.status_code == 400
