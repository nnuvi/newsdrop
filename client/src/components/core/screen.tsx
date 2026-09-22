import type { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { MaxContentWidth, BottomTabInset, Spacing } from "@/constants/theme";
import { ThemedView } from "../ui/themed-view";
import AppStatusBar from "./statusbar";

export function Screen({ children }: PropsWithChildren) {
  return (
    <>
      <AppStatusBar />
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
});
