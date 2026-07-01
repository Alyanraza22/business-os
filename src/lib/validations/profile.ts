import { z } from "zod";

import { currencySchema, themeSchema } from "./shared";

export const updateProfileSchema = z.object({
  full_name: z.string().trim().max(120).nullish(),
  avatar_url: z.string().url().nullish(),
  currency: currencySchema.optional(),
  timezone: z.string().trim().min(1).max(64).optional(),
  theme: themeSchema.optional(),
  working_hours_per_day: z.number().min(0).max(24).optional(),
  onboarded: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
