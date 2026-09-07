import httpx
from app.core.config import settings
from app.core.exceptions import NewsAPIError
from app.modules.articles.schema import ArticleQuery
from loguru import logger


class NewsDataAPI:
    async def fetch(self, query: ArticleQuery):
        BASE_URL = "https://newsdata.io/api/1/latest"

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
            # "page": page,
            "size": query.limit,
        }

        if query.tags:
            params["q"] = " OR ".join(query.tags)

        if query.categories:
            params["category"] = ",".join(query.categories)

        logger.debug("NewsData Request | params={}", params)

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    BASE_URL,
                    params=params,
                    timeout=10.0,
                )

            response.raise_for_status()

            logger.info(
                "NewsData request successful | status={}",
                response.status_code,
            )

            return response.json()

        except httpx.HTTPStatusError:
            logger.error(
                "NewsData returned HTTP error | status={} | detail={}",
                response.status_code,
                response.text,
            )

            raise NewsAPIError(
                message=response.text,
                status_code=response.status_code,
            ) from None

        except httpx.RequestError:
            logger.error(
                "NewsData request failed | status={} | detail={}",
                response.status_code,
                response.text,
            )
            raise NewsAPIError(
                message="Failed to fetch news data",
                status_code=500,
            ) from None
