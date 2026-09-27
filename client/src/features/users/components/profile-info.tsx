import type { ReactNode } from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { ThemedText } from "@/components/ui/themed-text";

import Edit from "@/assets/images/edit.svg";
import { ThemedIcon } from "@/components/shared/theme-icon";
import { useTheme } from "@/hooks/use-theme";
import { Icons } from "@/constants/images";
import { Image } from "@/components/ui/image";

type ProfileInfoProps = {
  label: string;
  value?: string | null;
  editable?: boolean;
  editing?: boolean;
  onEdit?: () => void;
  editContent?: ReactNode;
};

export function ProfileInfo({
  label,
  value,
  editable = false,
  editing = false,
  onEdit,
  editContent,
}: ProfileInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <ThemedText type="small" themeColor="muted">
          {label}
        </ThemedText>

        {editable && !editing ? (
          <Pressable onPress={onEdit} hitSlop={8} style={styles.editButton}>
            {/* <Edit width={16} height={16} /> */}
            <Image source={Icons.edit} size={10} tintColor="muted" />
          </Pressable>
        ) : null}
      </View>

      {editing && editContent ? (
        editContent
      ) : (
        <ThemedText type="default" numberOfLines={2}>
          {value ?? ""}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
    gap: 4,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  editButton: {
    padding: 4,
  },
});
