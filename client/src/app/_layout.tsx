import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { Providers } from "@/components/core/wrapper";
import { useAuth } from "@/features/auth/context/auth-provider";
import { AppThemeProvider, useThemeMode } from "@/providers/theme-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
    <AppThemeProvider>
      <Providers>
        <RootNavigator />
      </Providers>
    </AppThemeProvider>
  );
}

function RootNavigator() {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
