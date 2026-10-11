import { Platform, StyleSheet, Text, type TextProps } from "react-native";

import { Fonts, type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type TextSize = "xs" | "s" | "base" | "md" | "l" | "xl" | "xxl" | "xxxl";

export type TextWeight =
  "light" | "semiLight" | "regular" | "medium" | "semiBold" | "bold";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "small"
    | "medium"
    | "big"
    | "heading"
    | "title"
    | "smallBold"
    | "subtitle"
    | "link"
    | "linkPrimary"
    | "code";
  size?: TextSize;
  weight?: TextWeight;
  themeColor?: ThemeColor;
  center?: boolean;
};

const sizes: Record<TextSize, { fontSize: number; lineHeight: number }> = {
  xs: { fontSize: 12, lineHeight: 16 },
  s: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  md: { fontSize: 18, lineHeight: 26 },
  l: { fontSize: 20, lineHeight: 28 },
  xl: { fontSize: 24, lineHeight: 32 },
  xxl: { fontSize: 32, lineHeight: 40 },
  xxxl: { fontSize: 48, lineHeight: 56 },
};

const weights: Record<
  TextWeight,
  "200" | "300" | "400" | "500" | "600" | "700"
> = {
  light: "200",
  semiLight: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
};

const typeDefaults: Record<
  NonNullable<ThemedTextProps["type"]>,
  { size: TextSize; weight: TextWeight }
> = {
  default: { size: "base", weight: "regular" },
  small: { size: "s", weight: "regular" },
  medium: { size: "base", weight: "medium" },
  big: { size: "l", weight: "semiBold" },
  heading: { size: "xl", weight: "semiBold" },
  title: { size: "xxxl", weight: "semiBold" },
  smallBold: { size: "s", weight: "bold" },
  subtitle: { size: "xxl", weight: "semiBold" },
  link: { size: "s", weight: "regular" },
  linkPrimary: { size: "s", weight: "regular" },
  code: { size: "xs", weight: "medium" },
};

export function ThemedText({
  style,
  type = "default",
  size,
  weight,
  themeColor,
  center = false,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const defaults = typeDefaults[type];

  return (
    <Text
      style={[
        {
          color: theme[themeColor ?? "text"],
          fontSize: sizes[size ?? defaults.size].fontSize,
          lineHeight: sizes[size ?? defaults.size].lineHeight,
          fontWeight: weights[weight ?? defaults.weight],
        },
        type === "linkPrimary" && styles.linkPrimary,
        type === "code" && styles.code,
        center && styles.center,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
  linkPrimary: {
    color: "#3c87f7",
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: "700" as const }) ?? "500",
  },
});
