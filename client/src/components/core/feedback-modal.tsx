import { StyleSheet, View } from "react-native";

import AppModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/ui/themed-text";

import { useTheme } from "@/hooks/use-theme";
import { Spacing } from "@/constants/theme";

type FeedbackType = "success" | "error" | "warning" | "info" | "confirm";

export type FeedbackOptions = {
  type: FeedbackType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
};

type FeedbackModalProps = {
  feedback: FeedbackOptions | null;
  onClose: () => void;
};

export default function FeedbackModal({
  feedback,
  onClose,
}: FeedbackModalProps) {
  const theme = useTheme();

  if (!feedback) {
    return null;
  }

  const {
    type,
    title,
    message,
    confirmText = "OK",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  } = feedback;

  const isConfirm = type === "confirm";

  const typeColor = {
    success: theme.success,
    error: theme.error,
    warning: theme.warning,
    info: theme.info,
    confirm: theme.primary,
  }[type];

  async function handleConfirm() {
    await onConfirm?.();
    onClose();
  }

  function handleCancel() {
    onCancel?.();
    onClose();
  }

  return (
    <AppModal
      visible
      onClose={isConfirm ? handleCancel : onClose}
      maxWidth={420}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.indicator,
            {
              backgroundColor: typeColor,
            },
          ]}
        />

        {message && <ThemedText style={styles.message}>{message}</ThemedText>}

        <View style={[styles.actions, !isConfirm && styles.singleAction]}>
          {isConfirm && (
            <Button
              title={cancelText}
              variant="secondary"
              width="medium"
              onPress={handleCancel}
            />
          )}

          <Button
            title={confirmText}
            variant="primary"
            width="medium"
            onPress={isConfirm ? handleConfirm : onClose}
          />
        </View>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing.four,
    paddingTop: Spacing.one,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  message: {
    maxWidth: 340,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.75,
  },

  actions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },

  singleAction: {
    paddingTop: Spacing.three,
  },
});
