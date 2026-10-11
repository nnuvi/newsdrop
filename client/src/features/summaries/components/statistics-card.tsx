import { StyleSheet, View } from "react-native";

import { Image } from "@/components/ui/image";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Spacing } from "@/constants/theme";
// import { Icons } from "@/constants/icons";
import { useTheme } from "@/hooks/use-theme";
import { formatDate } from "@/lib/format-date";

import type { Statistic } from "../schema";
import { Icons } from "@/constants/images";

type StatisticValue = Statistic["values"][number];

type SummaryStatisticsProps = {
  statistics: Statistic[];
};

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return hasText(value);
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;

  return false;
}

function isValidStatisticValue(value: StatisticValue): boolean {
  return hasValue(value.value);
}

function isValidStatistic(statistic: Statistic): boolean {
  return (
    hasText(statistic.metric) &&
    (hasText(statistic.description) ||
      statistic.values.some(isValidStatisticValue) ||
      hasText(statistic.location) ||
      hasText(statistic.event_time))
  );
}

export function SummaryStatistics({ statistics }: SummaryStatisticsProps) {
  const validStatistics = statistics.filter(isValidStatistic);

  if (validStatistics.length === 0) return null;

  return (
    <View style={styles.section}>
      <ThemedText type="heading">Statistics</ThemedText>

      <View style={styles.list}>
        {validStatistics.map((statistic, index) => (
          <StatisticCard
            key={`${statistic.article_id}-${statistic.metric}-${index}`}
            statistic={statistic}
          />
        ))}
      </View>
    </View>
  );
}

function StatisticCard({ statistic }: { statistic: Statistic }) {
  const description = hasText(statistic.description)
    ? statistic.description.trim()
    : null;

  const location = hasText(statistic.location)
    ? statistic.location.trim()
    : null;

  const eventTime = hasText(statistic.event_time) ? statistic.event_time : null;

  const values = statistic.values.filter(isValidStatisticValue);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">{statistic.metric.trim()}</ThemedText>

      {description ? (
        <ThemedText type="small" themeColor="textSecondary">
          {description}
        </ThemedText>
      ) : null}

      {values.length > 0 ? (
        <View style={styles.values}>
          {values.map((value, index) => (
            <StatisticValue
              key={`${statistic.metric}-value-${index}`}
              value={value}
            />
          ))}
        </View>
      ) : null}

      {location || eventTime ? (
        <StatisticMetadata location={location} eventTime={eventTime} />
      ) : null}
    </ThemedView>
  );
}

function StatisticValue({ value }: { value: StatisticValue }) {
  const label = hasText(value.label) ? value.label.trim() : null;
  const unit = hasValue(value.unit) ? String(value.unit).trim() : null;

  return (
    <View style={styles.valueRow}>
      <Image source={Icons.bar} size={20} tintColor="textSecondary" />

      <View style={styles.valueContent}>
        {label ? (
          <ThemedText type="small" themeColor="textSecondary">
            {label}
          </ThemedText>
        ) : null}

        <ThemedText type="smallBold">
          {[String(value.value), unit].filter(Boolean).join(" ")}
        </ThemedText>
      </View>
    </View>
  );
}

function StatisticMetadata({
  location,
  eventTime,
}: {
  location: string | null;
  eventTime: string | null;
}) {
  const theme = useTheme();

  return (
    <View style={styles.metadata}>
      {location ? (
        <View style={styles.metadataItem}>
          <Image source={Icons.location} size={16} tintColor="textSecondary" />
          <ThemedText type="small" themeColor="textSecondary">
            {location}
          </ThemedText>
        </View>
      ) : null}

      {eventTime ? (
        <View style={styles.metadataItem}>
          <Image source={Icons.clock} size={16} tintColor="textSecondary" />
          <ThemedText type="small" themeColor="textSecondary">
            {formatDate(eventTime)}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.two,
  },
  values: {
    gap: Spacing.two,
  },
  value: {
    gap: Spacing.one,
  },
  valueRow: {
    flexDirection: "row",
    // alignItems: "center",
    gap: Spacing.two,
  },
  valueContent: {
    flex: 1,
    gap: Spacing.one,
  },
  // valueContent: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: Spacing.two,
  // },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.three,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
