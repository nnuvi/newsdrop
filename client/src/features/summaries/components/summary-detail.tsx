import { ScrollView, StyleSheet, View } from "react-native";

import { Image } from "@/components/ui/image";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { LoadingDots } from "@/components/ui/loading-dots";
import { Spacing } from "@/constants/theme";

import { useTheme } from "@/hooks/use-theme";
import { formatDate } from "@/lib/format-date";
import { capitalizeFirst } from "@/lib/format-value";
import logger from "@/lib/logger";

import { SummaryStatistics } from "./statistics-card";
import { SummaryArticles } from "./summary-articles";
import type { SummaryResponse } from "../schema";
import { ImageCarousel } from "@/components/ui/image-carousel";

type SummaryDetailProps = {
  summary: SummaryResponse;
  isRefetching?: boolean;
};

export function SummaryDetail({
  summary,
  isRefetching = false,
}: SummaryDetailProps) {
  const theme = useTheme();

  logger.debug("[SummaryDetail] Renders:", summary);

  const summaryImage = summary.articles.find(
    (article) => article.image_url,
  )?.image_url;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <ThemedText type="big">{capitalizeFirst(summary.title)}</ThemedText>

        <ThemedText type="small" themeColor="muted">
          {formatDate(summary.created_at)}
        </ThemedText>
      </View>

      {isRefetching && (
        <View style={styles.loading}>
          <LoadingDots color={theme.primary} />
        </View>
      )}

      {summaryImage ? (
        // <Image source={{ uri: summaryImage }} style={styles.summaryImage} />
        <ImageCarousel
          images={summary.articles.map((article) => article.image_url)}
        />
      ) : null}

      <ThemedView type="backgroundElement" style={styles.summaryCard}>
        <ThemedText size="base" style={styles.summaryText}>
          {summary.summary}
        </ThemedText>
      </ThemedView>

      <SummaryArticles articles={summary.articles} />

      <View style={styles.section}>
        <ThemedText type="heading">Overview</ThemedText>

        <View style={styles.statGrid}>
          <ThemedView type="backgroundElement" style={styles.statCard}>
            <ThemedText type="small" themeColor="textSecondary">
              Articles analyzed
            </ThemedText>

            <ThemedText type="big">{summary.article_ids.length}</ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.statCard}>
            <ThemedText type="small" themeColor="textSecondary">
              Statistics
            </ThemedText>

            <ThemedText type="big">{summary.statistics.length}</ThemedText>

            <ThemedText type="small" themeColor="muted">
              Recorded metrics
            </ThemedText>
          </ThemedView>
        </View>
      </View>

      <SummaryStatistics statistics={summary.statistics} />

      {summary.model ? (
        <View style={styles.section}>
          <ThemedText type="heading">Generation Details</ThemedText>

          <ThemedView type="backgroundElement" style={styles.detailsCard}>
            <ThemedText type="small" themeColor="textSecondary">
              Model
            </ThemedText>

            <ThemedText>{summary.model}</ThemedText>
          </ThemedView>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
    paddingBottom: Spacing.five,
  },
  header: {
    gap: Spacing.one,
  },
  loading: {
    alignItems: "center",
    paddingVertical: Spacing.two,
  },
  summaryImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  summaryCard: {
    padding: Spacing.three,
    borderRadius: 12,
  },
  summaryText: {
    lineHeight: 24,
  },
  section: {
    gap: Spacing.two,
  },
  statGrid: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.one,
  },
  detailsCard: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.one,
  },
});
