import { Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedView } from "../ui/themed-view";
import { ThemedText } from "../ui/themed-text";
import { Button } from "../ui/button";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="heading">Something went wrong</ThemedText>

      <ThemedText themeColor="muted" style={styles.message}>
        {message}
      </ThemedText>
      <ThemedView />
      {onRetry && <Button title="Try again" onPress={onRetry} size="small" />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginBottom: 120,
  },
  message: {
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  retryButton: {
    marginTop: 8,
  },
});
