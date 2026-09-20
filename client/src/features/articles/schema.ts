import { z } from "zod";

export const ArticleSourceSchema = z.object({
  name: z.string(),
  url: z.string().url().nullable().optional(),
});

export const ArticleProviderSchema = z.object({
  name: z.string(),
  article_id: z.string().nullable().optional(),
});

export const FetchStateSchema = z.object({
  key: z.string(),
  last_fetched_at: z.string().datetime().nullable().optional(),
});

export const ArticleCreateSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),

  url: z.string().url().nullable().optional(),

  image_url: z.string().url().nullable().optional(),

  source: ArticleSourceSchema,

  providers: z.array(ArticleProviderSchema).default([]),

  categories: z.array(z.string()).default([]),

  tags: z.array(z.string()).default([]),

  published_at: z.string().datetime().nullable().optional(),
});

export const ArticleResponseSchema = ArticleCreateSchema.extend({
  id: z.string(),
  created_at: z.string().datetime(),
});

export const ArticleListResponseSchema = z.object({
  articles: z.array(ArticleResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const ArticleQuerySchema = z.object({
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  limit: z.number().int().min(1).max(100).default(10),
  page: z.number().int().min(1).default(1),
});

export type ArticleSource = z.infer<typeof ArticleSourceSchema>;
export type ArticleProvider = z.infer<typeof ArticleProviderSchema>;
export type FetchState = z.infer<typeof FetchStateSchema>;
export type ArticleCreate = z.infer<typeof ArticleCreateSchema>;
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;
export type ArticleListResponse = z.infer<typeof ArticleListResponseSchema>;
export type ArticleQuery = z.infer<typeof ArticleQuerySchema>;
