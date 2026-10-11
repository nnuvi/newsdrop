import httpx
from app.core.config import settings
from app.core.exceptions import NewsAPIError
from app.core.logger import logger
from app.modules.articles.schema import ArticleQuery


class NewsDataAPI:
    async def fetch(
        self,
        query: ArticleQuery,
    ) -> dict:
        base_url = "https://newsdata.io/api/1/latest"
        size = 10

        search_query = " OR ".join(query.keywords)

        logger.debug(
            "NewsData request | keywords={} size={}",
            query.keywords,
            size,
        )

        params = {
            "apikey": settings.news_api_key,
            "language": "bn,en",
            "timezone": "Asia/Dhaka",
            "prioritydomain": "top",
            "removeduplicate": 1,
            "size": size,
            "q": search_query,
        }

        logger.debug(
            "NewsData request params | params={}",
            {
                **params,
                "apikey": "***",
            },
        )

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    base_url,
                    params=params,
                    timeout=10.0,
                )

            response.raise_for_status()

            data = response.json()
            articles = data.get("results", [])

            logger.info(
                "NewsData request successful | status={} article_count={}",
                response.status_code,
                len(articles),
            )

            logger.debug(
                "NewsData top 3 articles | articles={}",
                [
                    {
                        "id": article.get("article_id"),
                        "title": article.get("title"),
                        "keywords": query.keywords,
                        "categories": article.get("category") or [],
                        "tags": article.get("tags") or [],
                    }
                    for article in articles[:3]
                ],
            )

            return data

        except httpx.HTTPStatusError as exc:
            logger.error(
                "NewsData returned HTTP error | status={} detail={}",
                exc.response.status_code,
                exc.response.text,
            )

            raise NewsAPIError(
                message=exc.response.text,
                status_code=exc.response.status_code,
            ) from None

        except httpx.RequestError as exc:
            logger.error(
                "NewsData request failed | detail={}",
                str(exc),
            )

            raise NewsAPIError(
                message="Failed to fetch news data",
                status_code=500,
            ) from None
