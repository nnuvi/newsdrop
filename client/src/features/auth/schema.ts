import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),

  fullName: z
    .string()
    .max(120, "Full name is too long")
    .optional(),

  email: z
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;