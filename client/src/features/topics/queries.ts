import { useQuery, useQueryClient } from "@tanstack/react-query";

import { topicKeys } from "./keys";
import { topicService } from "./service";

export function useTopics() {
  return useQuery({
    queryKey: topicKeys.lists(),
    queryFn: topicService.getTopics,
  });
}

export function useTopic(topicId: string) {
  return useQuery({
    queryKey: topicKeys.detail(topicId),
    queryFn: () => topicService.getTopic(topicId),
    enabled: Boolean(topicId),
  });
}

export function useInvalidateTopics() {
  const queryClient = useQueryClient();

  return {
    invalidateTopics: () =>
      queryClient.invalidateQueries({
        queryKey: topicKeys.all,
      }),

    invalidateTopicList: () =>
      queryClient.invalidateQueries({
        queryKey: topicKeys.lists(),
      }),

    invalidateTopic: (topicId: string) =>
      queryClient.invalidateQueries({
        queryKey: topicKeys.detail(topicId),
      }),
  };
}
