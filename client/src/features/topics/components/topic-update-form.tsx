// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { StyleSheet, View } from "react-native";

// import { FormField } from "@/components/shared/form-field";
// import { FormTagsInput } from "@/components/shared/tags-input-field";
// import { Button } from "@/components/ui/button";
// import { ThemedText } from "@/components/ui/themed-text";
// import { Spacing } from "@/constants/theme";

// import {
//   TopicUpdateSchema,
//   type TopicUpdateFormInput,
//   type TopicUpdateFormValues,
//   type TopicUpdate,
// } from "../schema";

// type UpdateTopicFormProps = {
//   initialValues: TopicUpdateFormInput;
//   loading?: boolean;
//   onSubmit: (data: TopicUpdate) => void;
//   onCancel?: () => void;
// };

// export function UpdateTopicForm({
//   initialValues,
//   loading = false,
//   onSubmit,
//   onCancel,
// }: UpdateTopicFormProps) {
//   const { control, handleSubmit } = useForm<
//     TopicUpdateFormInput,
//     any,
//     TopicUpdateFormValues
//   >({
//     resolver: zodResolver(TopicUpdateSchema),
//     defaultValues: initialValues,
//   });

//   const submit = (data: TopicUpdateFormValues) => {
//     onSubmit({
//       name: data.name,
//       categories: data.categories,
//       tags: data.tags,
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <ThemedText type="heading" themeColor="text" center>
//         Edit Topic
//       </ThemedText>

//       <FormField
//         control={control}
//         name="name"
//         label="Topic"
//         placeholder="e.g. Artificial Intelligence"
//         autoCapitalize="words"
//         disabled={loading}
//       />

//       <FormTagsInput
//         control={control}
//         name="categories"
//         label="Categories"
//         placeholder="e.g. Technology"
//         disabled={loading}
//       />

//       <FormTagsInput
//         control={control}
//         name="tags"
//         label="Tags"
//         placeholder="Type a tag and press Enter"
//         disabled={loading}
//       />

//       <View style={styles.actions}>
//         {onCancel ? (
//           <Button
//             title="Cancel"
//             variant="secondary"
//             width="full"
//             disabled={loading}
//             onPress={onCancel}
//           />
//         ) : null}

//         <Button
//           title="Update Topic"
//           variant="primary"
//           width="full"
//           loading={loading}
//           onPress={() => {
//             void handleSubmit(submit)();
//           }}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     gap: Spacing.three,
//   },

//   actions: {
//     gap: Spacing.two,
//     marginTop: Spacing.two,
//   },
// });
