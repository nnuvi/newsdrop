import { z } from "zod";

import { ArticleListResponseSchema } from "@/features/articles/schema";

export const TopicCreateSchema = z.object({
  name: z.string(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

export const TopicResponseSchema = TopicCreateSchema.extend({
  id: z.string(),
});

export const TopicContentResponseSchema = z.object({
  articles: ArticleListResponseSchema,
  summary: z.string(),
});

export type TopicCreate = z.infer<typeof TopicCreateSchema>;
export type TopicResponse = z.infer<typeof TopicResponseSchema>;
export type TopicContentResponse = z.infer<typeof TopicContentResponseSchema>;
