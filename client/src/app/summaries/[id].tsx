import { router, useLocalSearchParams } from "expo-router";

import { Screen } from "@/components/core/screen";
import { Header } from "@/components/shared/header";
import { QueryState } from "@/components/shared/query-state";

import { SummaryDetail } from "@/features/summaries/components/summary-detail";
import { useSummary } from "@/features/summaries/queries";
import { SummaryDetailSkeleton } from "@/features/summaries/skeletons/summary-detail-skeleton";
import { useEffect } from "react";

export default function SummaryPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const summaryId = Array.isArray(id) ? id[0] : id;

  const summaryQuery = useSummary(summaryId);

  return (
    <Screen>
      <Header title="Summary" center />
      <QueryState
        {...summaryQuery}
        loading={<SummaryDetailSkeleton />}
        emptyTitle="Summary not found"
        emptyMessage="This summary is no longer available."
      >
        {(summary) => (
          <SummaryDetail
            summary={summary}
            isRefreshing={summaryQuery.isRefetching}
            onRefresh={summaryQuery.refetch}
          />
        )}
      </QueryState>
    </Screen>
  );
}
