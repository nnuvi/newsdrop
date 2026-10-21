
import { z } from "zod";

export const jobStatusSchema = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
]);

export const jobStageSchema = z.enum([
  "queued",
  "fetching_articles",
  "saving_articles",
  "generating_summary",
  "saving_summary",
  "refreshing_summary_data",
  "completed",
  "failed",
]);

export const jobTypeSchema = z.enum([
  "summary_generation",
  "article_refresh",
]);

export const jobResourceSchema = z.enum([
  "topic",
  "article",
  "summary",
  "user",
]);

export const jobSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  type: jobTypeSchema,
  user_id: z.string(),
  resource: jobResourceSchema,
  resource_id: z.string().nullable().optional(),
  status: jobStatusSchema,
  stage: jobStageSchema,
  message: z.string(),
  error: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  completed_at: z.string().nullable(),
}).transform((job) => {
  const id = job.id ?? job._id;

  if (!id) {
    throw new Error("Job response is missing its ID.");
  }

  return {
    ...job,
    id,
  };
});

export const createSummaryJobSchema = z.object({
  topic_id: z.string().min(1),
});

export type JobStatus = z.infer<typeof jobStatusSchema>;
export type JobStage = z.infer<typeof jobStageSchema>;
export type JobType = z.infer<typeof jobSchema>;
export type CreateSummaryJobInput = z.infer<
  typeof createSummaryJobSchema
>;
