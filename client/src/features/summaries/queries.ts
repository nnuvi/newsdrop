import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { summaryService } from "./service";
import { summaryKeys } from "./keys";

export function useArticleSummary(articleId: string) {
  return useQuery({
    queryKey: summaryKeys.article(articleId),
    queryFn: () => summaryService.getArticleSummary(articleId),
    enabled: Boolean(articleId),
  });
}

export function useTopicSummaries(topicId: string) {
  return useQuery({
    queryKey: summaryKeys.topic(topicId),
    queryFn: () => summaryService.getTopicSummaries(topicId),
    enabled: Boolean(topicId),
  });
}

export function useGenerateSummaries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) =>
      summaryService.generateTopicSummary(topicId),

    onSuccess: async (_data, topicId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: summaryKeys.topic(topicId),
        }),
        queryClient.invalidateQueries({
          queryKey: summaryKeys.article(
            // Article summaries are not necessarily affected by topic generation.
            "",
          ),
          exact: true,
        }),
      ]);
    },
  });
}

export function useSummary(summaryId: string) {
  return useQuery({
    queryKey: summaryKeys.summary(summaryId),
    queryFn: () => summaryService.getSummary(summaryId),
    enabled: Boolean(summaryId),
  });
}
