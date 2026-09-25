import api from "@/services/api";

import {
  TopicCreate,
  TopicResponse,
  TopicResponseSchema,
} from "./schema";

export const topicService = {
  async getTopics(): Promise<TopicResponse[]> {
    const response = await api.get<unknown>("/topics");

    return TopicResponseSchema.array().parse(response.data);
  },

  async createTopic(data: TopicCreate): Promise<TopicResponse> {
    const response = await api.post<unknown>("/topics", data);

    return TopicResponseSchema.parse(response.data);
  },

  async deactivateTopic(topicId: string): Promise<TopicResponse> {
    const response = await api.patch<unknown>(
      `/topics/${topicId}/deactivate`,
    );

    return TopicResponseSchema.parse(response.data);
  },

  async reactivateTopic(topicId: string): Promise<TopicResponse> {
    const response = await api.patch<unknown>(
      `/topics/${topicId}/reactivate`,
    );

    return TopicResponseSchema.parse(response.data);
  },

  async deleteTopic(topicId: string): Promise<TopicResponse> {
    const response = await api.delete<unknown>(`/topics/${topicId}`);

    return TopicResponseSchema.parse(response.data);
  },
};