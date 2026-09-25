import type { User } from "@/features/auth/types";

export type { User };
    


export type UpdateProfileRequest = {
  username: string;
  email: string;
};

export type NotificationPreferences = {
  enabled: boolean;
};