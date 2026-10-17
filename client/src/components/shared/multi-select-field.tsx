import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { MultiSelect } from "@/components/ui/multi-select-input";
import type { SelectOption } from "@/components/ui/select";

type FormMultiSelectFieldProps<T extends FieldValues> = {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
};

export function FormMultiSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  disabled = false,
}: FormMultiSelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <MultiSelect
          value={Array.isArray(field.value) ? field.value : []}
          onValueChange={field.onChange}
          label={label}
          options={options}
          placeholder={placeholder}
          disabled={disabled}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
