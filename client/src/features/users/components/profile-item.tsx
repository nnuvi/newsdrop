import { Pressable, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

type ProfileItemProps = {
  title: string;
  danger?: boolean;
  onPress?: () => void;
};

export function ProfileItem({
  title,
  danger = false,
  onPress,
}: ProfileItemProps) {
  return (
    <Pressable onPress={onPress}>
      <ThemedView style={styles.item}>
        <View style={styles.iconSpace} />

        <ThemedText
          type="default"
          themeColor={danger ? "error" : "text"}
          style={styles.title}
        >
          {title}
        </ThemedText>

        <View style={styles.chevronSpace} />
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  iconSpace: {
    width: 24,
  },

  title: {
    flex: 1,
    marginLeft: Spacing.three,
  },

  chevronSpace: {
    width: 20,
  },
});
