import { StatusBar } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

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
  const colorScheme = useColorScheme();

  const statusBarStyle =
    barStyle ?? (colorScheme === "dark" ? "light-content" : "dark-content");

  return (
    <StatusBar
      barStyle={statusBarStyle}
      translucent={translucent}
      backgroundColor={backgroundColor ?? theme.background}
    />
  );
}
