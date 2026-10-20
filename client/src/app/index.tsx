import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Screen } from "@/components/core/screen";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Image } from "@/components/ui/image";

import { Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/context/auth-provider";
import { Images } from "@/constants/images";
import api from "@/services/api"; // Change to your actual Axios client import
import { LoadingCircle } from "@/components/ui/loading-circle";

type ServerStatus = "checking" | "ready" | "error";

export default function HomeScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    let cancelled = false;

    const wakeupTimer = setTimeout(() => {
      if (!cancelled) {
        setIsWakingUp(true);
      }
    }, 3000);

    async function checkServer() {
      setServerStatus("checking");
      setIsWakingUp(false);
      const baseURL = api.defaults.baseURL;

      if (!baseURL) {
        throw new Error("API base URL is not configured");
      }

      const healthURL = `${baseURL.replace(/\/api\/?$/, "")}/health`;
      try {
        await api.get(healthURL, {
          timeout: 90000,
        });

        if (!cancelled) {
          setServerStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setServerStatus("error");
        }
      } finally {
        clearTimeout(wakeupTimer);

        if (!cancelled) {
          setIsWakingUp(false);
        }
      }
    }

    void checkServer();

    return () => {
      cancelled = true;
      clearTimeout(wakeupTimer);
    };
  }, [retryCount]);

  function handleGetStarted() {
    router.push("/login");
  }

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <Screen>
      <ThemedView style={styles.container}>
        {serverStatus === "checking" && (
          <View style={styles.loadingContainer}>
            <LoadingCircle />

            <ThemedText style={styles.status}>
              {isWakingUp
                ? "Waking up NewsDrop..."
                : "Connecting to NewsDrop..."}
            </ThemedText>

            {isWakingUp && (
              <ThemedText style={styles.hint}>
                The server may take a minute to start.
              </ThemedText>
            )}
          </View>
        )}

        {serverStatus === "error" && (
          <View style={styles.loadingContainer}>
            <ThemedText type="heading" style={styles.title}>
              Unable to connect
            </ThemedText>

            <ThemedText style={styles.status}>
              Check your internet connection and try again.
            </ThemedText>

            <Button
              title="Retry connection"
              onPress={() => setRetryCount((count) => count + 1)}
              variant="primary"
              width="full"
              size="medium"
            />
          </View>
        )}

        {serverStatus === "ready" && (
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
        )}
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

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.four,
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

  hint: {
    textAlign: "center",
    opacity: 0.6,
  },
});
