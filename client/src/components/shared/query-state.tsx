import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Loading } from "@/components/shared/loading-state";

type QueryStateProps<T> = {
  isPending: boolean;
  isError: boolean;
  error: unknown;
  data: T | undefined;

  isRefetching: boolean;
  refetch: () => unknown;

  isLoading?: boolean;
  loading?: ReactNode;
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
  isRefetching,
  refetch,
  isLoading,
  loading,
  loadingMessage = "Loading...",
  empty,
  emptyTitle = "Nothing here yet",
  emptyMessage = "No data available.",
  children,
}: QueryStateProps<T>) {
  let content: ReactNode;

  if (isLoading || isPending || isRefetching) {
    content = loading ?? <Loading message={loadingMessage} />;
  } else if (isError) {
    content = (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Something went wrong."
        }
        onRetry={refetch}
      />
    );
  } else if (
    data === undefined ||
    data === null ||
    (Array.isArray(data) && data.length === 0)
  ) {
    content = empty ?? <EmptyState title={emptyTitle} message={emptyMessage} />;
  } else {
    content = children(data);
  }

  // return <View style={styles.container}>{content}</View>;
  
  return <>{content}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
