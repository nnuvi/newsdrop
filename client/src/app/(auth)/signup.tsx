import { Link, router } from "expo-router";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

import LogoText from "@/assets/images/logo-text-light.svg";

import { signupSchema, type SignupFormData } from "@/features/auth/schema";

import { useSignup } from "@/features/auth/queries";

export default function SignupScreen() {
  const { mutate: signup, isPending } = useSignup();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
    },
  });

  function handleSignup(data: SignupFormData) {
    signup(data, {
      onSuccess: () => {
        router.replace("/login");
      },
    });
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <LogoText width={220} height={64} />

          <ThemedText type="small" style={styles.subtitle}>
            Create an account to personalize your news feed.
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <ThemedText type="smallBold">Username</ThemedText>

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="username"
                  autoCapitalize="none"
                />
              )}
            />

            {errors.username && (
              <ThemedText type="small">{errors.username.message}</ThemedText>
            )}
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Full name</ThemedText>

            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Your name"
                />
              )}
            />

            {errors.fullName && (
              <ThemedText type="small">{errors.fullName.message}</ThemedText>
            )}
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Email</ThemedText>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              )}
            />

            {errors.email && (
              <ThemedText type="small">{errors.email.message}</ThemedText>
            )}
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Password</ThemedText>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="At least 8 characters"
                  secureTextEntry
                />
              )}
            />

            {errors.password && (
              <ThemedText type="small">{errors.password.message}</ThemedText>
            )}
          </View>

          <Button
            title={isPending ? "Creating account..." : "Create account"}
            variant="primary"
            width="full"
            size="large"
            onPress={handleSubmit(handleSignup)}
            disabled={isPending}
            style={styles.button}
          />
        </View>

        <View style={styles.login}>
          <ThemedText style={styles.loginText}>
            Already have an account?
          </ThemedText>

          <Link href="/login" asChild>
            <ThemedText style={styles.link}>Log in</ThemedText>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  header: {
    marginBottom: 32,
    alignItems: "center",
  },

  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },

  form: {
    gap: 20,
  },

  field: {
    gap: 8,
  },

  button: {
    marginTop: 16,
  },

  link: {
    color: "#4f66ff",
  },

  login: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 32,
  },

  loginText: {
    opacity: 0.7,
  },
});
