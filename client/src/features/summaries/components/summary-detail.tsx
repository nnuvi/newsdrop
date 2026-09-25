import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatDate } from "@/lib/format-date";

import type { SummaryResponse } from "../schema";
import logger from "@/lib/logger";

type SummaryDetailProps = {
  summary: SummaryResponse;
  isRefetching?: boolean;
  onRefresh?: () => void;
};

export function SummaryDetail({
  summary,
  isRefetching = false,
}: SummaryDetailProps) {
  const theme = useTheme();
  logger.debug("[SummaryDetails] Renders: ", summary);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="heading">News Summary</ThemedText>

      <ThemedText type="small" themeColor="muted">
        {formatDate(summary.created_at)}
      </ThemedText>

      <ThemedText style={styles.summary}>{summary.summary}</ThemedText>

      {isRefetching && <ActivityIndicator color={theme.primary} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.two,
  },

  summary: {
    lineHeight: 24,
  },
});
