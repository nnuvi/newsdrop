import { z } from "zod";

import { ArticleListResponseSchema } from "@/features/articles/schema";

export const TopicCreateSchema = z.object({
  name: z.string().min(1).max(100),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

export const TopicResponseSchema = TopicCreateSchema.extend({
  id: z.string(),
  user_id: z.string(),
  is_active: z.boolean(),
  is_deleted: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

export const TopicContentResponseSchema = z.object({
  articles: ArticleListResponseSchema,
  summary: z.string(),
});

export type TopicCreate = z.infer<typeof TopicCreateSchema>;

export type TopicResponse = z.infer<typeof TopicResponseSchema>;

export type TopicContentResponse = z.infer<typeof TopicContentResponseSchema>;
