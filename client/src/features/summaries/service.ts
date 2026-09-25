import api from "@/services/api";

import { SummaryResponse, SummaryResponseSchema } from "./schema";

export const summaryService = {
  async getArticleSummary(articleId: string): Promise<SummaryResponse> {
    const response = await api.get<unknown>(`/summaries/article/${articleId}`);

    console.log("[Summary] Article response:", response.data);

    return SummaryResponseSchema.parse(response.data);
  },

  async getTopicSummaries(topicId: string): Promise<SummaryResponse[]> {
    const response = await api.get<unknown>(`/summaries/topic/${topicId}`);

    console.log("[Summary] Topic response:", response.data);

    try {
      return SummaryResponseSchema.array().parse(response.data);
    } catch (error) {
      console.log("[Summary] Validation error:", error);
      throw error;
    }
  },

  async getSummary(summaryId: string): Promise<SummaryResponse> {
    const response = await api.get<unknown>(`/summaries/${summaryId}`);

    console.log("[Summary] Detail response:", response.data);

    return SummaryResponseSchema.parse(response.data);
  },
};
