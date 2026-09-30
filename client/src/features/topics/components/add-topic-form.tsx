import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { FormField } from "@/components/shared/form-field";
import { FormTagsInput } from "@/components/shared/tags-input-field";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/ui/themed-text";
import { Spacing } from "@/constants/theme";

import {
  AddTopicSchema,
  type AddTopicFormInput,
  type AddTopicFormValues,
  type TopicCreate,
} from "../schema";

type AddTopicFormProps = {
  loading?: boolean;
  onSubmit: (data: TopicCreate) => void;
  onCancel?: () => void;
};

export function AddTopicForm({
  loading = false,
  onSubmit,
  onCancel,
}: AddTopicFormProps) {
  const { control, handleSubmit } = useForm<
    AddTopicFormInput,
    any,
    AddTopicFormValues
  >({
    resolver: zodResolver(AddTopicSchema),
    defaultValues: {
      name: "",
      category: [],
      tags: [],
    },
  });

  const submit = (data: AddTopicFormValues) => {
    onSubmit({
      name: data.name,
      categories: data.category,
      tags: data.tags,
    });
  };

  return (
    <View style={styles.container}>
      <ThemedText type="heading" themeColor="text" center>
        Add Topic
      </ThemedText>

      <FormField
        control={control}
        name="name"
        label="Topic"
        placeholder="e.g. Artificial Intelligence"
        autoCapitalize="words"
      />

      <FormTagsInput
        control={control}
        name="category"
        label="Category"
        placeholder="e.g. Technology"
      />

      <FormTagsInput
        control={control}
        name="tags"
        label="Tags"
        placeholder="Type a tag and press Enter"
      />

      <View style={styles.actions}>
        {onCancel ? (
          <Button
            title="Cancel"
            variant="secondary"
            width="full"
            disabled={loading}
            onPress={onCancel}
          />
        ) : null}

        <Button
          title="Add Topic"
          variant="primary"
          width="full"
          loading={loading}
          onPress={() => {
            void handleSubmit(submit)();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
