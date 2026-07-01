import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Enums, Goal } from "@/lib/supabase/types";

interface GetGoalsParams {
  type?: string;
  status?: string;
  q?: string;
}

const GOAL_TYPE_VALUES: readonly Enums<"goal_type">[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];
const GOAL_STATUS_VALUES: readonly Enums<"goal_status">[] = [
  "active",
  "completed",
  "archived",
];

function isType(value?: string): value is Enums<"goal_type"> {
  return value !== undefined && (GOAL_TYPE_VALUES as string[]).includes(value);
}
function isStatus(value?: string): value is Enums<"goal_status"> {
  return (
    value !== undefined && (GOAL_STATUS_VALUES as string[]).includes(value)
  );
}

/** Active (non-deleted) goals for the current user, newest first. */
export async function getGoals({
  type,
  status,
  q,
}: GetGoalsParams = {}): Promise<Goal[]> {
  const supabase = await createClient();

  let query = supabase
    .from("goals")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (isType(type)) query = query.eq("type", type);
  if (isStatus(status)) query = query.eq("status", status);
  if (q && q.trim()) query = query.ilike("title", `%${q.trim()}%`);

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}
