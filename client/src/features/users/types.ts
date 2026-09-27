import type { User } from "@/features/auth/types";

export type { User };

export type UpdateProfileRequest = {
  fullName: string;
  username: string;
  email: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type NotificationPreferences = {
  enabled: boolean;
};
