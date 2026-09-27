import type { PropsWithChildren } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

import { ThemedView } from "../ui/themed-view";
import AppStatusBar from "./statusbar";

export function Screen({ children }: PropsWithChildren) {
  return (
    <>
      <AppStatusBar />

      <ThemedView style={styles.container}>
        <SafeAreaView style={[styles.safeArea]}>{children}</SafeAreaView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    gap: Spacing.one,
    paddingBottom: BottomTabInset + Spacing.three,
    paddingHorizontal: Spacing.four,
    marginTop: 16,
    maxWidth: MaxContentWidth,
  },
});
