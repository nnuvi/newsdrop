import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { QueryState } from "@/components/shared/query-state";
import { EmptyState } from "@/components/shared/empty-state";
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

function getItemWidth(width: number, numColumns: number) {
  const availableWidth =
    Platform.OS === "web" ? width : width - GRID.horizontalPadding * 2;

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
  const { width: windowWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);

  const isWeb = Platform.OS === "web";
  const width = isWeb && containerWidth > 0 ? containerWidth : windowWidth;

  const numColumns = getColumnCount(width);
  const itemWidth = getItemWidth(width, numColumns);
  const topicQuery = useTopics();

  return (
    <ThemedView
      style={isWeb ? styles.webContainer : undefined}
      onLayout={
        isWeb
          ? (event) => setContainerWidth(event.nativeEvent.layout.width)
          : undefined
      }
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
            style={isWeb ? styles.webList : undefined}
            data={topics}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            columnWrapperStyle={
              numColumns > 1 ? (isWeb ? styles.webRow : styles.row) : undefined
            }
            contentContainerStyle={
              isWeb ? styles.webGridContent : styles.gridContent
            }
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
  webContainer: {
    flex: 1,
    width: "100%",
    minWidth: 0,
  },

  webList: {
    width: "100%",
    minWidth: 0,
  },

  gridContent: {
    paddingVertical: GRID.gap,
    gap: GRID.gap,
    alignItems: "flex-start",
  },

  row: {
    gap: GRID.gap,
  },

  webGridContent: {
    // paddingHorizontal: GRID.horizontalPadding,
    paddingVertical: GRID.gap,
    gap: GRID.gap,
    alignItems: "flex-start",
  },

  webRow: {
    alignSelf: "center",
    gap: GRID.gap,
    justifyContent: "center",
  },
});
