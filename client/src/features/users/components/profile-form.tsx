import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";
import { Spacing } from "@/constants/theme";
import { useFeedback } from "@/hooks/use-feedback";
import { formatDate } from "@/lib/format-date";

import type { User } from "@/features/auth/types";

import { useUpdateProfile } from "../mutations";
import { EditProfileSchema, type EditProfile } from "../schema";

import { ProfileInfo } from "./profile-info";
import { ProfileSection } from "./profile-section";

type EditableField = "full_name" | "username" | "email" | null;

type ProfileFormProps = {
  user: User;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const { success, error } = useFeedback();
  const updateProfile = useUpdateProfile();

  const [editingField, setEditingField] = useState<EditableField>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<EditProfile>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      full_name: user.full_name ?? "",
      username: user.username,
      email: user.email,
    },
  });

  const formValues = useWatch({ control });

  const onSubmit = async (data: EditProfile) => {
    try {
      await updateProfile.mutateAsync(data);

      reset(data);

      success("Your profile has been updated successfully.", "Profile updated");

      setEditingField(null);
    } catch {
      error(new Error("Unable to update your profile."), "Update failed");
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSection title="ACCOUNT">
        <ProfileInfo
          label="Full Name"
          value={formValues.full_name}
          editable
          editing={editingField === "full_name"}
          onEdit={() => setEditingField("full_name")}
          editContent={
            <FormField
              control={control}
              name="full_name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              label=""
            />
          }
        />

        <ProfileInfo
          label="Username"
          value={formValues.username ? `@${formValues.username}` : ""}
          editable
          editing={editingField === "username"}
          onEdit={() => setEditingField("username")}
          editContent={
            <FormField
              control={control}
              name="username"
              placeholder="Enter your username"
              autoCapitalize="none"
            />
          }
        />

        <ProfileInfo
          label="Email"
          value={formValues.email}
          editable
          editing={editingField === "email"}
          onEdit={() => setEditingField("email")}
          editContent={
            <FormField
              control={control}
              name="email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          }
        />
      </ProfileSection>

      <ProfileSection title="INFO">
        <ProfileInfo label="Joined" value={formatDate(user.created_at)} />
      </ProfileSection>

      {editingField !== null && (
        <View style={styles.saveContainer}>
          <Button
            title="Save Changes"
            width="full"
            disabled={!isDirty}
            loading={updateProfile.isPending}
            onPress={() => {
              void handleSubmit(onSubmit)();
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saveContainer: {
    marginTop: Spacing.one,
  },
});
