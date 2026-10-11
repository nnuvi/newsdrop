export const topicKeys = {
  all: ["topics"] as const,

  lists: () => [...topicKeys.all, "list"] as const,

  detail: (topicId: string) =>
    [...topicKeys.all, "detail", topicId] as const,
};