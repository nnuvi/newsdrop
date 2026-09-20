import { api } from "@/services/api";
import { TopicResponse, TopicResponseSchema } from "./schema";

export const topicService = {
  async getTopics(): Promise<TopicResponse[]> {
    const response = await api.get<unknown>("/topics");
    console.log(response);
    return TopicResponseSchema.array().parse(response.data);
  },
};
