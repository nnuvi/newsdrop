export const summaryKeys = {
  all: ["summaries"] as const,

  article: (articleId: string) =>
    [...summaryKeys.all, "article", articleId] as const,

  topic: (topicId: string) =>
    [...summaryKeys.all, "topic", topicId] as const,

  generate: (topicId: string) =>
    [...summaryKeys.all, "generate", topicId] as const,

  summary: (summaryId: string) =>
    [...summaryKeys.all, "summary", summaryId] as const,
};
