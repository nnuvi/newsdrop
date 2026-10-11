import { Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedView } from "../ui/themed-view";
import { ThemedText } from "../ui/themed-text";
import { Button } from "../ui/button";
import { Header } from "./header";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  loading?: boolean;
};

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
  loading = false,
}: ErrorStateProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="heading">Something went wrong</ThemedText>

      <ThemedText themeColor="muted" style={styles.message}>
        {message}
      </ThemedText>
      <ThemedView />
      {onRetry && (
        <Button
          title="Try again"
          onPress={onRetry}
          size="small"
          loading={!!loading}
        />
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
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 16,
  },
});
