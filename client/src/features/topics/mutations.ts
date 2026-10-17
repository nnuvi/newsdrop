import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useFeedback } from "@/hooks/use-feedback";
import { getApiErrorMessage } from "@/lib/api-error";

import type { Topic, TopicUpdate } from "./schema";
import { topicKeys } from "./keys";
import { topicService } from "./service";
import { summaryService } from "../summaries/service";
import { summaryKeys } from "../summaries/keys";
import { router } from "expo-router";

export function useCreateTopic() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (data: Topic) => topicService.createTopic(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: topicKeys.all,
      });

      success("Topic created successfully");
      // router.replace("/home");
    },

    onError: (err: unknown) => {
      error(getApiErrorMessage(err));
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: ({ topicId, data }: { topicId: string; data: TopicUpdate }) =>
      topicService.updateTopic(topicId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: topicKeys.all,
      });

      success("Topic updated successfully");
    },

    onError: (err: unknown) => {
      error(getApiErrorMessage(err));
    },
  });
}

export function useDeactivateTopic() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (topicId: string) => topicService.deactivateTopic(topicId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: topicKeys.all,
      });

      success("Topic deactivated successfully");
    },

    onError: (err: unknown) => {
      error(getApiErrorMessage(err));
    },
  });
}

export function useReactivateTopic() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (topicId: string) => topicService.reactivateTopic(topicId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: topicKeys.all,
      });

      success("Topic reactivated successfully");
    },

    onError: (err: unknown) => {
      error(getApiErrorMessage(err));
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (topicId: string) => topicService.deleteTopic(topicId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: topicKeys.all,
      });

      success("Topic deleted successfully");
      router.replace("/home");
    },

    onError: (err: unknown) => {
      error(getApiErrorMessage(err));
    },
  });
}

export function useGenerateSummaries() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (topicId: string) =>
      summaryService.generateTopicSummary(topicId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: summaryKeys.all,
      });

      success("Topic summaries generated successfully");
    },

    onError: (err: unknown) => {
      error(getApiErrorMessage(err));
    },
  });
}
