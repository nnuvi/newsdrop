# # modules/home/service.py

# from app.modules.articles.schema import ArticleQuery
# from app.modules.articles.service import ArticleService
# from app.modules.summaries.service import SummaryService
# from loguru import logger


# class HomeService:
#     def __init__(self, article_service: ArticleService, summary_service: SummaryService):
#         self.article_service = article_service
#         self.summary_service = summary_service

#     async def fetch_content(self, query: ArticleQuery):
#         logger.debug(
#             "Fetch articles request | categories={} tags={} page={} limit={}",
#             query.categories,
#             query.tags,
#             query.page,
#             query.limit,
#         )
#         articles = self.article_service.fetch_articles(query)

#         logger.debug(
#             "Fetch Contents Service | res={}",
#             articles
#         )
#         summary = self.summary_service.summarize_article(articles.articles)
        
