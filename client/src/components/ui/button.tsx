import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { LoadingDots } from "./loading-dots";
import { ThemedText } from "./themed-text";

type ButtonVariant = "primary" | "secondary" | "accent" | "muted";

type ButtonWidth = "auto" | "medium" | "full";

type ButtonSize = "xs" | "small" | "medium" | "large" | "xl";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  width?: ButtonWidth;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  width = "full",
  size = "medium",
  style,
}: ButtonProps) {
  const theme = useTheme();

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        stylesBySize[size],
        stylesByWidth[width],
        {
          backgroundColor: theme[variant],
        },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <LoadingDots color={theme.foreground} />
      ) : (
        <ThemedText
          style={[styles.text, textStylesBySize[size]]}
          themeColor="white"
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },

  text: {
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.5,
  },
});

const stylesBySize: Record<ButtonSize, ViewStyle> = {
  xs: {
    height: 32,
    paddingHorizontal: 12,
  },

  small: {
    height: 42,
    paddingHorizontal: 16,
  },

  medium: {
    height: 48,
    paddingHorizontal: 20,
  },

  large: {
    height: 56,
    paddingHorizontal: 24,
  },

  xl: {
    height: 64,
    paddingHorizontal: 28,
  },
};

const textStylesBySize: Record<ButtonSize, TextStyle> = {
  xs: {
    fontSize: 12,
  },

  small: {
    fontSize: 14,
  },

  medium: {
    fontSize: 16,
  },

  large: {
    fontSize: 18,
  },

  xl: {
    fontSize: 20,
  },
};

const stylesByWidth: Record<ButtonWidth, ViewStyle> = {
  auto: {
    alignSelf: "center",
  },

  medium: {
    width: 160,
  },

  full: {
    width: "100%",
  },
};
