import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useTheme } from "@/hooks/use-theme";

import { useSummary } from "@/features/summaries/queries";

import { SummaryDetail } from "@/features/summaries/components/summary-detail";

export default function SummaryPage() {
  const theme = useTheme();

  const { id } = useLocalSearchParams<{ id: string }>();

  const summaryId = Array.isArray(id) ? id[0] : id;

  const {
    data: summary,
    error,
    isPending,
    isError,
    isRefetching,
    refetch,
  } = useSummary(summaryId);

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : "Unable to load summary."
        }
        onRetry={refetch}
      />
    );
  }

  if (!summary) {
    return (
      <EmptyState
        title="Summary not found"
        message="This summary is no longer available."
      />
    );
  }

  return (
    <SummaryDetail
      summary={summary}
      isRefetching={isRefetching}
      onRefresh={refetch}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
