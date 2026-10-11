import AppModal from "@/components/ui/modal";

import type { Topic } from "../schema";
import { TopicForm } from "./topic-form";

type AddTopicModalProps = {
  visible: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: Topic) => void;
};

export function AddTopicModal({
  visible,
  loading = false,
  onClose,
  onSubmit,
}: AddTopicModalProps) {
  return (
    <AppModal visible={visible} onClose={onClose}>
      <TopicForm
        mode="create"
        loading={loading}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppModal>
  );
}