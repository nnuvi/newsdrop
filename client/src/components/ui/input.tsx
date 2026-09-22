import {
  Platform,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

import { Spacing } from "@/constants/theme";

import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "@/components/ui/themed-text";

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, style, ...props }: InputProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText type="smallBold" style={styles.label}>
          {label}
        </ThemedText>
      )}

      <TextInput
        {...props}
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.backgroundElement,
            borderColor: error ? theme.error : theme.border,

            ...(Platform.OS === "web"
              ? {
                  boxShadow: `0px 2px 8px ${theme.shadow}`,
                }
              : {
                  shadowColor: theme.shadow,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 8,
                  elevation: 3,
                }),
          },
          style,
        ]}
      />

      {error ? (
        <ThemedText type="small" style={{ color: theme.error }}>
          {error}
        </ThemedText>
      ) : hint ? (
        <ThemedText type="small" style={{ color: theme.muted }}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },

  label: {
    marginBottom: Spacing.one,
    paddingLeft: Spacing.five,
  },

  input: {
    minHeight: 48,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: 999,
    fontSize: 16,
  },
});
