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
  full_name: z
    .string()
    .max(120, {
      error: "Full name is too long.",
    })
    .trim(),

  username: z
    .string()
    .min(3, {
      error: "Username must be at least 3 characters.",
    })
    .max(30, {
      error: "Username is too long.",
    })
    .regex(/^[A-Za-z0-9_]+$/, {
      error: "Username can only contain letters, numbers, and underscores.",
    })
    .trim(),

  email: z
    .email({
      error: "Enter a valid email address.",
    })
    .trim(),
});

export type EditProfile = z.infer<typeof EditProfileSchema>;

export const ChangePasswordSchema = z
  .object({
    current_password: z.string().min(1, {
      error: "Enter your current password.",
    }),

    new_password: z
      .string()
      .min(8, {
        error: "Password must be at least 8 characters.",
      })
      .max(128, {
        error: "Password is too long.",
      }),

    confirm_password: z.string().min(1, {
      error: "Confirm your new password.",
    }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    error: "Passwords do not match.",
    path: ["confirm_password"],
  });

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
