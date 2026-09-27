import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

export function ThemeSelector() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="default">Theme</ThemedText>

      <View style={styles.options}>
        {/* Light */}
        {/* Dark */}
        {/* System */}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  options: {
    flexDirection: "row",
    gap: Spacing.one,
  },
});
