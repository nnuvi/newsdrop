import api from "@/services/api";

import { logger } from "@/lib/logger";

import { SummaryResponse, SummaryResponseSchema } from "./schema";

export const summaryService = {
  async getArticleSummary(articleId: string): Promise<SummaryResponse> {
    logger.debug("[Summary] Fetching article summary", {
      articleId,
    });

    const response = await api.get<unknown>(`/summaries/article/${articleId}`);

    logger.debug("[Summary] Article response received", {
      articleId,
    });

    return SummaryResponseSchema.parse(response.data);
  },

  async getTopicSummaries(topicId: string): Promise<SummaryResponse[]> {
    logger.debug("[Summary] Fetching topic summaries", {
      topicId,
    });

    const response = await api.get<unknown>(`/summaries/topic/${topicId}`);

    try {
      const summaries = SummaryResponseSchema.array().parse(response.data);

      logger.debug("[Summary] Topic summaries loaded", {
        topicId,
        count: summaries.length,
      });

      return summaries;
    } catch (error) {
      logger.error("[Summary] Topic response validation failed", error, {
        topicId,
      });

      throw error;
    }
  },

  async getSummary(summaryId: string): Promise<SummaryResponse> {
    logger.debug("[Summary] Fetching summary", {
      summaryId,
    });

    const response = await api.get<unknown>(`/summaries/${summaryId}`);

    logger.debug("[Summary] Summary response received", {
      summaryId,
    });

    return SummaryResponseSchema.parse(response.data);
  },
};
