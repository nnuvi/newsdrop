import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useFeedback } from "@/hooks/use-feedback";
import { getApiErrorMessage } from "@/lib/api-error";

import { summaryKeys } from "./keys";
import { summaryService } from "./service";

export function useGenerateTopicSummary() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (topicId: string) =>
      summaryService.generateTopicSummary(topicId),

    onSuccess: async (_data, topicId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: summaryKeys.topic(topicId),
        }),
        queryClient.invalidateQueries({
          queryKey: summaryKeys.all,
        }),
      ]);

      success("Summary generated successfully");
    },

    onError: (err: unknown) => {
      error(getApiErrorMessage(err));
    },
  });
}
