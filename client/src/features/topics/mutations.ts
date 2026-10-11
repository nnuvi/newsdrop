import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useFeedback } from "@/hooks/use-feedback";
import { getApiErrorMessage } from "@/lib/api-error";

import type { TopicCreate, TopicUpdate } from "./schema";
import { topicKeys } from "./keys";
import { topicService } from "./service";

export function useCreateTopic() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (data: TopicCreate) => topicService.createTopic(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: topicKeys.all,
      });

      success("Topic created successfully");
    },

    onError: (err: unknown) => {
      error(getApiErrorMessage(err));
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: ({ topicId, data }: { topicId: string; data: TopicUpdate }) =>
      topicService.updateTopic(topicId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: topicKeys.all,
      });

      success("Topic updated successfully");
    },

    onError: (err: unknown) => {
      error(getApiErrorMessage(err));
    },
  });
}
