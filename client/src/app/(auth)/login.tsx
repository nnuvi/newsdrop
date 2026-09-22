import { Link, router } from "expo-router";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

import LogoText from "@/assets/images/logo-text-light.svg";

import { useLogin } from "@/features/auth/queries";
import { loginSchema, type LoginFormData } from "@/features/auth/schema";

export default function LoginScreen() {
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleLogin(data: LoginFormData) {
    console.log("[Login] Form submitted:", data.email);

    login(data, {
      onSuccess: () => {
        console.log("[Login] Login successful");
        router.replace("/home");
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
                  placeholder="Enter your password"
                  secureTextEntry
                />
              )}
            />

            {errors.password && (
              <ThemedText type="small">{errors.password.message}</ThemedText>
            )}
          </View>

          <View style={styles.forgotContainer}>
            <Link href="/#" asChild>
              <ThemedText style={styles.link}>Forgot password?</ThemedText>
            </Link>
          </View>

          <Button
            title={isPending ? "Logging in..." : "Login"}
            variant="primary"
            width="full"
            size="large"
            onPress={handleSubmit(handleLogin)}
            disabled={isPending}
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
