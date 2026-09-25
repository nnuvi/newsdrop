import { StyleSheet, View } from "react-native";

import Skeleton from "@/components/ui/skeleton";
import { ThemedView } from "@/components/ui/themed-view";

import { Spacing } from "@/constants/theme";

function ProfileItemSkeleton() {
  return (
    <ThemedView type="backgroundElevated" style={styles.item}>
      <Skeleton width={24} height={24} radius={6} />

      <Skeleton width="45%" height={16} radius={5} />

      <Skeleton width={20} height={20} radius={6} />
    </ThemedView>
  );
}

function ProfileSectionSkeleton() {
  return (
    <View style={styles.section}>
      <Skeleton width={72} height={14} radius={5} />

      <ThemedView
        type="backgroundElevated"
        border="border"
        style={styles.sectionContent}
      >
        <ProfileItemSkeleton />
        <ProfileItemSkeleton />
      </ThemedView>
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={64} height={64} circle />

        <View style={styles.headerInfo}>
          <Skeleton width="40%" height={18} radius={6} />
          <Skeleton width="60%" height={14} radius={5} />
        </View>
      </View>

      <ProfileSectionSkeleton />

      <ProfileSectionSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.four,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.two,
  },

  headerInfo: {
    flex: 1,
    marginLeft: Spacing.three,
    gap: Spacing.one,
  },

  section: {
    gap: Spacing.one,
  },

  sectionContent: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    overflow: "hidden",
  },

  item: {
    minHeight: 56,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
