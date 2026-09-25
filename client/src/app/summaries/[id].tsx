import { useLocalSearchParams } from "expo-router";

import { QueryState } from "@/components/shared/query-state";
import { Screen } from "@/components/core/screen";
import { Header } from "@/components/shared/header";
import { Loading } from "@/components/shared/loading-state";

import { SummaryDetail } from "@/features/summaries/components/summary-detail";
import { useSummary } from "@/features/summaries/queries";
import { SummaryDetailSkeleton } from "@/features/summaries/skeletons/summary-detail-skeleton";

export default function SummaryPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const summaryId = Array.isArray(id) ? id[0] : id;

  const summaryQuery = useSummary(summaryId);

  return (
    <Screen>
      <Header title="Summary" />

      <QueryState
        {...summaryQuery}
        loading={<SummaryDetailSkeleton />}
        emptyTitle="Summary not found"
        emptyMessage="This summary is no longer available."
      >
        {(summary) => (
          <SummaryDetail
            summary={summary}
            isRefetching={summaryQuery.isRefetching}
            onRefresh={summaryQuery.refetch}
          />
        )}
      </QueryState>
    </Screen>
  );
}
