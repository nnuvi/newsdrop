import { View, type ViewProps } from "react-native";

import { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
  border?: ThemeColor;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type,
  border,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme[type ?? "background"],
          ...(border && { borderColor: theme[border] }),
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
