import { z } from "zod";

const emailField = z.email("Enter a valid email address");
const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const signUpSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(1, "Please enter your name")
      .max(80, "Name is too long"),
    email: emailField,
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateAccountSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(80, "Name is too long"),
  avatar_url: z
    .union([z.literal(""), z.url("Enter a valid image URL")])
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
