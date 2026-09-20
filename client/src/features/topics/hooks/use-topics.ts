import { useQuery } from "@tanstack/react-query";

import { topicService } from "../service";

export function useTopics() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: topicService.getTopics,
  });
}
