import { z } from "zod";

import {
  EARNING_CATEGORIES,
  GOAL_STATUSES,
  GOAL_TYPES,
  PRIORITIES,
  PROJECT_STATUSES,
  TASK_STATUSES,
  THEMES,
} from "@/lib/enums";

// Re-export the Zod-free enum lists so existing "@/lib/validations" imports work.
export * from "@/lib/enums";

// Enum schemas ---------------------------------------------------------------
export const projectStatusSchema = z.enum(PROJECT_STATUSES);
export const taskStatusSchema = z.enum(TASK_STATUSES);
export const prioritySchema = z.enum(PRIORITIES);
export const goalTypeSchema = z.enum(GOAL_TYPES);
export const goalStatusSchema = z.enum(GOAL_STATUSES);
export const earningCategorySchema = z.enum(EARNING_CATEGORIES);
export const themeSchema = z.enum(THEMES);

// Primitive schemas mirroring database constraints --------------------------
export const uuidSchema = z.string().uuid();

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a date as YYYY-MM-DD");

export const isoDateTimeSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date-time");

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Expected a hex color, e.g. #6366F1");

export const currencySchema = z.string().trim().length(3).toUpperCase();
