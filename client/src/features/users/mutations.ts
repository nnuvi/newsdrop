import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userKeys } from "./queries";
import { userService } from "./service";
import type {
//   NotificationPreferences,
  UpdateProfileRequest,
} from "./types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      userService.updateProfile(data),

    onSuccess: user => {
      queryClient.setQueryData(userKeys.me(), user);
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