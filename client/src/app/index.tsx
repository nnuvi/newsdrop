import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

import { AnimatedIcon } from "@/components/ui/animated-icon";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/core/screen";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

import { Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/context/auth-provider";

export default function HomeScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isLoading, isAuthenticated]);

  function handleGetStarted() {
    router.push("/login");
  }

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <Screen>
      <ThemedView style={styles.heroSection}>
        <AnimatedIcon />

        <ThemedText type="title" style={styles.title}>
          Welcome to NewsDrop
        </ThemedText>

        <Button title="Get Started" onPress={handleGetStarted} />
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
});
