import { z } from "zod";

export const StatisticValueSchema = z.object({
  label: z.string(),
  value: z.number(),
  unit: z.string().nullable(),
});

export const StatisticSchema = z.object({
  article_id: z.string(),
  metric: z.string(),
  description: z.string().nullable(),
  values: z.array(StatisticValueSchema),
  location: z.string().nullable(),
});

export const SummaryResponseSchema = z.object({
  id: z.string(),
  topic_ids: z.array(z.string()),
  article_ids: z.array(z.string()),
  title: z.string(),
  summary: z.string(),
  statistics: z.array(StatisticSchema),
  model: z.string(),
  created_at: z.string(),
});

export type StatisticValue = z.infer<typeof StatisticValueSchema>;
export type Statistic = z.infer<typeof StatisticSchema>;
export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;