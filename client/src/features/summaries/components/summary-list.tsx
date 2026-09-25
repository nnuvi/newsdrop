import { router } from "expo-router";
import { FlatList, StyleSheet } from "react-native";

import { QueryState } from "@/components/shared/query-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Loading } from "@/components/shared/loading-state";

import { Spacing } from "@/constants/theme";
import { formatDate } from "@/lib/format-date";

import { useTopicSummaries } from "../queries";

import { SummaryCard } from "./summary-card";
import { SummaryListSkeleton } from "../skeletons/summary-list-skeleton";

type SummaryListProps = {
  topicId: string;
};

export function SummaryList({ topicId }: SummaryListProps) {
  const summaryQuery = useTopicSummaries(topicId);

  return (
    <QueryState
      {...summaryQuery}
      loading={<SummaryListSkeleton />}
      loadingMessage="Loading summaries..."
      empty={
        <EmptyState
          title="No summaries yet"
          message="There are no summaries available for this topic."
        />
      }
    >
      {(summaries) => (
        <FlatList
          data={summaries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SummaryCard
              title="News Summary"
              content={item.summary}
              updatedAt={formatDate(item.created_at)}
              onPress={() => router.push(`/summaries/${item.id}`)}
            />
          )}
          refreshing={summaryQuery.isRefetching}
          onRefresh={summaryQuery.refetch}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      )}
    </QueryState>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
});
