import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Image } from "@/components/ui/image";
import AppModal from "@/components/ui/modal";
import { ThemedText } from "@/components/ui/themed-text";

import { Icons } from "@/constants/images";

export type OptionItem = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

type OptionModalProps = {
  title?: string;
  options: OptionItem[];
};

export default function OptionModal({
  title = "Options",
  options,
}: OptionModalProps) {
  const [visible, setVisible] = useState(false);

  const handleClose = () => {
    setVisible(false);
  };

  const handleOptionPress = (option: OptionItem) => {
    if (option.disabled) return;

    handleClose();
    option.onPress();
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        hitSlop={8}
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.triggerPressed,
        ]}
      >
        <Image source={Icons.more} style={styles.icon} />
      </Pressable>

      <AppModal visible={visible} onClose={handleClose}>
        <View style={styles.container}>
          <ThemedText type="heading">{title}</ThemedText>

          <View style={styles.options}>
            {options.map((option) => (
              <Pressable
                key={option.label}
                onPress={() => handleOptionPress(option)}
                disabled={option.disabled}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.pressed,
                  option.disabled && styles.disabled,
                ]}
              >
                <ThemedText
                  style={styles.label}
                  themeColor={option.destructive ? "error" : "text"}
                >
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </AppModal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 4,
    borderRadius: 16,
  },

  triggerPressed: {
    opacity: 0.55,
  },

  icon: {
    width: 22,
    height: 22,
  },

  container: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 4,
  },

  options: {
    width: "100%",
    gap: 2,
  },

  option: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  pressed: {
    opacity: 0.55,
  },

  disabled: {
    opacity: 0.4,
  },

  label: {
    fontSize: 15,
    letterSpacing: 0.1,
  },
});
