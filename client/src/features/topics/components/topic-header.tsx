import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Icons } from "@/constants/images";
import { Image } from "@/components/ui/image";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import AppModal from "@/components/ui/modal";

import { useCreateTopic } from "../mutations";
import type { Topic } from "../schema";
import { TopicForm } from "./topic-form";

export function TopicHeader() {
  const [showAddTopic, setShowAddTopic] = useState(false);
  const createTopic = useCreateTopic();

  const closeModal = () => {
    if (!createTopic.isPending) {
      setShowAddTopic(false);
    }
  };

  const handleSubmit = (data: Topic) => {
    createTopic.mutate(data, {
      onSuccess: () => setShowAddTopic(false),
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
          accessibilityRole="button"
          accessibilityLabel="Add topic"
        >
          <Image source={Icons.add} tintColor="foreground" size={28} />
        </Pressable>
      </ThemedView>

      <AppModal visible={showAddTopic} onClose={closeModal}>
        <TopicForm
          mode="create"
          loading={createTopic.isPending}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </AppModal>
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
