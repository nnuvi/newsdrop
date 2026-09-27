import { StyleSheet, type StyleProp, type TextStyle } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { ThemeColor } from "@/constants/theme";
import { ThemedView } from "../ui/themed-view";

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
    <ThemedView style={styles.container}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  }, 

  title: {
    fontWeight: "500",
  },
});
