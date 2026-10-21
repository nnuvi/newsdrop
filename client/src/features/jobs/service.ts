import api from "@/services/api";

import { jobSchema, type JobType } from "./schema";

export const jobService = {
  async createSummaryJob(topicId: string): Promise<JobType> {
    const response = await api.post<unknown>("/jobs/summary", {
      topic_id: topicId,
    });

    return jobSchema.parse(response.data);
  },

  async getJob(jobId: string): Promise<JobType> {
    const response = await api.get<unknown>(
      `/jobs/${encodeURIComponent(jobId)}`,
    );

    return jobSchema.parse(response.data);
  },
};
