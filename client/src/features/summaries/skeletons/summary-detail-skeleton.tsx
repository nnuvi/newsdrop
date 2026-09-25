import { ScrollView, StyleSheet, View } from "react-native";

import Skeleton from "@/components/ui/skeleton";
import { ThemedView } from "@/components/ui/themed-view";

import { Spacing } from "@/constants/theme";

export function SummaryDetailSkeleton() {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView type="backgroundElevated" border="border" style={styles.card}>
        <View style={styles.header}>
          <Skeleton width="42%" height={20} radius={6} />
          <Skeleton width={64} height={14} radius={5} />
        </View>

        <View style={styles.body}>
          <Skeleton width="100%" height={16} radius={5} />
          <Skeleton width="100%" height={16} radius={5} />
          <Skeleton width="96%" height={16} radius={5} />
          <Skeleton width="100%" height={16} radius={5} />
          <Skeleton width="88%" height={16} radius={5} />
        </View>

        <View style={styles.meta}>
          <Skeleton width={90} height={13} radius={5} />
          <Skeleton width={70} height={13} radius={5} />
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: Spacing.two,
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.three,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.two,
  },

  body: {
    gap: Spacing.one,
  },

  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
