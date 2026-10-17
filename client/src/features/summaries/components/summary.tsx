// import { useLocalSearchParams } from "expo-router";

// import { Screen } from "@/components/core/screen";
// import { Header } from "@/components/shared/header";

// import { SummaryList } from "@/features/summaries/components/summary-list";

// import { TopicOptionsDropdown } from "@/features/topics/components/topic-option-dropdown";
// import { logger } from "@/lib/logger";
// import { capitalizeFirst } from "@/lib/format-value";
// import {
//   TopicProvider,
//   useTopicContext,
// } from "@/features/topics/context/generate-summary";
// import { LoadingCircle } from "@/components/ui/loading-circle";

// export default function TopicScreen(id: string) {
//   const topicId = Array.isArray(id) ? id[0] : id;

//   const refreshSummary = useTopicContext();

//   return (
//     <>
//       {refreshSummary ? <LoadingCircle /> : <SummaryList topicId={topicId} />}
//     </>
//   );
// }
