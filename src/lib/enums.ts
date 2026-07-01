import type { Enums } from "@/lib/supabase/types";

/**
 * Enum value lists, single-sourced and Zod-free so client components can import
 * them without pulling Zod (and every schema) into the browser bundle. The
 * `satisfies` clause fails the build if any list drifts from the DB enums.
 */

export const PROJECT_STATUSES = [
  "planning",
  "active",
  "paused",
  "completed",
  "archived",
] as const satisfies readonly Enums<"project_status">[];

export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "blocked",
  "review",
  "completed",
  "cancelled",
] as const satisfies readonly Enums<"task_status">[];

/** Statuses surfaced in the UI (legacy "cancelled" is kept in the DB only). */
export const VISIBLE_TASK_STATUSES = [
  "todo",
  "in_progress",
  "blocked",
  "review",
  "completed",
] as const satisfies readonly Enums<"task_status">[];

export const PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent",
] as const satisfies readonly Enums<"priority">[];

export const GOAL_TYPES = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const satisfies readonly Enums<"goal_type">[];

export const GOAL_STATUSES = [
  "active",
  "completed",
  "archived",
] as const satisfies readonly Enums<"goal_status">[];

export const EARNING_CATEGORIES = [
  "freelancing",
  "etsy",
  "affiliate",
  "ads",
  "other",
] as const satisfies readonly Enums<"earning_category">[];

export const THEMES = ["light", "dark", "system"] as const;
