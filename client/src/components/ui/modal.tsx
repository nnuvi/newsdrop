import { useTheme } from "@/hooks/use-theme";
import React, { useEffect, useRef } from "react";

import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

type DropdownPosition = {
  top: number;
  left: number;
};

type AppModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: number;
  variant?: "default" | "dropdown";
  animationType?: "none" | "slide" | "fade" | undefined;
  dropdownPosition?: DropdownPosition;
};

export default function AppModal({
  visible,
  onClose,
  title,
  children,
  actions,
  maxWidth = 500,
  variant = "default",
  animationType="none",
  dropdownPosition,
}: AppModalProps) {
  const { width, height } = useWindowDimensions();

  const modalWidth = Math.min(width * 0.9, maxWidth);

  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const theme = useTheme();

  const isDropdown = variant === "dropdown";

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.9);
      opacity.setValue(0);
    }
  }, [visible, opacity, scale]);

  const dropdownPositionStyle =
    isDropdown && dropdownPosition
      ? {
          top: dropdownPosition.top,
          left: dropdownPosition.left,
        }
      : undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.backdrop, isDropdown && styles.dropdownBackdrop]}
        onPress={onClose}
      >
        <Pressable onPress={(event) => event.stopPropagation()}>
          <Animated.View
            style={[
              styles.modal,

              isDropdown ? styles.dropdown : styles.defaultModal,

              dropdownPositionStyle,

              {
                width: isDropdown ? undefined : modalWidth,
                maxHeight: isDropdown ? undefined : height * 0.85,

                backgroundColor: theme.background,

                transform: [{ scale }],
                opacity,
              },
            ]}
          >
            {title && <View style={styles.header}>{title}</View>}

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={
                isDropdown ? styles.dropdownContent : styles.content
              }
            >
              {children}
            </ScrollView>

            {actions && <View style={styles.actions}>{actions}</View>}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },

  dropdownBackdrop: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    padding: 0,
  },

  modal: {
    overflow: "hidden",
    borderRadius: 24,

    elevation: 16,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
  },

  defaultModal: {},

  dropdown: {
    position: "absolute",

    width: 160,
    borderRadius: 10,

    elevation: 8,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  content: {
    padding: 24,
  },

  dropdownContent: {
    padding: 6,
  },

  actions: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
});
