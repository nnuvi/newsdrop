import { useState } from "react";

import OptionDropdown, {
  type OptionItem,
} from "@/components/shared/option-dropdown";

import { useGenerateSummaries } from "@/features/summaries/queries";

import { TopicUpdateModal } from "./topic-update-modal";

import { Screen } from "@/components/core/screen";

type TopicOptionsModalProps = {
  topicId: string;
  loading?: boolean;
};

export function TopicOptionsDropdown({
  topicId,
  loading = false,
}: TopicOptionsModalProps) {
  const [updateVisible, setUpdateVisible] = useState(false);

  const refreshQuery = useGenerateSummaries(topicId);

  const options: OptionItem[] = [
    {
      label: "Edit",
      onPress: () => {
        setUpdateVisible(true);
      },
      disabled: loading || refreshQuery.isRefetching,
    },
    {
      label: "Refresh",
      onPress: () => {
        refreshQuery.refetch();
      },
      disabled: loading || refreshQuery.isRefetching,
    },
  ];

  return (
    <>
      <OptionDropdown options={options} />

      <TopicUpdateModal
        topicId={topicId}
        visible={updateVisible}
        onClose={() => setUpdateVisible(false)}
      />
    </>
  );
}
