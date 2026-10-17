import type { PropsWithChildren } from "react";
import AppStatusBar from "./statusbar";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/features/auth/context/auth-provider";
import FeedbackProvider from "@/providers/feedback";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useThemeMode } from "@/providers/theme-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function Providers({ children }: PropsWithChildren) {
  const { mode } = useThemeMode();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={mode === "dark" ? DarkTheme : DefaultTheme}>
        <QueryProvider>
          <FeedbackProvider>
            <AuthProvider>{children}</AuthProvider>
          </FeedbackProvider>
        </QueryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
