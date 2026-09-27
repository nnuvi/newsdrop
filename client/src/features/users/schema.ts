// import { z } from "zod";

// export const EditProfileSchema = z.object({
//   username: z
//     .string()
//     .min(2, "Username must be at least 2 characters.")
//     .max(50, "Username is too long.")
//     .trim(),

//   email: z.string().email("Enter a valid email address.").trim(),
// });

// export type EditProfileForm = z.infer<typeof EditProfileSchema>;

import { z } from "zod";

export const EditProfileSchema = z.object({
  fullName: z.string().max(100, "Full name is too long.").trim(),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(50, "Username is too long.")
    .trim(),
  email: z.string().email("Enter a valid email address.").trim(),
});

export type EditProfileForm = z.infer<typeof EditProfileSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password is too long."),

    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;
