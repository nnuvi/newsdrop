
export const jobKeys = {
  all: ["jobs"] as const,

  lists: () => [...jobKeys.all, "list"] as const,

  detail: (jobId: string) =>
    [...jobKeys.all, "detail", jobId] as const,
};
