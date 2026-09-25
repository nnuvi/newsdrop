import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/use-theme";

const BALL_COUNT = 11;
const RADIUS = 33;

const MIN_SIZE = 5;
const MAX_SIZE = 11;

const CONTAINER_SIZE = RADIUS * 2 + MAX_SIZE;

type LoadingBallProps = {
  index: number;
  progress: SharedValue<number>;
  color: string;
};

function LoadingBall({ index, progress, color }: LoadingBallProps) {
  const angle = (index / BALL_COUNT) * Math.PI * 2;

  const center = CONTAINER_SIZE / 2;

  const baseX = center + Math.cos(angle) * RADIUS;

  const baseY = center + Math.sin(angle) * RADIUS;

  const animatedStyle = useAnimatedStyle(() => {
    const phase = (progress.value + index / BALL_COUNT) % 1;

    const wave = (Math.sin(phase * Math.PI * 2) + 1) / 2;

    const size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * wave;

    return {
      width: size,
      height: size,
      borderRadius: size / 2,

      left: baseX - size / 2,
      top: baseY - size / 2,

      opacity: 0.45 + wave * 0.55,
    };
  });

  return (
    <Animated.View
      style={[
        styles.ball,
        {
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function LoadingCircle() {
  const theme = useTheme();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1800,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [progress]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {Array.from({
          length: BALL_COUNT,
        }).map((_, index) => (
          <LoadingBall
            key={index}
            index={index}
            progress={progress}
            color={theme.primary}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    position: "relative",
  },

  ball: {
    position: "absolute",
  },
});
