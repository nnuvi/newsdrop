import { useLocalSearchParams } from "expo-router";

import { Screen } from "@/components/core/screen";
import { Header } from "@/components/shared/header";

import { SummaryList } from "@/features/summaries/components/summary-list";

import { TopicOptionsDropdown } from "@/features/topics/components/topic-option-dropdown";
import { logger } from "@/lib/logger";
import { capitalizeFirst } from "@/lib/format-value";

export default function TopicScreen() {
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
      <Header
        title={capitalizeFirst(topicName) ?? "Topic"}
        action={<TopicOptionsDropdown topicId={topicId} />}
      />
      <SummaryList topicId={topicId} />
    </Screen>
  );
}
