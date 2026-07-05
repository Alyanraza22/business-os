import type { BadgeVariant } from "@/features/shared/constants";
import type { Enums } from "@/lib/supabase/types";

export const TASK_STATUS_META: Record<
  Enums<"task_status">,
  { label: string; badge: BadgeVariant }
> = {
  todo: { label: "To do", badge: "outline" },
  in_progress: { label: "In progress", badge: "default" },
  blocked: { label: "Blocked", badge: "destructive" },
  review: { label: "Review", badge: "warning" },
  completed: { label: "Completed", badge: "success" },
  cancelled: { label: "Cancelled", badge: "secondary" },
};
