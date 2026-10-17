import { Pressable, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "./themed-text";

type CheckboxOptionProps = {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function CheckboxOption({
  label,
  selected,
  disabled = false,
  onPress,
}: CheckboxOptionProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: selected ? theme.backgroundSelected : "transparent",
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: selected ? theme.primary : theme.muted,
            backgroundColor: selected ? theme.primary : "transparent",
          },
        ]}
      >
        {selected ? (
          <ThemedText
            type="smallBold"
            style={{ color: theme.backgroundElevated }}
          >
            ✓
          </ThemedText>
        ) : null}
      </View>

      <ThemedText type="default" themeColor="text">
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
