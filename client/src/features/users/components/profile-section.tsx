import type { PropsWithChildren } from "react";

import { StyleSheet } from "react-native";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

type ProfileSectionProps = PropsWithChildren<{
  title: string;
}>;

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="smallBold" themeColor="muted" style={styles.title}>
        {title}
      </ThemedText>

      <ThemedView
        type="backgroundElevated"
        border="border"
        style={styles.content}
      >
        {children}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.five,
  },

  title: {
    marginBottom: Spacing.one,
  },

  content: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    overflow: "hidden",
  },
});
