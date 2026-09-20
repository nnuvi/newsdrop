import { useEffect } from "react";
import { DimensionValue, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/use-theme";

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  circle?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Skeleton({
  width = "100%",
  height = 16,
  radius = 8,
  circle = false,
  style,
}: SkeletonProps) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 900,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.45, 1]),
  }));

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius: circle ? 999 : radius,
          backgroundColor: theme.backgroundSelected,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
});
