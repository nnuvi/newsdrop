import { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { ThemedText } from "./themed-text";
import type { SelectOption } from "./select";
import { Button } from "./button";
import { BottomSheetModal } from "./bottom-sheet-modal";
import { CheckboxOption } from "./checkbox-option";

type MultiSelectProps = {
  label?: string;
  value: string[];
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onValueChange: (values: string[]) => void;
};

export function MultiSelect({
  label,
  value,
  options,
  placeholder = "Select options",
  disabled = false,
  error,
  onValueChange,
}: MultiSelectProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  const toggleOption = (option: SelectOption) => {
    if (option.enabled === false) return;

    onValueChange(
      value.includes(option.value)
        ? value.filter((item) => item !== option.value)
        : [...value, option.value],
    );
  };

  const shadowStyle =
    Platform.OS === "web"
      ? { boxShadow: `0px 2px 8px ${theme.shadow}` }
      : {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 3,
        };

  return (
    <View style={styles.container}>
      {label ? (
        <ThemedText type="smallBold" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={[
          styles.trigger,
          shadowStyle,
          {
            backgroundColor: disabled
              ? theme.backgroundSelected
              : theme.backgroundElement,
            borderColor: error ? theme.error : theme.primary,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        <ThemedText
          type="default"
          themeColor={selectedLabels.length ? "text" : "muted"}
          style={styles.selectedText}
        >
          {selectedLabels.length ? selectedLabels.join(", ") : placeholder}
        </ThemedText>

        <ThemedText type="default" themeColor="muted">
          {visible ? "▲" : "▼"}
        </ThemedText>
      </Pressable>

      {error ? (
        <ThemedText type="small" style={{ color: theme.error }}>
          {error}
        </ThemedText>
      ) : null}

      <BottomSheetModal
        visible={visible}
        onClose={() => setVisible(false)}
        title={label ?? placeholder}
      >
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          style={styles.optionsList}
          renderItem={({ item }) => (
            <CheckboxOption
              label={item.label}
              selected={value.includes(item.value)}
              disabled={item.enabled === false}
              onPress={() => toggleOption(item)}
            />
          )}
        />

        <View style={styles.actions}>
          <Button
            title="Clear all"
            variant="outline"
            // width="auto"
            style={styles.actionButton}
            onPress={() => onValueChange([])}
          />

          <Button
            title={`Done (${value.length})`}
            // width="auto"
            style={styles.actionButton}
            onPress={() => setVisible(false)}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  label: {
    marginBottom: Spacing.one,
    paddingLeft: Spacing.two,
  },
  trigger: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: 12,
  },
  selectedText: {
    flex: 1,
  },
  optionsList: {
    flexGrow: 0,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    // flexWrap: "wrap",
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  actionButton: {
    flex: 1,
    minWidth: 0,
  },
});
