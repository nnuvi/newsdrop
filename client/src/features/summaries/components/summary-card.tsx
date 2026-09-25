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
        <View style={styles.header}>
          <ThemedText type="subtitle" numberOfLines={1} style={styles.title}>
            {title}
          </ThemedText>

          <ThemedText type="small" themeColor="muted" style={styles.updatedAt}>
            {updatedAt}
          </ThemedText>
        </View>

        <ThemedText
          type="default"
          numberOfLines={2}
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
    borderWidth: 1,
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
    position: "absolute",
    top: 0,
    right: 0,
  },

  content: {
    lineHeight: 21,
  },
});
