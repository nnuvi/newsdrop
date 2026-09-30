import { Link, router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import LogoText from "@/assets/images/logo-text-light.svg";

import { Screen } from "@/components/core/screen";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

import { useLogin } from "@/features/auth/mutations";
import { loginSchema, type LoginFormData } from "@/features/auth/schema";

import { logger } from "@/lib/logger";

export default function LoginScreen() {
  const login = useLogin();

  const {
    control,
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleLogin(data: LoginFormData) {
    logger.debug("[Login] Form submitted", {
      email: data.email,
    });

    login.mutate(data, {
      onSuccess: () => {
        logger.info("[Login] Login successful", {
          email: data.email,
        });

        router.replace("/home");
      },

      onError: (error) => {
        logger.error("[Login] Login failed", error, {
          email: data.email,
        });
      },
    });
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <LogoText width={220} height={64} />

          <ThemedText type="small" style={styles.subtitle}>
            Sign in to continue to NewsDrop.
          </ThemedText>
        </View>

        <View style={styles.form}>
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
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          <View style={styles.forgotContainer}>
            <Link href="/#" asChild>
              <ThemedText style={styles.link}>Forgot password?</ThemedText>
            </Link>
          </View>

          <Button
            title={login.isPending ? "Logging in..." : "Login"}
            variant="primary"
            width="full"
            size="medium"
            onPress={handleSubmit(handleLogin)}
            disabled={login.isPending}
          />
        </View>

        <View style={styles.signup}>
          <ThemedText style={styles.signupText}>
            Don't have an account?
          </ThemedText>

          <Link href="/signup" asChild>
            <ThemedText style={styles.link}>Sign up</ThemedText>
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
    alignItems: "center",
    marginBottom: 36,
  },

  subtitle: {
    textAlign: "center",
    opacity: 0.65,
  },

  form: {
    gap: 20,
  },

  field: {
    gap: 8,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: -8,
  },

  link: {
    color: "#4f66ff",
  },

  signup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 32,
  },

  signupText: {
    opacity: 0.7,
  },
});
