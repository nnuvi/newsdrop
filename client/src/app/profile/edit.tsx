import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

import { Header } from "@/components/shared/header";
import { Screen } from "@/components/core/screen";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useFeedback } from "@/hooks/use-feedback";

import { useMe } from "@/features/users/queries";
import { useUpdateProfile } from "@/features/users/mutations";

const EditProfileSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(50, "Username is too long.")
    .trim(),

  email: z.string().email("Enter a valid email address.").trim(),
});

type EditProfileForm = z.infer<typeof EditProfileSchema>;

export default function EditProfileScreen() {
  const theme = useTheme();
  const { success, error } = useFeedback();

  const { data: user, error: userError, isPending, isError, refetch } = useMe();

  const updateProfile = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(EditProfileSchema),
    values: user
      ? {
          username: user.username,
          email: user.email,
        }
      : undefined,
  });

  const onSubmit = async (data: EditProfileForm) => {
    try {
      await updateProfile.mutateAsync(data);

      success("Your profile has been updated successfully.", "Profile updated");

      router.back();
    } catch {
      error(new Error("Unable to update your profile."), "Update failed");
    }
  };

  if (isPending) {
    return (
      <Screen>
        <Header title="Edit Profile" />
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} />
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <Header title="Edit Profile" />
        <ErrorState
          message={
            userError instanceof Error
              ? userError.message
              : "Unable to load your profile."
          }
          onRetry={refetch}
        />
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen>
        <Header title="Edit Profile" />
        <EmptyState
          title="Profile unavailable"
          message="Your profile information could not be loaded."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Edit Profile" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Field
            control={control}
            name="username"
            label="Username"
            placeholder="Enter your username"
            errorMessage={errors.username?.message}
            theme={theme}
          />

          <Field
            control={control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={errors.email?.message}
            theme={theme}
          />

          <Pressable
            disabled={!isDirty || updateProfile.isPending}
            onPress={handleSubmit(onSubmit)}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor:
                  !isDirty || updateProfile.isPending
                    ? theme.borderStrong
                    : theme.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            {updateProfile.isPending ? (
              <ActivityIndicator color={theme.foreground} />
            ) : (
              <ThemedText
                type="default"
                themeColor="foreground"
                style={styles.buttonText}
              >
                Save Changes
              </ThemedText>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

type FieldProps = {
  control: any;
  name: "username" | "email";
  label: string;
  placeholder: string;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences";
  errorMessage?: string;
  theme: ReturnType<typeof useTheme>;
};

function Field({
  control,
  name,
  label,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  errorMessage,
  theme,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold" style={styles.label}>
        {label}
      </ThemedText>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.placeholder}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: theme.backgroundElevated,
                borderColor: errorMessage ? theme.error : theme.border,
              },
            ]}
          />
        )}
      />

      {errorMessage ? (
        <ThemedText type="small" themeColor="error" style={styles.error}>
          {errorMessage}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  content: {
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },

  field: {
    gap: Spacing.one,
  },

  label: {
    marginBottom: Spacing.one,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },

  error: {
    marginTop: 2,
  },

  button: {
    minHeight: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.two,
  },

  buttonText: {
    fontWeight: "600",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
