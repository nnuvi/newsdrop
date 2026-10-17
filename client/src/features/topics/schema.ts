import { z } from "zod";

import { ArticleListResponseSchema } from "@/features/articles/schema";

// Canonical category IDs supported by the backend.

export const PREDEFINED_CATEGORIES = [
  { id: "business", label: "Business" },
  { id: "crime", label: "Crime" },
  { id: "domestic", label: "Domestic" },
  { id: "education", label: "Education" },
  { id: "entertainment", label: "Entertainment" },
  { id: "environment", label: "Environment" },
  { id: "food", label: "Food" },
  { id: "health", label: "Health" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "other", label: "Other" },
  { id: "politics", label: "Politics" },
  { id: "science", label: "Science" },
  { id: "sports", label: "Sports" },
  { id: "technology", label: "Technology" },
  { id: "top", label: "Top News" },
  { id: "travel", label: "Travel" },
  { id: "world", label: "World" },
] as const;

const categoryIds = new Set<string>(
  PREDEFINED_CATEGORIES.map((category) => category.id),
);

// Shared field schemas

const topicNameSchema = z
  .string()
  .trim()
  .min(1, "Topic is required")
  .max(100, "Topic must be 100 characters or less")
  .transform((name) => name.replace(/\b\w/g, (char) => char.toUpperCase()));

const topicKeywordsSchema = z
  .array(z.string().trim().toLowerCase().min(1, "Keyword cannot be empty"))
  .max(50, "Maximum 50 keywords allowed")
  .transform((keywords) => [...new Set(keywords)]);

const topicCategoriesSchema = z
  .array(
    z
      .string()
      .trim()
      .toLowerCase()
      .refine(
        (category) => categoryIds.has(category),
        "Select a valid category",
      ),
  )
  .max(5, "Maximum 5 categories allowed")
  .transform((categories) => [...new Set(categories)]);

// Shared topic fields

const topicFieldsSchema = z.object({
  name: topicNameSchema,
  keywords: topicKeywordsSchema.default([]),
  categories: topicCategoriesSchema.default([]),
});

// Form schema

const topicFilterSchema = topicFieldsSchema.refine(
  (data) => data.keywords.length > 0 || data.categories.length > 0,
  {
    message: "At least one keyword or category is required",
    path: ["keywords"],
  },
);

export const TopicFormSchema = topicFilterSchema;

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

// Update request

export const TopicUpdateSchema = z
  .object({
    name: topicNameSchema.optional(),
    keywords: topicKeywordsSchema.optional(),
    categories: topicCategoriesSchema.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.keywords !== undefined ||
      data.categories !== undefined,
    {
      message: "At least one field must be provided for update",
    },
  );

export type TopicUpdate = z.output<typeof TopicUpdateSchema>;
export type TopicUpdateInput = z.input<typeof TopicUpdateSchema>;
