# from infra.news.newsapi import NewsAPI


# class ArticleService:

#     def __init__(self):
#         self.news_api = NewsAPI()

#     async def search_articles(self, query: str):
#         response = await self.news_api.search(query)

#         articles = [
#             self.normalize(article)
#             for article in response.get("articles", [])
#         ]

#         return articles

#     def normalize(self, article: dict):
#         return {
#             "title": article.get("title"),
#             "description": article.get("description"),
#             "url": article.get("url"),
#             "image_url": article.get("urlToImage"),
#             "source": {
#                 "name": article.get("source", {}).get("name"),
#             },
#             "published_at": article.get("publishedAt"),
#         }


from bson import ObjectId

from core.exceptions import BadRequestError, NotFoundError
from modules.articles.schema import (
    ArticleListResponse,
    ArticleQuery,
    ArticleResponse,
    ArticleSource,
)
from repositories.article_repository import ArticleRepository


class ArticleService:
    def __init__(self, repository: ArticleRepository):
        self.repository = repository

    # async def get_articles(
    #     self,
    #     categories: list[str],
    #     tags: list[str],
    #     page: int,
    #     limit: int,
    # ) -> ArticleListResponse:
    #     articles = await self.repository.find_articles(
    #         categories=categories,
    #         tags=tags,
    #         page=page,
    #         limit=limit,
    #     )

    #     total = await self.repository.count_articles(
    #         categories=categories,
    #         tags=tags,
    #     )

    #     return ArticleListResponse(
    #         articles=[
    #             self._to_response(article)
    #             for article in articles
    #         ],
    #         total=total,
    #         page=page,
    #         limit=limit,
    #     )

    async def get_articles(
        self,
        query: ArticleQuery,
    ) -> ArticleListResponse:
        articles = await self.repository.find_articles(
            categories=query.categories,
            tags=query.tags,
            page=query.page,
            limit=query.limit,
        )

        total = await self.repository.count_articles(
            categories=query.categories,
            tags=query.tags,
        )

        return ArticleListResponse(
            articles=[
                self._to_response(article)
                for article in articles
            ],
            total=total,
            page=query.page,
            limit=query.limit,
        )

    async def get_article(
        self,
        article_id: str,
    ) -> ArticleResponse | None:
        object_id = self._to_object_id(article_id)

        article = await self.repository.get_by_id(object_id)

        if article is None:
            raise NotFoundError("Article not found")

        return self._to_response(article)

    @staticmethod
    def _to_object_id(article_id: str) -> ObjectId:
        if not ObjectId.is_valid(article_id):
            raise BadRequestError("Invalid article ID")

        return ObjectId(article_id)

    @staticmethod
    def _to_response(article: dict) -> ArticleResponse:
        source = article.get("source", {})

        return ArticleResponse(
            id=str(article["_id"]),
            title=article["title"],
            description=article.get("description"),
            url=article.get("url"),
            image_url=article.get("image_url"),
            source=ArticleSource(
                name=source["name"],
                url=source.get("url"),
            ),
            categories=article.get("categories", []),
            tags=article.get("tags", []),
            published_at=article.get("published_at"),
            created_at=article["created_at"],
        )