import { router } from "expo-router";
import { useEffect } from "react";
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

export default function HomeScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || isAuthenticated) {
    return <LoadingCircle message="Loading NewsDrop..." />;
  }

  function handleGetStarted() {
    router.push("/login");
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
});
