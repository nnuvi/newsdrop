import { ScrollView, StyleSheet, View } from "react-native";

import Skeleton from "@/components/ui/skeleton";

import { Spacing } from "@/constants/theme";

export function SummaryDetailSkeleton() {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Skeleton width="42%" height={24} radius={6} />
      <Skeleton width={64} height={14} radius={5} />

      <View style={styles.body}>
        <Skeleton width="100%" height={16} radius={5} />
        <Skeleton width="100%" height={16} radius={5} />
        <Skeleton width="96%" height={16} radius={5} />
        <Skeleton width="100%" height={16} radius={5} />
        <Skeleton width="88%" height={16} radius={5} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: Spacing.two,
    gap: Spacing.three,
  },

  body: {
    gap: Spacing.one,
  },
});
