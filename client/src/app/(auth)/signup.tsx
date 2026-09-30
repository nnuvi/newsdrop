import { Link, router } from "expo-router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

import LogoText from "@/assets/images/logo-text-light.svg";

import { signupSchema, type SignupFormData } from "@/features/auth/schema";

import { useSignup } from "@/features/auth/mutations";

export default function SignupScreen() {
  const { mutate: signup, isPending } = useSignup();

  const { control, handleSubmit } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      full_name: "",
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

            <FormField
              control={control}
              name="username"
              placeholder="username"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Full name</ThemedText>

            <FormField
              control={control}
              name="full_name"
              placeholder="Your name"
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Email</ThemedText>

            <FormField
              control={control}
              name="email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Password</ThemedText>

            <FormField
              control={control}
              name="password"
              placeholder="At least 8 characters"
              secureTextEntry
            />
          </View>

          <Button
            title={isPending ? "Creating account..." : "Create account"}
            variant="primary"
            width="full"
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
