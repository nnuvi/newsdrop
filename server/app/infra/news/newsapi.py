import httpx

from app.core.config import settings
from app.core.exceptions import NewsAPIError
from app.modules.articles.schema import ArticleQuery
from loguru import logger


class NewsDataAPI:
    async def fetch(
        self,
        query: ArticleQuery,
    ):
        base_url = "https://newsdata.io/api/1/latest"

        logger.debug(
            "NewsData request | tags={} categories={} page={} size={}",
            query.tags,
            query.categories,
            query.page,
            query.limit,
        )

        params = {
            "apikey": settings.news_api_key,
            "language": "bn,en",
            "timezone": "Asia/Dhaka",
            "prioritydomain": "top",
            "removeduplicate": 1,
            "size": query.limit,
        }

        if query.tags:
            params["q"] = " OR ".join(query.tags)

        if query.categories:
            params["category"] = ",".join(query.categories)

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
                "NewsData request successful | status={} "
                "article_count={}",
                response.status_code,
                len(articles),
            )

            logger.debug(
                "NewsData top 3 articles | articles={}",
                articles[:3],
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