import httpx
from loguru import logger

from core.config import settings


class NewsDataAPI:
    BASE_URL = "https://newsdata.io/api/1/latest"

    async def search(
        self,
        tags: list[str] | None = None,
        categories: list[str] | None = None,
        page: int = 1,
        page_size: int = 20,
    ):
        params = {
            "apikey": settings.news_api_key,
            "language": "bn,en",
            "timezone": "Asia/Dhaka",
            "prioritydomain": "top",
            "removeduplicate": 1,
            "page": page,
            "size": page_size,
        }

        if tags:
            params["q"] = " OR ".join(tags)

        if categories:
            params["category"] = ",".join(categories)

        logger.debug(
            "NewsData request | tags={} categories={} page={} size={}",
            tags,
            categories,
            page,
            page_size,
        )

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.BASE_URL,
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
            logger.exception(
                "NewsData returned HTTP error | status={}",
                response.status_code,
            )
            raise

        except httpx.RequestError:
            logger.exception(
                "NewsData request failed"
            )
            raise