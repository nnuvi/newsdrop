import { router, useLocalSearchParams } from "expo-router";

import { Screen } from "@/components/core/screen";
import { Header } from "@/components/shared/header";

import { SummaryList } from "@/features/summaries/components/summary-list";

import { QueryState } from "@/components/shared/query-state";
import { LoadingCircle } from "@/components/ui/loading-circle";
import { TopicOptionsDropdown } from "@/features/topics/components/topic-option-dropdown";
import {
  TopicProvider
} from "@/features/topics/context/generate-summary";
import { useTopic } from "@/features/topics/queries";
import { capitalizeFirst } from "@/lib/format-value";
import { logger } from "@/lib/logger";
import { useEffect } from "react";

export default function TopicScreen() {
  const { id, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();

  const topicId = Array.isArray(id) ? id[0] : id;
  const topicName = Array.isArray(name) ? name[0] : name;

  const topicQuery = useTopic(topicId);

  logger.debug("[TopicPage] Topic loaded", {
    topicId,
    topicName,
  });

  return (
    <Screen>
      <TopicProvider topicId={topicId}>
        <QueryState
          {...topicQuery}
          loading={<LoadingCircle />}
          emptyTitle="Topic not found"
          emptyMessage="This topic is no longer available."
        >
          {(topic) => (
            <>
              <Header
                title={capitalizeFirst(topic.name) ?? "Topic"}
                action={<TopicOptionsDropdown topic={topic} />}
              />
              <SummaryList topicId={topicId} />
            </>
          )}
        </QueryState>
      </TopicProvider>
    </Screen>
  );
}
