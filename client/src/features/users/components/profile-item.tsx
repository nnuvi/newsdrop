import type { ReactNode } from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

type ProfileItemProps = {
  title: string;
  danger?: boolean;
  right?: ReactNode;
  action?: ReactNode;
  onPress?: () => void;
};

export function ProfileItem({
  title,
  danger = false,
  right,
  action,
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

        {right ? <View style={styles.right}>{right}</View> : null}

        {action ? <View style={styles.action}>{action}</View> : null}

        {!right && !action ? <View style={styles.rightSpace} /> : null}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },

  iconSpace: {
    width: 24,
  },

  title: {
    flex: 1,
    marginLeft: Spacing.three,
  },

  right: {
    marginLeft: Spacing.two,
  },

  action: {
    marginLeft: Spacing.two,
  },

  rightSpace: {
    minWidth: 20,
    marginLeft: Spacing.two,
  },
});
