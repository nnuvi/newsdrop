
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Icons } from "@/constants/images";
import { Image } from "@/components/ui/image";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";

import { useCreateTopic } from "../mutations";
import { AddTopicModal } from "./add-topic-modal";

export default function TopicHeader() {
  const [showAddTopic, setShowAddTopic] = useState(false);

  const createTopic = useCreateTopic();

  const closeModal = () => {
    if (!createTopic.isPending) {
      setShowAddTopic(false);
    }
  };

  const handleCreateTopic = (data: Parameters<
    typeof createTopic.mutate
  >[0]) => {
    createTopic.mutate(data, {
      onSuccess: () => {
        setShowAddTopic(false);
      },
    });
  };

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedText type="heading" themeColor="text">
          Topics
        </ThemedText>

        <Pressable
          onPress={() => setShowAddTopic(true)}
          hitSlop={8}
          disabled={createTopic.isPending}
        >
          <Image
            source={Icons.add}
            tintColor="foreground"
            size={28}
          />
        </Pressable>
      </ThemedView>

      <AddTopicModal
        visible={showAddTopic}
        loading={createTopic.isPending}
        onClose={closeModal}
        onSubmit={handleCreateTopic}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
