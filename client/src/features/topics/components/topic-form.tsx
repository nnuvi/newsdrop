import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { FormField } from "@/components/shared/form-field";
import { FormMultiSelectField } from "@/components/shared/multi-select-field";
import { FormTagsInput } from "@/components/shared/tags-input-field";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/ui/themed-text";
import { Spacing } from "@/constants/theme";

import {
  PREDEFINED_CATEGORIES,
  TopicSchema,
  type Topic,
  type TopicFormInput,
  type TopicFormValues,
  type TopicResponse,
} from "../schema";

const categoryOptions = PREDEFINED_CATEGORIES.map((category) => ({
  label: category.label,
  value: category.id,
}));

type TopicFormProps = {
  mode: "create" | "edit";
  initialValues?: Pick<
    TopicResponse,
    "name" | "keywords" | "categories"
  >;
  loading?: boolean;
  onSubmit: (data: Topic) => void;
  onCancel?: () => void;
};

export function TopicForm({
  mode,
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
}: TopicFormProps) {
  const { control, handleSubmit, reset } = useForm<
    TopicFormInput,
    undefined,
    TopicFormValues
  >({
    resolver: zodResolver(TopicSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      keywords: initialValues?.keywords ?? [],
      categories: initialValues?.categories ?? [],
      // tags: initialValues?.tags ?? [],
    },
  });

  useEffect(() => {
    reset({
      name: initialValues?.name ?? "",
      keywords: initialValues?.keywords ?? [],
      categories: initialValues?.categories ?? [],
      // tags: initialValues?.tags ?? [],
    });
  }, [
    initialValues?.name,
    initialValues?.keywords,
    initialValues?.categories,
    // initialValues?.tags,
    reset,
  ]);

  const submit = (values: TopicFormValues) => {
    const data: Topic = {
      name: values.name,
      keywords: values.keywords,
      categories: values.categories,
      // tags: values.tags,
    };

    onSubmit(data);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="heading" themeColor="text" center>
        {mode === "create" ? "Add Topic" : "Edit Topic"}
      </ThemedText>

      <FormField
        control={control}
        name="name"
        label="Topic"
        placeholder={
          mode === "create" ? "e.g. Artificial Intelligence" : undefined
        }
        autoCapitalize="words"
        disabled={loading}
      />

      <FormMultiSelectField
        control={control}
        name="categories"
        label="Categories"
        placeholder="Select categories"
        options={categoryOptions}
        disabled={loading}
      />
{/* 
      <FormTagsInput
        control={control}
        name="tags"
        label="Tags"
        placeholder={
          mode === "create" ? "Type a tag and press Enter" : undefined
        }
        disabled={loading}
      /> */}

      <FormTagsInput
        control={control}
        name="keywords"
        label="Keywords"
        placeholder={
          mode === "create" ? "Type a keyword and press Enter" : undefined
        }
        disabled={loading}
      />

      <View style={styles.actions}>
        {onCancel && (
          <View style={styles.buttonWrapper}>
            <Button
              title="Cancel"
              variant="outline"
              size="small"
              disabled={loading}
              onPress={onCancel}
              style={styles.button}
            />
          </View>
        )}

        <View style={styles.buttonWrapper}>
          <Button
            title={mode === "create" ? "Add Topic" : "Save Changes"}
            variant="primary"
            size="small"
            loading={loading}
            disabled={loading}
            onPress={() => void handleSubmit(submit)()}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  buttonWrapper: {
    flex: 1,
    minWidth: 0,
  },
  button: {
    width: "100%",
    minWidth: 0,
  },
});
