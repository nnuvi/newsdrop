import { router } from "expo-router";

import { StyleSheet } from "react-native";

import { AnimatedIcon } from "@/components/ui/animated-icon";
import { Screen } from "@/components/core/screen";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

import { Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/context/auth-provider";

export default function HomeScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  function handleGetStarted() {
    if (isAuthenticated) {
      router.replace("/home");
      return;
    }

    router.push("/login");
  }

  return (
    <Screen>
      <ThemedView style={styles.heroSection}>
        <AnimatedIcon />

        <ThemedText type="title" style={styles.title}>
          Welcome to NewsDrop
        </ThemedText>

        <Button
          title={isAuthenticated ? "Continue" : "Get Started"}
          onPress={handleGetStarted}
          disabled={isLoading}
        />
      </ThemedView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },

  title: {
    textAlign: "center",
  },

  code: {
    textTransform: "uppercase",
  },

  buttonContainer: {
    flexDirection: "column",
    gap: Spacing.three,
  },

  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
