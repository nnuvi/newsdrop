import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type TextStyle,
} from "react-native";

import { Image } from "@/components/ui/image";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ThemeColor } from "@/constants/theme";
import { Icons } from "@/constants/images";
import { summaryService } from "../service";

type PageHeaderProps = {
  title: string;
  topicId?: string;
  size?: number;
  color?: ThemeColor;
  style?: StyleProp<TextStyle>;
};

export function SummaryHeader({
  title,
  topicId,
  size = 28,
  color = "foreground",
  style,
}: PageHeaderProps) {
  const handleGetSummary = async () => {
    if (!topicId) return;

    try {
      await summaryService.getSummary(topicId);
    } catch (error) {
      console.error("Failed to get topic summary:", error);
    }
  };

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

      {topicId ? (
        <Pressable
          onPress={handleGetSummary}
          hitSlop={8}
          style={styles.refreshButton}
        >
          <Image source={Icons.refresh} tintColor="foreground" size={22} />
        </Pressable>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "500",
  },

  refreshButton: {
    padding: 4,
  },
});
