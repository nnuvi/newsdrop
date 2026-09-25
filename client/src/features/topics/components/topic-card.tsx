import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ui/themed-text";
import { useTheme } from "@/hooks/use-theme";

type TopicCardProps = {
  title: string;
  width: number;
  onPress?: () => void;
};

export function TopicCard({ title, width, onPress }: TopicCardProps) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={["#EEF1FF", "#DDE4FF", "#AEBEFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.box, { width }]}
      >
        <ThemedText style={styles.boxText} type="title" themeColor="primary">
          {title}{" "}
        </ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    aspectRatio: 3 / 2,
    borderRadius: 16,
    padding: 16,
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  boxText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
