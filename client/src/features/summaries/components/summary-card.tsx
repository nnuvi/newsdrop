import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { createStandardJSONSchemaMethod } from "zod/v4/core";

type SummaryCardProps = {
  title: string;
  content: string;
  updatedAt: string;
};

export function SummaryCard({ title, content, updatedAt }: SummaryCardProps) {
  console.log("SummaryCard: ", title, content, updatedAt);

  return (
    <ThemedView
      type="backgroundElevated"
      border="border"
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle" numberOfLines={1} style={styles.title}>
          {title}
        </ThemedText>

        <ThemedText type="small" themeColor="muted">
          {updatedAt}
        </ThemedText>
      </View>

      <ThemedText type="default" numberOfLines={2} themeColor="textSecondary">
        {content}
      </ThemedText>
    </ThemedView>
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
