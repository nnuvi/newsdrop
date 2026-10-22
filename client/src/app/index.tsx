import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/core/screen";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { LoadingCircle } from "@/components/ui/loading-circle";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

import { Images } from "@/constants/images";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/context/auth-provider";
import api from "@/services/api";

type ServerStatus = "checking" | "ready" | "error";

export default function HomeScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");
  const [retryCount, setRetryCount] = useState(0);

  const BASE_URL = process.env.EXPO_PUBLIC_API_URL_SERVER;

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    let cancelled = false;

    async function checkServer() {
      try {
        if (!BASE_URL) {
          throw new Error("API server URL is not configured.");
        }

        const healthURL = `${BASE_URL.replace(/\/api\/?$/, "")}/health`;

        // Uses the configured Axios client and its interceptors; unlike plain fetch, this shares the app's API client configuration.
        await api.get<unknown>(healthURL, { timeout: 90_000 });

        if (!cancelled) {
          setServerStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setServerStatus("error");
        }
      }
    }

    void checkServer();

    return () => {
      cancelled = true;
    };
  }, [BASE_URL, retryCount]);

  function handleGetStarted() {
    router.push("/login");
  }

  if (isLoading || isAuthenticated || serverStatus === "checking") {
    return <LoadingCircle message="Connecting to NewsDrop..." />;
  }

  if (serverStatus === "error") {
    return (
      <Screen>
        <ThemedView style={styles.container}>
          <View style={styles.welcomeContainer}>
            <ThemedText type="heading" style={styles.title}>
              Unable to connect
            </ThemedText>

            <ThemedText style={styles.status}>
              Check your internet connection and try again.
            </ThemedText>

            <Button
              title="Retry connection"
              onPress={() => {
                setServerStatus("checking");
                setRetryCount((count) => count + 1);
              }}
              variant="primary"
              width="full"
              size="medium"
            />
          </View>
        </ThemedView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Image source={Images.logoBG} size={110} />

          <ThemedText type="heading" style={styles.title}>
            Welcome to NewsDrop
          </ThemedText>

          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            width="full"
            size="medium"
          />
        </View>
      </ThemedView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },

  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.four,
  },

  title: {
    textAlign: "center",
  },

  status: {
    textAlign: "center",
    opacity: 0.75,
  },
});
