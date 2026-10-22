import { router } from "expo-router"; // Provides navigation between app routes.
import { useEffect } from "react"; // Runs side effects when authentication state changes.
import { StyleSheet, View } from "react-native"; // Provides layout containers and styles.

import { Screen } from "@/components/core/screen"; // Provides the shared screen layout.
import { Button } from "@/components/ui/button"; // Renders the app's themed button.
import { Image } from "@/components/ui/image"; // Renders an image using the app's image component.
import { LoadingCircle } from "@/components/ui/loading-circle"; // Displays the loading animation.
import { ThemedText } from "@/components/ui/themed-text"; // Renders text using the app theme.
import { ThemedView } from "@/components/ui/themed-view"; // Renders a view using the app theme.

import { Images } from "@/constants/images"; // Stores shared image assets.
import { Spacing } from "@/constants/theme"; // Provides consistent spacing values.
import { useAuth } from "@/features/auth/context/auth-provider"; // Provides authentication state.

export default function HomeScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirects authenticated users once authentication loading finishes.
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isLoading, isAuthenticated]);

  // Navigates unauthenticated users to the login screen.
  function handleGetStarted() {
    router.push("/login");
  }

  // Prevents the welcome screen from flashing while auth is unresolved
  // or while an authenticated user is being redirected.
  if (isLoading || isAuthenticated) {
    return <LoadingCircle />;
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

// Keeps the welcome screen's layout consistent with the app theme.
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
});
