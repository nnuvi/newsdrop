import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/ui/themed-text";

export type SelectOption = {
  label: string;
  value: string;
  enabled?: boolean;
};

type SelectProps = {
  label?: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
};

export function Select({
  label,
  value,
  options,
  placeholder = "Select an option",
  disabled = false,
  onValueChange,
}: SelectProps) {
  return (
    <View style={styles.container}>
      {label && (
        <ThemedText type="default" themeColor="text">
          {label}
        </ThemedText>
      )}

      <View style={[styles.pickerContainer, disabled && styles.disabled]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          enabled={!disabled}
          style={styles.picker}
        >
          <Picker.Item label={placeholder} value="" enabled={false} />

          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              enabled={option.enabled ?? true}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  pickerContainer: {
    minHeight: 48,
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  picker: {
    width: "100%",
    color: "#111827",
  },
  disabled: {
    opacity: 0.5,
  },
});
