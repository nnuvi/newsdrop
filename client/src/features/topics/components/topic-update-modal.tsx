import { QueryState } from "@/components/shared/query-state";
import AppModal from "@/components/ui/modal";

import { useUpdateTopic } from "../mutations";
import { useTopic } from "../queries";
import type { Topic, TopicResponse } from "../schema";

import { TopicForm } from "./topic-form";

type TopicUpdateProps = {
  topicId: string;
  visible: boolean;
  onClose: () => void;
};

export function TopicUpdateModal({
  topicId,
  visible,
  onClose,
}: TopicUpdateProps) {
  const topicQuery = useTopic(topicId);
  const updateTopic = useUpdateTopic();

  const handleSubmit = (data: Topic) => {
    const updateData: Topic = data;

    updateTopic.mutate(
      {
        topicId,
        data: updateData,
      },
      {
        onSuccess: onClose,
      },
    );
  };

  return (
    <AppModal visible={visible} onClose={onClose}>
      <QueryState<TopicResponse>
        {...topicQuery}
        loadingMessage="Loading topic..."
      >
        {(topic) => (
          <TopicForm
            mode="edit"
            initialValues={topic}
            loading={updateTopic.isPending}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        )}
      </QueryState>
    </AppModal>
  );
}
