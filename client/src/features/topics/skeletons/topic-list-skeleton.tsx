import { FlatList, StyleSheet, useWindowDimensions } from "react-native";

import Skeleton from "@/components/ui/skeleton";

const GRID = {
  minItemWidth: 160,
  gap: 12,
  horizontalPadding: 16,
};

const SKELETON_COUNT = 7;

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

export function TopicListSkeleton() {
  const { width } = useWindowDimensions();

  const numColumns = getColumnCount(width);
  const itemWidth = getItemWidth(width, numColumns);

  return (
    <FlatList
      key={numColumns}
      data={Array.from({ length: SKELETON_COUNT })}
      keyExtractor={(_, index) => `topic-skeleton-${index}`}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.gridContent}
      renderItem={() => <Skeleton width={itemWidth} height={100} radius={12} />}
      scrollEnabled={false}
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
