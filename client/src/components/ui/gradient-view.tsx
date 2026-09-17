import { LinearGradient } from "expo-linear-gradient";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type GradientViewProps = {
  colors?: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export default function GradientView({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
}: GradientViewProps) {
  if (!colors) {
    return <View style={style}>{children}</View>;
  }

  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}