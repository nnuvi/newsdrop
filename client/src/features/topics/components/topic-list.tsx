import { FlatList, StyleSheet, useWindowDimensions } from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { TopicCard } from "@/features/topics/components/topic-card";
import { Spacing } from "@/constants/theme";

import { useTopics } from "../queries";
import { TopicListSkeleton } from "../skeletons/topic-list-skeleton";
import { router } from "expo-router";

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
    return <TopicListSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Unable to load topics."
        }
        onRetry={refetch}
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
        <TopicCard
          title={item.name}
          width={itemWidth}
          onPress={() =>
            router.push({
              pathname: "/topics/[id]",
              params: {
                id: item.id,
                name: item.name,
              },
            })
          }
          // onPress={() => router.push(`/topics/${item.id}`)}
        />
      )}
      refreshing={isRefetching}
      onRefresh={refetch}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  gridContent: {
    paddingVertical: GRID.gap,
    gap: GRID.gap,
    alignItems: "flex-start",
  },

  row: {
    gap: GRID.gap,
  },
});
