import { router } from "expo-router"; // Provides navigation between app routes.
import axios from "axios"; // Identifies Axios errors and extracts request details.
import { useEffect, useState } from "react"; // Manages component state and side effects.
import { StyleSheet, View } from "react-native"; // Provides layout containers and styles.

import { Screen } from "@/components/core/screen"; // Provides the shared screen layout.
import { Button } from "@/components/ui/button"; // Renders the app's themed button.
import { Image } from "@/components/ui/image"; // Renders an image using the app's image component.
import { LoadingCircle } from "@/components/ui/loading-circle"; // Displays loading animation and status text.
import { ThemedText } from "@/components/ui/themed-text"; // Renders text using the app theme.
import { ThemedView } from "@/components/ui/themed-view"; // Renders a view using the app theme.

import { Images } from "@/constants/images"; // Stores shared image assets.
import { Spacing } from "@/constants/theme"; // Provides consistent spacing values.
import { useAuth } from "@/features/auth/context/auth-provider"; // Provides authentication state.
import { logger } from "@/lib/logger"; // Records diagnostic messages through the shared logger.
import api from "@/services/api"; // Provides the configured Axios client for API requests.

type ServerStatus = "checking" | "ready" | "error"; // Defines the possible health-check states.

export default function HomeScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  const [serverStatus, setServerStatus] = useState<ServerStatus>("checking");
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Redirect authenticated users to the home screen once auth loading finishes.
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isLoading, isAuthenticated]);

  // Checks backend availability and manages loading, timeout hints, and retries.
  useEffect(() => {
    let cancelled = false;

    // Shows a wake-up hint if the health check takes longer than three seconds.
    const wakeupTimer = setTimeout(() => {
      if (!cancelled) {
        setIsWakingUp(true);
      }
    }, 3000);

    // Requests the root health endpoint and updates the connection status.
    async function checkServer() {
      setServerStatus("checking");
      setIsWakingUp(false);

      const baseURL = api.defaults.baseURL;

      if (!baseURL) {
        if (!cancelled) {
          setServerStatus("error");
        }

        logger.error(
          "NewsDrop health check failed: API base URL is not configured.",
        );

        clearTimeout(wakeupTimer);
        return;
      }

      // Removes the /api suffix because the health endpoint is at the backend root.
      const healthURL = `${baseURL.replace(/\/api\/?$/, "")}/health`;

      try {
        await api.get(healthURL, {
          timeout: 90_000,
        });

        if (!cancelled) {
          setServerStatus("ready");
        }
      } catch (error) {
        if (!cancelled) {
          setServerStatus("error");

          // Records request details to help diagnose network and API failures.
          logger.error("NewsDrop health check failed", {
            message: error instanceof Error ? error.message : String(error),
            code: axios.isAxiosError(error) ? error.code : undefined,
            url: axios.isAxiosError(error) ? error.config?.url : healthURL,
            baseURL,
          });
        }
      } finally {
        clearTimeout(wakeupTimer);

        if (!cancelled) {
          setIsWakingUp(false);
        }
      }
    }

    void checkServer();

    // Cancels pending UI updates when the component unmounts or retries.
    return () => {
      cancelled = true;
      clearTimeout(wakeupTimer);
    };
  }, [retryCount]);

  // Navigates unauthenticated users to the login screen's entry flow.
  function handleGetStarted() {
    router.push("/login");
  }

  // Prevents the welcome screen from flashing while auth state is unresolved.
  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <Screen>
      <ThemedView style={styles.container}>
        {serverStatus === "checking" && (
          <View style={styles.loadingContainer}>
            <LoadingCircle
              message={
                isWakingUp
                  ? "Waking up NewsDrop..."
                  : "Connecting to NewsDrop..."
              }
            />

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

// Keeps the welcome screen's layout consistent with the app theme.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },

  loadingContainer: {
    flexDirection: "column",
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
