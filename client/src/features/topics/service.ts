import api from "@/services/api";

import {
  Topic,
  TopicUpdate,
  TopicResponse,
  TopicResponseSchema,
} from "./schema";
import { SummaryResponse, SummaryResponseSchema } from "../summaries/schema";
import logger from "@/lib/logger";

export const topicService = {
  async getTopics(): Promise<TopicResponse[]> {
    const response = await api.get<unknown>("/topics");
    logger.debug("Topics Service GET TOPICS", {
      data: response.data,
    });
    return TopicResponseSchema.array().parse(response.data);
  },

  async getTopic(topicId: string): Promise<TopicResponse> {
    const response = await api.get<unknown>(`/topics/${topicId}`);

    return TopicResponseSchema.parse(response.data);
  },

  async generateTopicSummary(topicId: string): Promise<SummaryResponse> {
    const response = await api.post<unknown>(`/summaries/topic/${topicId}`);

    return SummaryResponseSchema.parse(response.data);
  },

  async createTopic(data: Topic): Promise<TopicResponse> {
    const response = await api.post<unknown>("/topics", data);

    return TopicResponseSchema.parse(response.data);
  },

  async updateTopic(
    topicId: string,
    data: TopicUpdate,
  ): Promise<TopicResponse> {
    const response = await api.patch<unknown>(`/topics/${topicId}`, data);

    return TopicResponseSchema.parse(response.data);
  },

  async deactivateTopic(topicId: string): Promise<TopicResponse> {
    const response = await api.patch<unknown>(`/topics/${topicId}/deactivate`);

    return TopicResponseSchema.parse(response.data);
  },

  async reactivateTopic(topicId: string): Promise<TopicResponse> {
    const response = await api.patch<unknown>(`/topics/${topicId}/reactivate`);

    return TopicResponseSchema.parse(response.data);
  },

  async deleteTopic(topicId: string): Promise<TopicResponse> {
    const response = await api.delete<unknown>(`/topics/${topicId}`);

    return TopicResponseSchema.parse(response.data);
  },
};
