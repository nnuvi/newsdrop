import { StyleSheet } from "react-native";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

type ProfileHeaderProps = {
  fullName?: string | null;
  username?: string;
};

export function ProfileHeader({ fullName, username }: ProfileHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView type="backgroundSelected" style={styles.avatarPlaceholder} />

      {fullName && (
        <ThemedText type="subtitle" style={styles.fullName} numberOfLines={1}>
          {fullName}
        </ThemedText>
      )}

      {username && (
        <ThemedText
          type="small"
          themeColor="muted"
          style={styles.username}
          numberOfLines={1}
        >
          @{username}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: Spacing.two,
    marginBottom: Spacing.five,
  },

  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: Spacing.two,
  },

  fullName: {
    textAlign: "center",
  },

  username: {
    marginTop: 2,
    textAlign: "center",
  },
});
