import api from "@/services/api";
import { logger } from "@/lib/logger";

import type {
  ArticleListResponse,
  ArticleQuery,
  ArticleResponse,
} from "./schema";

import { ArticleListResponseSchema, ArticleResponseSchema } from "./schema";

export const articleService = {
  async fetchArticles(query: ArticleQuery): Promise<ArticleListResponse> {
    logger.debug("[Article] Fetching articles", {
      query,
    });

    const response = await api.get<unknown>("/articles/fetch", {
      params: query,
    });

    return ArticleListResponseSchema.parse(response.data);
  },

  async getArticle(articleId: string): Promise<ArticleResponse> {
    logger.debug("[Article] Fetching article", {
      articleId,
    });

    const response = await api.get<unknown>(`/articles/${articleId}`);

    return ArticleResponseSchema.parse(response.data);
  },
};
