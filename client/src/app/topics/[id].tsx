import { useLocalSearchParams } from "expo-router";

import { Header } from "@/components/shared/header";
import { Screen } from "@/components/core/screen";
import { SummaryList } from "@/features/summaries/components/summary-list";

import { logger } from "@/lib/logger";

export default function TopicPage() {
  const { id, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();

  const topicId = Array.isArray(id) ? id[0] : id;
  const topicName = Array.isArray(name) ? name[0] : name;

  logger.debug("[TopicPage] Topic loaded", {
    topicId,
    topicName,
  });

  return (
    <Screen>
      <Header title={topicName ?? "Topic"} />
      <SummaryList topicId={topicId} />
    </Screen>
  );
}