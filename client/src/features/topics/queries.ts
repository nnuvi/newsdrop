import { useQuery } from "@tanstack/react-query";

import { topicService } from "./service";

export const topicKeys = {
  all: ["topics"] as const,
  lists: () => [...topicKeys.all, "list"] as const,
  detail: (topicId: string) =>
    [...topicKeys.all, "detail", topicId] as const,
  content: (topicId: string) =>
    [...topicKeys.all, "content", topicId] as const,
};

export function useTopics() {
  return useQuery({
    queryKey: topicKeys.lists(),
    queryFn: topicService.getTopics,
  });
}

// export function useTopicContent(topicId: string) {
//   return useQuery({
//     queryKey: topicKeys.content(topicId),
//     queryFn: () => topicService.getTopicContent(topicId),
//     enabled: !!topicId,
//   });
// }