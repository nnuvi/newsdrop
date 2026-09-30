import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userKeys } from "./queries";
import { userService } from "./service";
import type {
  ChangePasswordRequest,
  //   NotificationPreferences,
  UpdateProfileRequest,
} from "./types";
import { ChangePassword, EditProfile } from "./schema";
import { useFeedback } from "@/hooks/use-feedback";
import { getApiErrorMessage } from "@/lib/api-error";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (data: EditProfile) => userService.updateProfile(data),

    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me(), user);
    },

    onError: (err: unknown) => {
      error(err, getApiErrorMessage(error));
    },
  });
}

export function useChangePassword() {
  const { success, error } = useFeedback();
  return useMutation({
    mutationFn: (data: ChangePassword) => userService.changePassword(data),

    onError: (err: unknown) => {
      error(err, getApiErrorMessage(error));
    },
  });
}

// export function useUpdateNotificationPreferences() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: NotificationPreferences) =>
//       userService.updateNotificationPreferences(data),

//     onSuccess: preferences => {
//       queryClient.setQueryData(
//         userKeys.notifications(),
//         preferences,
//       );
//     },
//   });
// }
