import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userKeys } from "./queries";
import { userService } from "./service";
import type {
  ChangePasswordRequest,
  //   NotificationPreferences,
  UpdateProfileRequest,
} from "./types";
import { ChangePassword, EditProfile } from "./schema";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditProfile) => userService.updateProfile(data),

    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me(), user);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePassword) =>
      userService.changePassword(data),
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
