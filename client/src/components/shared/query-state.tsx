import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

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
  let content: ReactNode;

  if (isPending) {
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
  } else if (data === undefined || data === null) {
    content = empty ?? <EmptyState title={emptyTitle} message={emptyMessage} />;
  } else {
    content = children(data);
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
