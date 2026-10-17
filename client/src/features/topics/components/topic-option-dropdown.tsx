import { useState } from "react";

import OptionDropdown, {
  type OptionItem,
} from "@/components/shared/option-dropdown";
import { TopicUpdateModal } from "./topic-update-modal";
import {
  useDeactivateTopic,
  useDeleteTopic,
  useReactivateTopic,
} from "../mutations";
import { useTopicContext } from "../context/generate-summary";
import type { TopicResponse } from "../schema";
import { router } from "expo-router";

type TopicOptionsDropdownProps = {
  topic: TopicResponse;
};

export function TopicOptionsDropdown({ topic }: TopicOptionsDropdownProps) {
  const [updateVisible, setUpdateVisible] = useState(false);

  const { refreshing, refreshSummaries } = useTopicContext();

  const { mutate: deactivate, isPending: deactivating } = useDeactivateTopic();

  const { mutate: reactivate, isPending: reactivating } = useReactivateTopic();

  const { mutate: deleteTopic, isPending: deleting } = useDeleteTopic();

  const busy = refreshing || deactivating || reactivating || deleting;

  const notDeleted = !topic.is_deleted;
  const active = notDeleted && topic.is_active;

  const options: OptionItem[] = [
    ...(notDeleted
      ? [
          {
            label: "Edit",
            onPress: () => setUpdateVisible(true),
            disabled: busy,
          },
          {
            label: active ? "Deactivate" : "Activate",
            onPress: () =>
              active ? deactivate(topic.id) : reactivate(topic.id),
            disabled: busy,
          },
          {
            label: "Delete",
            onPress: () => deleteTopic(topic.id),
            disabled: busy,
          },
          ...(active
            ? [
                {
                  label: "Refresh",
                  onPress: refreshSummaries,
                  disabled: busy,
                },
              ]
            : []),
        ]
      : []),
  ];

  return (
    <>
      <OptionDropdown options={options} />

      <TopicUpdateModal
        topicId={topic.id}
        visible={updateVisible}
        onClose={() => setUpdateVisible(false)}
      />
    </>
  );
}
