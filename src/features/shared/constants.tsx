import type { Enums } from "@/lib/supabase/types";

/** Badge variants available in the design system. */
export type BadgeVariant =
  "default" | "secondary" | "success" | "warning" | "destructive" | "outline";

/** Display metadata for the shared priority enum (projects and tasks). */
export const PRIORITY_META: Record<
  Enums<"priority">,
  { label: string; badge: BadgeVariant }
> = {
  low: { label: "Low", badge: "outline" },
  medium: { label: "Medium", badge: "secondary" },
  high: { label: "High", badge: "warning" },
  urgent: { label: "Urgent", badge: "destructive" },
};
