import { StyleSheet } from "react-native";

import { ThemedView } from "../ui/themed-view";
import { ThemedText } from "../ui/themed-text";

type EmptyStateProps = {
  title?: string;
  message?: string;
};

export function EmptyState({
  title = "Nothing here yet",
  message,
}: EmptyStateProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="heading">{title}</ThemedText>

      {message && (
        <ThemedText themeColor="muted" style={styles.message}>
          {message}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  message: {
    textAlign: "center",
    marginTop: 4,
  },
});
