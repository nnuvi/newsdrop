import { FlatList, StyleSheet } from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Spacing } from "@/constants/theme";
import { formatDate } from "@/lib/format-date";

import { useTopicSummaries } from "../queries";

import { SummaryCard } from "./summary-card";

type SummaryListProps = {
  topicId: string;
};

export function SummaryList({ topicId }: SummaryListProps) {
  const {
    data: summaries,
    error,
    isError,
    isRefetching,
    isPending,
    refetch,
  } = useTopicSummaries(topicId);

  if (isPending) {
    return <LoadingState message="Loading summaries..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Unable to load summaries."
        }
        onRetry={refetch}
      />
    );
  }

  if (!summaries?.length) {
    return (
      <EmptyState
        title="No summaries yet"
        message="There are no summaries available for this topic."
      />
    );
  }

  return (
    <FlatList
      data={summaries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SummaryCard
          title="News Summary"
          content={item.summary}
          updatedAt={formatDate(item.created_at)}
        />
      )}
      refreshing={isRefetching}
      onRefresh={refetch}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
});
