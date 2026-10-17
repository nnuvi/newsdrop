import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "./themed-text";

type BottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function BottomSheetModal({
  visible,
  onClose,
  title,
  children,
}: BottomSheetModalProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close modal"
          style={styles.backdrop}
          onPress={onClose}
        />

        <View
          style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}
        >
          {title ? (
            <View style={styles.header}>
              <ThemedText type="heading" themeColor="text">
                {title}
              </ThemedText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close modal"
                hitSlop={8}
                onPress={onClose}
              >
                <ThemedText type="default" themeColor="primary">
                  Done
                </ThemedText>
              </Pressable>
            </View>
          ) : null}

          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    maxHeight: "75%",
    padding: Spacing.three,
    gap: Spacing.two,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Spacing.two,
  },
});
