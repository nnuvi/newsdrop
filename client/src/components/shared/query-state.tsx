import type { ReactNode } from "react";

import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Loading } from "@/components/shared/loading-state";

type QueryStateProps<T> = {
  isPending: boolean;
  isError: boolean;
  error: unknown;
  data: T | undefined;
  refetch: () => unknown;

  loading: ReactNode;
  loadingMessage?: string;

  empty?: ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;

  children: (data: T) => ReactNode;
};

export function QueryState<T>({
  isPending,
  isError,
  error,
  data,
  refetch,
  loading,
  loadingMessage = "Loading...",
  empty,
  emptyTitle = "Nothing here yet",
  emptyMessage = "No data available.",
  children,
}: QueryStateProps<T>) {
  if (isPending) {
    return loading ?? <Loading message={loadingMessage} />;
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Something went wrong."
        }
        onRetry={refetch}
      />
    );
  }

  if (data === undefined || data === null) {
    return empty ?? <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return children(data);
}
