import api from "@/services/api";

import type {
  User,
} from "./types";
import { ChangePassword, EditProfile } from "./schema";
import logger from "@/lib/logger";

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>("/users/me");
    logger.debug("GETME: ", {
      res: response.data,
    });
    return response.data;
  },

  async updateProfile(data: EditProfile): Promise<User> {
    const response = await api.patch<User>("/users/me", data);
    return response.data;
  },

  async changePassword(data: ChangePassword): Promise<void> {
    await api.patch("/users/me/password", data);
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
