import { Pressable, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";

import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

import { logger } from "@/lib/logger";

type SummaryCardProps = {
  title: string;
  content: string;
  updatedAt: string;
  onPress?: () => void;
};

export function SummaryCard({
  title,
  content,
  updatedAt,
  onPress,
}: SummaryCardProps) {
  logger.debug("[SummaryCard] Rendered", {
    title,
    updatedAt,
  });

  return (
    <Pressable onPress={onPress}>
      <ThemedView
        type="backgroundElevated"
        border="border"
        style={styles.container}
      >
        <ThemedText type="medium" numberOfLines={3} style={styles.title}>
          {title}
        </ThemedText>

        <ThemedText type="small" themeColor="muted" style={styles.updatedAt}>
          {updatedAt}
        </ThemedText>

        <ThemedText
          type="small"
          numberOfLines={5}
          themeColor="textSecondary"
          style={styles.content}
        >
          {content}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.two,
  },

  header: {
    position: "relative",
    paddingRight: 72,
  },

  title: {
    flexShrink: 1,
  },

  updatedAt: {
    alignSelf: "flex-start",
  },

  content: {
    lineHeight: 21,
  },
});
