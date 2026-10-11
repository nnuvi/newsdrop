import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { FormField } from "@/components/shared/form-field";
import { FormTagsInput } from "@/components/shared/tags-input-field";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/ui/themed-text";
import { Spacing } from "@/constants/theme";

import {
  TopicSchema,
  type Topic,
  type TopicFormInput,
  type TopicFormValues,
  type TopicResponse,
} from "../schema";

type TopicFormProps = {
  mode: "create" | "edit";
  initialValues?: Pick<TopicResponse, "name" | "keywords">;
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
    },
  });

  useEffect(() => {
    reset({
      name: initialValues?.name ?? "",
      keywords: initialValues?.keywords ?? [],
    });
  }, [initialValues?.name, initialValues?.keywords, reset]);

  const submit = (values: TopicFormValues) => {
    const data: Topic = {
      name: values.name,
      keywords: values.keywords,
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
