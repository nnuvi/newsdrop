import { z } from "zod";

export const ArticleContextSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  source: z.string(),
  published_at: z.string().nullable().optional(),
});

export const SummaryArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  image_url: z.string().nullable(),
  source: z.string(),
});

export const SummaryInputSchema = z.object({
  articles: z.array(ArticleContextSchema),
});

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
  event_time: z.string().nullable(),
});

export const SummaryDetailsSchema = z.object({
  title: z.string(),
  summary: z.string(),
  statistics: z.array(StatisticSchema),
});

export const AIResponseSchema = SummaryDetailsSchema.extend({
  model: z.string(),
});

export const SummaryResponseSchema = AIResponseSchema.extend({
  id: z.string(),
  topic_id: z.string(),
  article_ids: z.array(z.string()),
  articles: z.array(SummaryArticleSchema),
  created_at: z.string(),
});

export const AdminSummaryResponseSchema = z.object({
  id: z.string(),
  topic_id: z.string().nullable(),
  title: z.string().nullable(),
  summary: z.string(),
  statistics: z.array(StatisticSchema),
  model: z.string(),
  article_ids: z.array(z.string()),
  articles: z.array(SummaryArticleSchema),
  created_at: z.string(),
});

export type ArticleContext = z.infer<typeof ArticleContextSchema>;
export type SummaryArticle = z.infer<typeof SummaryArticleSchema>;
export type SummaryInput = z.infer<typeof SummaryInputSchema>;
export type StatisticValue = z.infer<typeof StatisticValueSchema>;
export type Statistic = z.infer<typeof StatisticSchema>;
export type SummaryDetails = z.infer<typeof SummaryDetailsSchema>;
export type AIResponse = z.infer<typeof AIResponseSchema>;
export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;
export type AdminSummaryResponse = z.infer<
  typeof AdminSummaryResponseSchema
>;