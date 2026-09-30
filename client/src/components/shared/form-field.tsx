import {
  Controller,
  FieldPath,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Input, type InputProps } from "@/components/ui/input";

type FormFieldProps<T extends FieldValues> = Omit<
  InputProps,
  "value" | "defaultValue" | "onChange" | "onChangeText" | "onBlur" | "error"
> & {
  control: Control<T, any, any>;
  name: FieldPath<T>
};

export function FormField<T extends FieldValues>({
  control,
  name,
  ...props
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          {...props}
          value={field.value ?? ""}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
