import httpx
from app.core.config import settings
from app.core.exceptions import NewsAPIError
from app.core.logger import logger
from app.modules.articles.schema import ArticleQuery
from app.modules.news.category_mapping import (
    NEWSDATA_CATEGORY_MAP,
    map_categories,
)


class NewsDataAPI:
    BASE_URL = "https://newsdata.io/api/1/latest"
    DEFAULT_SIZE = 10

    async def fetch(
        self,
        query: ArticleQuery,
    ) -> dict:
        categories = map_categories(
            query.categories,
            NEWSDATA_CATEGORY_MAP,
        )

        search_query = " OR ".join(
            f'"{keyword}"' if " " in keyword else keyword for keyword in query.keywords
        )

        # tag_query = " OR ".join(f'"{tag}"' if " " in tag else tag for tag in query.tags)

        params = {
            "apikey": settings.news_api_key,
            "language": "bn,en",
            "timezone": "Asia/Dhaka",
            "removeduplicate": 1,
            "size": self.DEFAULT_SIZE,
        }

        if categories:
            params["category"] = ",".join(categories)

        if search_query:
            params["q"] = search_query

        # if tag_query:
        #     params["keywords"] = tag_query

        logger.debug(
            "NewsData request | categories={} keywords={} size={}",
            categories,
            query.keywords,
            # query.tags,
            self.DEFAULT_SIZE,
        )

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
                    self.BASE_URL,
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
                        "description": article.get("description"),
                        "category": article.get("category"),
                        "keywords": article.get("keywords"),
                        # "tags": article.get("tags"),
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
