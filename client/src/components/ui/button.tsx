import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";

type ButtonVariant = "primary" | "secondary" | "accent" | "muted";
type ButtonWidth = "auto" | "medium" | "full";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  width?: ButtonWidth;
  size?: ButtonSize;
};

export function Button({
  title,
  variant = "primary",
  width = "auto",
  size = "medium",
  disabled = false,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  const buttonStyle: ViewStyle = {
    ...styles.button,
    backgroundColor: theme[variant],
    ...stylesBySize[size],
    ...stylesByWidth[width],
    ...(disabled && styles.disabled),
  };

  const textStyle = {
    ...styles.text,
    color: theme.foreground,
  };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },

  text: {
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },
});

const stylesBySize: Record<ButtonSize, ViewStyle> = {
  small: {
    height: 36,
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
