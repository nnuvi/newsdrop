import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/use-theme";

const BALLS = [
  { size: 6, delay: 0 },
  { size: 8, delay: 100 },
  { size: 10, delay: 200 },
  { size: 12, delay: 300 },
  { size: 14, delay: 400 },
];

function LoadingBall({
  size,
  delay,
  color,
}: {
  size: number;
  delay: number;
  color: string;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 0.7 + progress.value * 0.6,
      },
    ],
    opacity: 0.5 + progress.value * 0.5,
  }));

  return (
    <Animated.View
      style={[
        styles.ball,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function LoadingDots() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {BALLS.map((ball, index) => (
        <LoadingBall
          key={index}
          size={ball.size}
          delay={ball.delay}
          color={theme.primary}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  ball: {
    flexShrink: 0,
  },
});
