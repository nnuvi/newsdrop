import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TopicCreate } from "./schema";
import { topicService } from "./service";
import { getApiErrorMessage } from "@/lib/api-error";
import { useFeedback } from "@/hooks/use-feedback";

export function useCreateTopic() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (data: TopicCreate) => topicService.createTopic(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["topics"],
      });
    },

    onError: (err: unknown) => {
      error(err, getApiErrorMessage(error));
    },
  });
}
