import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ui/themed-view";
import { SummaryList } from "@/features/summaries/components/summary-list";
import { Header } from "@/components/shared/header";

export default function TopicPage() {
  // const { id } = useLocalSearchParams<{ id: string }>();

  const { id, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();

  const topicId = Array.isArray(id) ? id[0] : id;
  const topicName = Array.isArray(name) ? name[0] : name;
  // const topicId = Array.isArray(id) ? id[0] : id;

  return (
    <ThemedView style={styles.container}>
      <Header title={topicName ?? "Topic"} />
      <SummaryList topicId={topicId} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
