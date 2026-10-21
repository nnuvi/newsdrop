
import { useMutation } from "@tanstack/react-query";

import { useFeedback } from "@/hooks/use-feedback";
import { getApiErrorMessage } from "@/lib/api-error";

import { jobService } from "./service";

export function useCreateSummaryJob() {
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (topicId: string) =>
      jobService.createSummaryJob(topicId),

    onSuccess: () => {
      success("Summary generation started");
    },

    onError: (err: unknown) => {
      error(getApiErrorMessage(err));
    },
  });
}
