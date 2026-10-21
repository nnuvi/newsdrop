import api from "@/services/api";
import { logger } from "@/lib/logger";

import type { SummaryResponse } from "./schema";
import { SummaryResponseSchema } from "./schema";

export const summaryService = {
  async getArticleSummary(articleId: string): Promise<SummaryResponse> {
    logger.debug("[Summary] Fetching article summary", {
      articleId,
    });

    const response = await api.get<unknown>(`/summaries/article/${articleId}`);

    return SummaryResponseSchema.parse(response.data);
  },

  async generateTopicSummary(topicId: string): Promise<SummaryResponse> {
    logger.debug("[Summary] Generating topic summary", {
      topicId,
    });

    const response = await api.post<unknown>(
      `/summaries/topic/${topicId}`,
      undefined,
      { timeout: 120_000 },
    );

    return SummaryResponseSchema.parse(response.data);
  },

  async getTopicSummaries(topicId: string): Promise<SummaryResponse[]> {
    logger.debug("[Summary] Fetching topic summaries", {
      topicId,
    });

    const response = await api.get<unknown>(`/summaries/topic/${topicId}`);

    return SummaryResponseSchema.array().parse(response.data);
  },

  async getSummary(summaryId: string): Promise<SummaryResponse> {
    logger.debug("[Summary] Fetching summary", {
      summaryId,
    });

    const response = await api.get<unknown>(`/summaries/${summaryId}`);

    return SummaryResponseSchema.parse(response.data);
  },
};
