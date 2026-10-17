import type { ReactNode } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Loading } from "@/components/shared/loading-state";

type QueryStateProps<T> = {
  isPending?: boolean;
  isError?: boolean;
  error?: unknown;

  data?: T | null;

  isRefetching?: boolean;
  refetch?: () => unknown;

  isLoading?: boolean;
  loading?: ReactNode;
  loadingMessage?: string;

  empty?: ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;

  children?: (data: T) => ReactNode;
  render?: () => ReactNode;
};

export function QueryState<T>({
  isPending,
  isError,
  error,
  data,
  isRefetching = false,
  refetch,
  isLoading = false,
  loading,
  loadingMessage = "Loading...",
  empty,
  emptyTitle = "Nothing here yet",
  emptyMessage = "No data available.",
  children,
  render,
}: QueryStateProps<T>) {
  if (isLoading || isPending || isRefetching) {
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

  if (render) {
    return <>{render()}</>;
  }

  if (data == null || (Array.isArray(data) && data.length === 0)) {
    return empty ?? <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return <>{children?.(data)}</>;
}
