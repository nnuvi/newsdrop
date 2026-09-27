import type { ComponentType } from "react";

import { useTheme } from "@/hooks/use-theme";

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
};

type ThemedIconProps = {
  icon: ComponentType<IconProps>;
  size?: number;
  color?: "text" | "primary" | "muted" | "error";
};

export function ThemedIcon({
  icon: Icon,
  size = 20,
  color = "text",
}: ThemedIconProps) {
  const theme = useTheme();

  return <Icon width={size} height={size} color={theme[color]} />;
}
