import { router } from "expo-router";
import { FlatList, StyleSheet, useWindowDimensions } from "react-native";

import { QueryState } from "@/components/shared/query-state";
import { EmptyState } from "@/components/shared/empty-state";

import { Spacing } from "@/constants/theme";

import { TopicCard } from "@/features/topics/components/topic-card";
import { TopicListSkeleton } from "@/features/topics/skeletons/topic-list-skeleton";

import { useTopics } from "../queries";

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

  const topicQuery = useTopics();

  return (
    <QueryState
      {...topicQuery}
      loading={<TopicListSkeleton />}
      empty={
        <EmptyState
          title="No topics yet"
          message="There are no topics available right now."
        />
      }
    >
      {(topics) => (
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
            />
          )}
          refreshing={topicQuery.isRefetching}
          onRefresh={topicQuery.refetch}
          showsVerticalScrollIndicator={false}
        />
      )}
    </QueryState>
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
