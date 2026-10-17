import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/ui/themed-text";

export type SelectOption = {
  label: string;
  value: string;
  enabled?: boolean;
};

type FormSelectFieldProps<T extends FieldValues> = {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
};

export function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  disabled = false,
}: FormSelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <View style={styles.container}>
            {label ? (
              <ThemedText type="smallBold" style={styles.label}>
                {label}
              </ThemedText>
            ) : null}

            <View
              style={[
                styles.pickerContainer,
                fieldState.error && styles.pickerError,
                disabled && styles.disabled,
              ]}
            >
              <Picker
                selectedValue={field.value ?? ""}
                onValueChange={field.onChange}
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

            {fieldState.error?.message ? (
              <ThemedText type="small" style={styles.error}>
                {fieldState.error.message}
              </ThemedText>
            ) : null}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },

  label: {
    marginBottom: Spacing.one,
    paddingLeft: Spacing.two,
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

  pickerError: {
    borderColor: "#DC2626",
  },

  disabled: {
    opacity: 0.5,
  },

  error: {
    marginTop: 2,
    color: "#DC2626",
  },
});
