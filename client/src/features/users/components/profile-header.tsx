import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

type ProfileHeaderProps = {
  name: string;
  email: string;
};

export function ProfileHeader({ name, email }: ProfileHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.avatarPlaceholder} />

      <View style={styles.info}>
        <ThemedText type="smallBold">{name}</ThemedText>

        <ThemedText type="small" themeColor="muted" style={styles.email}>
          {email}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.five,
  },

  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E5E7EB",
  },

  info: {
    marginLeft: Spacing.three,
  },

  email: {
    marginTop: 2,
  },
});
