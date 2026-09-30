import { StyleSheet, View } from "react-native";

import AppModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { ThemedText } from "@/components/ui/themed-text";

import { Icons } from "@/constants/images";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

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

  // const typeColor = {
  //   success: theme.success,
  //   error: theme.error,
  //   warning: theme.warning,
  //   info: theme.info,
  //   confirm: theme.primary,
  // }[type];

  const typeImage =
    type === "success"
      ? Icons.tick
      : type === "error"
        ? Icons.cross
        : undefined;

  const iconBackground = {
    success: "#D8F5E8",
    error: "#FCE0E2",
    warning: "#FFF0D2",
    info: "#DCEBFF",
    confirm: "#E9DEFF",
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
        <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
          {typeImage && <Image source={typeImage} style={styles.image} />}
        </View>

        <ThemedText style={styles.title}>{title}</ThemedText>

        {message && <ThemedText style={styles.message}>{message}</ThemedText>}

        <View style={[styles.actions, !isConfirm && styles.singleAction]}>
          {isConfirm && (
            <Button
              title={cancelText}
              variant="secondary"
              onPress={handleCancel}
            />
          )}

          <Button
            title={confirmText}
            variant="primary"
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
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },

  iconCircle: {
    width: 77,
    height: 77,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
  },

  image: {
    width: 36,
    height: 36,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.two,
  },

  message: {
    maxWidth: 340,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.7,
  },

  actions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.three,
    paddingTop: Spacing.four,
  },

  singleAction: {
    paddingTop: Spacing.four,
  },
});
