import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { Spacing } from "@/constants/theme";

import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "./themed-text";

type TagsInputProps = Omit<TextInputProps, "value" | "onChangeText"> & {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  disabled?: boolean;
};

export function TagsInput({
  value,
  onChange,
  placeholder = "Add a tag",
  error,
  disabled = false,
  editable = true,
  style,
  ...props
}: TagsInputProps) {
  const theme = useTheme();
  const [text, setText] = useState("");

  const isEditable = editable && !disabled;

  const addTag = () => {
    const tag = text.trim();

    if (!tag || value.includes(tag)) {
      return;
    }

    onChange([...value, tag]);
    setText("");
  };

  const removeTag = (tag: string) => {
    if (!isEditable) return;

    onChange(value.filter((item) => item !== tag));
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: disabled
                ? theme.backgroundSelected
                : theme.backgroundElement,
              borderColor: error ? theme.error : theme.primary,
              opacity: disabled ? 0.6 : 1,

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
          ]}
        >
          {value.map((tag) => (
            <View
              key={tag}
              style={[
                styles.tag,
                {
                  backgroundColor: theme.backgroundSelected,
                },
              ]}
            >
              <ThemedText type="small">{tag}</ThemedText>

              {isEditable ? (
                <Pressable onPress={() => removeTag(tag)} hitSlop={6}>
                  <ThemedText type="small" themeColor="muted">
                    ×
                  </ThemedText>
                </Pressable>
              ) : null}
            </View>
          ))}

          {isEditable ? (
            <TextInput
              {...props}
              value={text}
              editable={isEditable}
              onChangeText={setText}
              placeholder={placeholder}
              placeholderTextColor={theme.placeholder}
              style={[
                styles.input,
                {
                  color: theme.text,
                },
                style,
              ]}
              onSubmitEditing={addTag}
              returnKeyType="done"
            />
          ) : null}
        </View>

        {isEditable ? (
          <Pressable
            onPress={addTag}
            disabled={!text.trim()}
            hitSlop={6}
            style={[
              styles.addButton,
              {
                backgroundColor: text.trim()
                  ? theme.primary
                  : theme.backgroundSelected,
              },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{
                color: text.trim() ? theme.backgroundElevated : theme.muted,
              }}
            >
              +
            </ThemedText>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <ThemedText type="small" style={{ color: theme.error }}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },

  inputContainer: {
    flex: 1,
    minHeight: 42,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: 12,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderRadius: 999,
    marginVertical: 4,
  },

  input: {
    flex: 1,
    minWidth: 100,
    minHeight: 42,
    paddingVertical: 0,
    fontSize: 16,
  },

  addButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
});