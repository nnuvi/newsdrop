import { useQuery } from "@tanstack/react-query";

import type { ArticleQuery } from "./schema";
import { articleKeys } from "./keys";
import { articleService } from "./service";

export function useArticles(query: ArticleQuery) {
  return useQuery({
    queryKey: articleKeys.list(query),
    queryFn: () => articleService.fetchArticles(query),
  });
}

export function useArticle(articleId: string) {
  return useQuery({
    queryKey: articleKeys.detail(articleId),
    queryFn: () => articleService.getArticle(articleId),
    enabled: Boolean(articleId),
  });
}
