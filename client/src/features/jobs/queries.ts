
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { jobKeys } from "./keys";
import { jobService } from "./service";
import type { JobStatus } from "./schema";

export function useJob(jobId: string | null) {
  return useQuery({
    queryKey: jobKeys.detail(jobId ?? ""),
    queryFn: () => jobService.getJob(jobId!),
    enabled: Boolean(jobId),

    refetchInterval: (query) => {
      const status: JobStatus | undefined =
        query.state.data?.status;

      if (status === "completed" || status === "failed") {
        return false;
      }

      return 2_000;
    },

    refetchIntervalInBackground: false,
    retry: 2,
  });
}

export function useInvalidateJobs() {
  const queryClient = useQueryClient();

  return {
    invalidateJobs: () =>
      queryClient.invalidateQueries({
        queryKey: jobKeys.all,
      }),

    invalidateJob: (jobId: string) =>
      queryClient.invalidateQueries({
        queryKey: jobKeys.detail(jobId),
      }),
  };
}
