import { ActivityIndicator, StyleSheet } from "react-native";

import { ThemedText } from "../ui/themed-text";
import { ThemedView } from "../ui/themed-view";
import { LoadingDots } from "./../ui/loading-dots";
import { LoadingCircle } from "../ui/loading-circle";

type LoadingProps = {
  circle?: boolean;
  dots?: boolean;
  message?: string;
};

export function Loading({
  circle,
  dots,
  message = "Loading...",
}: LoadingProps) {
  return (
    <ThemedView style={styles.container}>
      {dots ? (
        <LoadingDots />
      ) : circle ? (
        <LoadingCircle />
      ) : (
        <ActivityIndicator />
      )}

      <ThemedText themeColor="primary">{message}</ThemedText>
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
