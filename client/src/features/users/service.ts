import api from "@/services/api";

import type {
  //   NotificationPreferences,
  UpdateProfileRequest,
  User,
} from "./types";

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>("/users/me");
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await api.patch<User>("/users/me", data);
    return response.data;
  },

  //   async getNotificationPreferences(): Promise<NotificationPreferences> {
  //     const response = await api.get<NotificationPreferences>(
  //       "/users/me/notifications",
  //     );
  //     return response.data;
  //   },

  //   async updateNotificationPreferences(
  //     data: NotificationPreferences,
  //   ): Promise<NotificationPreferences> {
  //     const response = await api.patch<NotificationPreferences>(
  //       "/users/me/notifications",
  //       data,
  //     );
  //     return response.data;
  //   },
};
