import { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { Icons } from "@/constants/images";

import AppModal from "@/components/ui/modal";
import { Image } from "@/components/ui/image";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

export type OptionItem = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

type OptionDropdownProps = {
  options: OptionItem[];
};

const DROPDOWN_WIDTH = 140;
const DROPDOWN_OFFSET = 4;

export default function OptionDropdown({ options }: OptionDropdownProps) {
  const triggerRef = useRef<View>(null);

  const [visible, setVisible] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const openDropdown = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height + DROPDOWN_OFFSET,
        left: Math.max(8, x + width - DROPDOWN_WIDTH),
      });

      setVisible(true);
    });
  };

  const closeDropdown = () => {
    setVisible(false);
  };

  const handleOptionPress = (option: OptionItem) => {
    if (option.disabled) return;

    closeDropdown();
    option.onPress();
  };

  return (
    <>
      <View
        ref={triggerRef}
        collapsable={false}
        style={styles.triggerContainer}
      >
        <Pressable
          onPress={openDropdown}
          hitSlop={8}
          style={({ pressed }) => [
            styles.trigger,
            pressed && styles.triggerPressed,
          ]}
        >
          <Image
            source={Icons.more}
            style={styles.icon}
            tintColor="textSecondary"
          />
        </Pressable>
      </View>

      <AppModal
        visible={visible}
        onClose={closeDropdown}
        variant="dropdown"
        dropdownPosition={position}
      >
        <View style={styles.dropdown}>
          {options.map((option) => (
            <Pressable
              key={option.label}
              onPress={() => handleOptionPress(option)}
              disabled={option.disabled}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
                option.disabled && styles.disabled,
              ]}
            >
              <ThemedText themeColor={option.destructive ? "error" : "text"}>
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </AppModal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerContainer: {
    // width: 30,
    // height: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  trigger: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },

  triggerPressed: {
    opacity: 0.55,
  },

  icon: {
    width: 22,
    height: 22,
  },

  dropdown: {
    width: DROPDOWN_WIDTH,
    paddingVertical: 16,
    paddingHorizontal: 16,
    // borderRadius: 12,
    gap: 12,

    ...Platform.select({
      web: {
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      },

      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {
          width: 0,
          height: 4,
        },
      },

      android: {
        elevation: 8,
      },

      default: {},
    }),
  },

  option: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  optionPressed: {
    opacity: 0.6,
  },

  disabled: {
    opacity: 0.4,
  },
});
