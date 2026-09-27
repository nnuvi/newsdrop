import { Pressable, StyleSheet, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export function Switch({
  value,
  onValueChange,
  disabled = false,
}: SwitchProps) {
  const theme = useTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      style={[
        styles.track,
        {
          backgroundColor: value ? theme.primary : theme.borderStrong,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: theme.backgroundElevated,
            transform: [
              {
                translateX: value ? 10 : -10,
              },
            ],
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
