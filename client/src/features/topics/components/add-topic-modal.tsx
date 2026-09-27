import { Button } from "@/components/ui/button";
import { AddTopicFormValues, TopicCreate } from "../schema";
import AppModal from "@/components/ui/modal";
import { AddTopicForm } from "./add-topic-form";

type AddTopicModalProps = {
  visible: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: TopicCreate) => void;
};

export function AddTopicModal({
  visible,
  loading = false,
  onClose,
  onSubmit,
}: AddTopicModalProps) {
  return (
    <AppModal visible={visible} onClose={onClose} >
      <AddTopicForm onSubmit={onSubmit} loading={loading}/>
    </AppModal>
  );
}
