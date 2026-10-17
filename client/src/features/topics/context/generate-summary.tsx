import { createContext, useContext, type ReactNode } from "react";

import { useGenerateSummaries } from "../mutations";

type TopicContextValue = {
  refreshing: boolean;
  refreshSummaries: () => void;
};

const TopicContext = createContext<TopicContextValue | null>(null);

export function TopicProvider({
  topicId,
  children,
}: {
  topicId: string;
  children: ReactNode;
}) {
  const mutation = useGenerateSummaries();

  const value: TopicContextValue = {
    refreshing: mutation.isPending,
    refreshSummaries: () => mutation.mutate(topicId),
  };

  return (
    <TopicContext.Provider value={value}>{children}</TopicContext.Provider>
  );
}

export function useTopicContext() {
  const context = useContext(TopicContext);

  if (!context) {
    throw new Error("useTopicContext must be used within TopicProvider");
  }

  return context;
}
