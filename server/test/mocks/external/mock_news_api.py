from unittest.mock import AsyncMock

from test.factories.article import make_newsapi_response


def make_mock_news_api(response=None):
    mock = AsyncMock()
    mock.fetch.return_value = response or make_newsapi_response()
    return mock