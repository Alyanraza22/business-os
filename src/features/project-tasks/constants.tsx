import type { BadgeVariant } from "@/features/shared/constants";
import type { Enums } from "@/lib/supabase/types";

/**
 * Status metadata for project tasks (deliverables). "review" is surfaced as
 * "Ready" — the deliverable is done pending a manual mark-complete, which is
 * the only status that moves project progress.
 */
export const PROJECT_TASK_STATUS_META: Record<
  Enums<"task_status">,
  { label: string; badge: BadgeVariant }
> = {
  todo: { label: "To do", badge: "outline" },
  in_progress: { label: "In progress", badge: "secondary" },
  blocked: { label: "Blocked", badge: "destructive" },
  review: { label: "Ready", badge: "warning" },
  completed: { label: "Completed", badge: "success" },
  cancelled: { label: "Cancelled", badge: "outline" },
};
