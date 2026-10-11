import { StyleSheet, View, type StyleProp, type TextStyle } from "react-native";
import { type ReactNode } from "react";

import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemeColor } from "@/constants/theme";

type PageHeaderProps = {
  title: string;
  size?: number;
  color?: ThemeColor;
  style?: StyleProp<TextStyle>;
  action?: ReactNode;
  center?: boolean;
};

export function Header({
  title,
  size = 28,
  color = "foreground",
  style,
  action,
  center = false,
}: PageHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText
        type="title"
        themeColor={color}
        style={[
          styles.title,
          center && styles.centeredTitle,
          { fontSize: size },
          style,
        ]}
        numberOfLines={1}
      >
        {title}
      </ThemedText>

      {action != null && <View style={styles.action}>{action}</View>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 48,
    justifyContent: "center",
  },
  title: {
    fontWeight: "500",
    flexShrink: 1,
  },
  centeredTitle: {
    textAlign: "center",
    alignSelf: "center",
    width: "100%",
  },
  action: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
