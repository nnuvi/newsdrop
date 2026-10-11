export const articleKeys = {
  all: ["articles"] as const,

  lists: () => [...articleKeys.all, "list"] as const,

  list: (query: { keywords: string[] }) =>
    [...articleKeys.lists(), query] as const,

  detail: (articleId: string) =>
    [...articleKeys.all, "detail", articleId] as const,
};
