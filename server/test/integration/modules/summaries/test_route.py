from bson import ObjectId
from test.factories.summary import make_db_summary


async def test_get_article_summary_success(client, mock_summary_repository):
    doc = make_db_summary()
    mock_summary_repository.get_by_article_id.return_value = doc

    response = await client.get(f"/api/summaries/article/{doc['article_id']}")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == str(doc["_id"])
    assert body["article_id"] == str(doc["article_id"])
    assert body["summary"] == doc["summary"]


async def test_get_article_summary_not_found_returns_404(
    client, mock_summary_repository
):
    mock_summary_repository.get_by_article_id.return_value = None

    response = await client.get(f"/api/summaries/article/{ObjectId()}")

    assert response.status_code == 404


async def test_get_article_summary_invalid_id_returns_400(client):
    response = await client.get("/api/summaries/article/not-a-valid-id")

    assert response.status_code == 400