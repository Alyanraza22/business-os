import type { BadgeVariant } from "@/features/shared/constants";
import type { Enums } from "@/lib/supabase/types";

export const GOAL_TYPE_META: Record<Enums<"goal_type">, { label: string }> = {
  daily: { label: "Daily" },
  weekly: { label: "Weekly" },
  monthly: { label: "Monthly" },
  yearly: { label: "Yearly" },
};

export const GOAL_STATUS_META: Record<
  Enums<"goal_status">,
  { label: string; badge: BadgeVariant }
> = {
  active: { label: "Active", badge: "secondary" },
  completed: { label: "Completed", badge: "success" },
  archived: { label: "Archived", badge: "outline" },
};
