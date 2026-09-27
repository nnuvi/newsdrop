import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TopicCreate } from "./schema";
import { topicService } from "./service";

export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TopicCreate) => topicService.createTopic(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["topics"],
      });
    },
  });
}
