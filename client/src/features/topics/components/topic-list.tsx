import { FlatList, StyleSheet, useWindowDimensions } from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { TopicCard } from "@/features/topics/components/topic-card";

import { useTopics } from "../hooks/use-topics";
import { TopicListSkeleton } from "../skeletons/topic-list-skeleton";

import { LoadingDots } from "@/components/ui/loading-dots";

const GRID = {
  minItemWidth: 160,
  gap: 12,
  horizontalPadding: 16,
};

function getItemWidth(screenWidth: number, numColumns: number) {
  const availableWidth = screenWidth - GRID.horizontalPadding * 2;

  return (availableWidth - GRID.gap * (numColumns - 1)) / numColumns;
}

function getColumnCount(width: number) {
  const availableWidth = width - GRID.horizontalPadding * 2;

  return Math.max(
    2,
    Math.floor((availableWidth + GRID.gap) / (GRID.minItemWidth + GRID.gap)),
  );
}

export default function TopicList() {
  const { width } = useWindowDimensions();

  const numColumns = getColumnCount(width);
  const itemWidth = getItemWidth(width, numColumns);

  const {
    data: topics,
    error,
    isError,
    isRefetching,
    isPending,
    refetch,
  } = useTopics();

  if (isPending) {
    // return <LoadingState message="Loading topics..." />;
    return <TopicListSkeleton />;
    // return <LoadingDots />;
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Unable to load topics."
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!topics?.length) {
    return (
      <EmptyState
        title="No topics yet"
        message="There are no topics available right now."
      />
    );
  }

  return (
    <FlatList
      key={numColumns}
      data={topics}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.gridContent}
      renderItem={({ item }) => (
        <TopicCard title={item.name} width={itemWidth} />
      )}
      refreshing={isRefetching}
      onRefresh={refetch}
    />
  );
}

const styles = StyleSheet.create({
  gridContent: {
    paddingHorizontal: GRID.horizontalPadding,
    paddingVertical: GRID.gap,
    gap: GRID.gap,
    alignItems: "flex-start",
  },

  row: {
    gap: GRID.gap,
  },
});
