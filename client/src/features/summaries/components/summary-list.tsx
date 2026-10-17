import { router } from "expo-router";
import { FlatList, StyleSheet } from "react-native";

import { EmptyState } from "@/components/shared/empty-state";
import { QueryState } from "@/components/shared/query-state";

import { Spacing } from "@/constants/theme";
import { formatDate } from "@/lib/format-date";

import { useGenerateSummaries, useTopicSummaries } from "../queries";
import type { SummaryResponse } from "../schema";

import { SummaryCard } from "./summary-card";
import { SummaryListSkeleton } from "../skeletons/summary-list-skeleton";
import { useTopicContext } from "@/features/topics/context/generate-summary";
import { LoadingDots } from "@/components/ui/loading-dots";
import { LoadingCircle } from "@/components/ui/loading-circle";

type SummaryListProps = {
  topicId: string;
  summaries?: SummaryResponse[];
  refreshing?: boolean;
  onRefresh?: () => void;
  refresh?: boolean;
};

export function SummaryList({
  topicId,
  summaries: providedSummaries,
  refreshing: providedRefreshing,
  onRefresh: providedOnRefresh,
  refresh,
}: SummaryListProps) {
  const summaryQuery = useTopicSummaries(topicId);
  const { refreshing: generatingSummary } = useTopicContext();
  const refreshing = providedRefreshing ?? summaryQuery.isRefetching;
  const onRefresh = providedOnRefresh ?? summaryQuery.refetch;

  const renderList = (data: SummaryResponse[]) => (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SummaryCard
          title={item.title}
          content={item.summary}
          updatedAt={formatDate(item.created_at)}
          onPress={() => router.push(`/summaries/${item.id}`)}
        />
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );

  if (providedSummaries) {
    return renderList(providedSummaries);
  }

  return (
    <>
      {generatingSummary ? (
        <LoadingCircle key={"Refreshing Summary..."} />
      ) : (
        <QueryState
          {...summaryQuery}
          loading={<SummaryListSkeleton />}
          loadingMessage={"Loading summaries..."}
          empty={
            <EmptyState
              title="No summaries yet"
              message="There are no summaries available for this topic."
            />
          }
        >
          {(data) => renderList(data)}
        </QueryState>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
});
