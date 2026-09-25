import { useQuery } from "@tanstack/react-query";

import { summaryService } from "./service";

export const summaryKeys = {
  all: ["summaries"] as const,

  article: (articleId: string) =>
    [...summaryKeys.all, "article", articleId] as const,

  topic: (topicId: string) => [...summaryKeys.all, "topic", topicId] as const,

  summary: (summaryId: string) =>
    [...summaryKeys.all, "summary", summaryId] as const,
};

export function useArticleSummary(articleId: string) {
  return useQuery({
    queryKey: summaryKeys.article(articleId),
    queryFn: () => summaryService.getArticleSummary(articleId),
    enabled: !!articleId,
  });
}

export function useTopicSummaries(topicId: string) {
  return useQuery({
    queryKey: summaryKeys.topic(topicId),
    queryFn: () => summaryService.getTopicSummaries(topicId),
    enabled: !!topicId,
  });
}

export function useSummary(summaryId: string) {
  return useQuery({
    queryKey: summaryKeys.article(summaryId),
    queryFn: () => summaryService.getSummary(summaryId),
    enabled: !!summaryId,
  });
}
