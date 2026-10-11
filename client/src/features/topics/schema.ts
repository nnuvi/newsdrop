import { z } from "zod";

import { ArticleListResponseSchema } from "@/features/articles/schema";

// Shared field schemas

const topicNameSchema = z
  .string()
  .trim()
  .min(1, "Topic is required")
  .max(100, "Topic must be 100 characters or less");

const topicKeywordsSchema = z
  .array(z.string().trim().toLowerCase().min(1, "Keyword cannot be empty"))
  .min(1, "At least one keyword is required")
  .max(10, "Maximum 10 keywords allowed")
  .transform((keywords) => [...new Set(keywords)]);

const topicCategoriesSchema = z.array(z.string());
const topicTagsSchema = z.array(z.string());

// Shared topic fields

const topicFieldsSchema = z.object({
  name: topicNameSchema,
  keywords: topicKeywordsSchema,
  // categories: topicCategoriesSchema.default([]),
  // tags: topicTagsSchema.default([]),
});

// Form schema: used by the shared create/edit form

export const TopicFormSchema = topicFieldsSchema;

export type TopicFormInput = z.input<typeof TopicFormSchema>;
export type TopicFormValues = z.output<typeof TopicFormSchema>;

// Create request

export const TopicSchema = topicFieldsSchema;

export type Topic = z.output<typeof TopicSchema>;

// Topic response

export const TopicResponseSchema = topicFieldsSchema.extend({
  id: z.string(),
  user_id: z.string(),
  is_active: z.boolean(),
  is_deleted: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

export type TopicResponse = z.output<typeof TopicResponseSchema>;

// Topic content response

export const TopicContentResponseSchema = z.object({
  articles: ArticleListResponseSchema,
  summary: z.string(),
});

export type TopicContentResponse = z.output<typeof TopicContentResponseSchema>;

// Update request: only name and keywords can be changed

export const TopicUpdateSchema = z
  .object({
    name: topicNameSchema.optional(),
    keywords: topicKeywordsSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.keywords !== undefined, {
    message: "At least one field must be provided for update",
  });

export type TopicUpdate = z.output<typeof TopicUpdateSchema>;
export type TopicUpdateInput = z.input<typeof TopicUpdateSchema>;
