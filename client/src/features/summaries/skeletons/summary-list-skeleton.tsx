import { FlatList, StyleSheet, View } from "react-native";

import Skeleton from "@/components/ui/skeleton";

import { Spacing } from "@/constants/theme";
import { ThemedView } from "@/components/ui/themed-view";

const SKELETON_ITEMS = Array.from({ length: 5 }, (_, index) => index);

function SummaryCardSkeleton() {
  return (
    <ThemedView type="backgroundElevated" border="border" style={styles.card}>
      <View style={styles.header}>
        <Skeleton width="45%" height={18} radius={6} />

        <Skeleton width={48} height={14} radius={5} />
      </View>

      <View style={styles.content}>
        <Skeleton width="100%" height={14} radius={5} />
        <Skeleton width="92%" height={14} radius={5} />
      </View>
    </ThemedView>
  );
}

export function SummaryListSkeleton() {
  return (
    <FlatList
      data={SKELETON_ITEMS}
      keyExtractor={(item) => String(item)}
      renderItem={() => <SummaryCardSkeleton />}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.two,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
  },

  content: {
    gap: Spacing.one,
  },
});
