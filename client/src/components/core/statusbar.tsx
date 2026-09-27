import { StatusBar } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { useThemeMode } from "@/providers/theme-provider";

type AppStatusBarProps = {
  barStyle?: "default" | "light-content" | "dark-content";
  translucent?: boolean;
  backgroundColor?: string;
};

export default function AppStatusBar({
  barStyle,
  translucent = true,
  backgroundColor,
}: AppStatusBarProps) {
  const theme = useTheme();
  const { mode } = useThemeMode();

  const statusBarStyle =
    barStyle ??
    (mode === "dark" ? "light-content" : "dark-content");

  return (
    <StatusBar
      barStyle={statusBarStyle}
      translucent={translucent}
      backgroundColor={backgroundColor ?? theme.background}
    />
  );
}