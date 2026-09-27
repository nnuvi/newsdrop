import type { PropsWithChildren } from "react";
import AppStatusBar from "./statusbar";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/features/auth/context/auth-provider";
import FeedbackProvider from "@/providers/feedback";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useThemeMode } from "@/providers/theme-provider";

export function Providers({ children }: PropsWithChildren) {
  const { mode } = useThemeMode();
  return (
    <ThemeProvider value={mode === "dark" ? DarkTheme : DefaultTheme}>
      <QueryProvider>
        <FeedbackProvider>
          <AuthProvider>{children}</AuthProvider>
        </FeedbackProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
