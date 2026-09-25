import { StyleSheet, type StyleProp, type TextStyle } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { ThemeColor } from "@/constants/theme";

type PageHeaderProps = {
  title: string;
  size?: number;
  color?: ThemeColor;
  style?: StyleProp<TextStyle>;
};

export function Header({
  title,
  size = 28,
  color = "foreground",
  style,
}: PageHeaderProps) {
  return (
    <ThemedText
      type="title"
      themeColor={color}
      style={[
        styles.title,
        {
          fontSize: size,
        },
        style,
      ]}
    >
      {title}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "700",
  },
});
