import { ActivityIndicator, StyleSheet } from "react-native";

import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator />

      <ThemedText themeColor="muted">
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
});