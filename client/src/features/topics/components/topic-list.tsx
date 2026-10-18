import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";

import { EmptyState } from "@/components/shared/empty-state";
import { QueryState } from "@/components/shared/query-state";
import { Spacing } from "@/constants/theme";
import { ThemedView } from "@/components/ui/themed-view";
import { TopicCard } from "@/features/topics/components/topic-card";
import { TopicListSkeleton } from "@/features/topics/skeletons/topic-list-skeleton";

import { useTopics } from "../queries";

const GRID = {
  minItemWidth: 160,
  gap: 12,
  horizontalPadding: Spacing.four,
};

function getColumnCount(width: number) {
  const availableWidth = width - GRID.horizontalPadding * 2;

  return Math.max(
    1,
    Math.floor((availableWidth + GRID.gap) / (GRID.minItemWidth + GRID.gap)),
  );
}

function getItemWidth(width: number, numColumns: number) {
  const availableWidth = width - GRID.horizontalPadding * 2;

  return (availableWidth - GRID.gap * (numColumns - 1)) / numColumns;
}

export default function TopicList() {
  const { width: windowWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);

  const width = containerWidth || windowWidth;
  const numColumns = getColumnCount(width);
  const itemWidth = getItemWidth(width, numColumns);

  const topicQuery = useTopics();

  return (
    <ThemedView
      style={styles.container}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
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
            style={styles.list}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    width: "100%",
  },

  list: {
    flex: 1,
    minWidth: 0,
    width: "100%",
  },

  gridContent: {
    paddingHorizontal: GRID.horizontalPadding,
    paddingVertical: GRID.gap,
    gap: GRID.gap,
    flexGrow: 1,
    alignItems: "flex-start",
  },

  row: {
    gap: GRID.gap,
  },
});
