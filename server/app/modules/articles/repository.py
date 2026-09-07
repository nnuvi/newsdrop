# from typing import Any

# from infra.db.mongodb import articles_collection
# from modules.articles.schema import ArticleResponse
# from pymongo.asynchronous.collection import AsyncCollection
# from repositories.base import BaseRepository


# class ArticleRepository(BaseRepository):
#     def __init__(
#         self,
#         collection: AsyncCollection = articles_collection,
#     ):
#         super().__init__(collection)

#     async def create_article(
#         self,
#         articles: ArticleResponse[],
#     ):
#         result = await self.collection.insert_one(article.model_dump())

#         return result

#     async def find_articles(
#         self,
#         categories: list[str] | None = None,
#         tags: list[str] | None = None,
#         page: int = 1,
#         limit: int = 10,
#     ) -> list[dict[str, Any]]:
#         filters: dict[str, Any] = {}

#         if categories:
#             filters["categories"] = {"$in": categories}

#         if tags:
#             filters["tags"] = {"$in": tags}

#         skip = (page - 1) * limit

#         cursor = (
#             self.collection.find(filters)
#             .sort("published_at", -1)
#             .skip(skip)
#             .limit(limit)
#         )

#         return await cursor.to_list()

#     async def count_articles(
#         self,
#         categories: list[str] | None = None,
#         tags: list[str] | None = None,
#     ) -> int:
#         filters: dict[str, Any] = {}

#         if categories:
#             filters["categories"] = {"$in": categories}

#         if tags:
#             filters["tags"] = {"$in": tags}

#         return await self.collection.count_documents(filters)

#     async def get_by_url(self, url: str) -> dict[str, Any] | None:
#         return await self.collection.find_one({"url": url})
