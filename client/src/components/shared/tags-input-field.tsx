import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/ui/themed-text";

import { TagsInput } from "../ui/tags-input";

type FormTagsInputProps<T extends FieldValues> = {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function FormTagsInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
}: FormTagsInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const tags = Array.isArray(field.value) ? field.value : [];

        return (
          <View style={styles.container}>
            {label ? (
              <ThemedText type="smallBold" style={styles.label}>
                {label}
              </ThemedText>
            ) : null}

            <TagsInput
              value={tags}
              onChange={field.onChange}
              placeholder={placeholder}
              error={fieldState.error?.message}
              disabled={disabled}
            />
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

  error: {
    marginTop: 2,
  },
});
