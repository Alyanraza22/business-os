import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ProjectTask } from "@/lib/supabase/types";

/** All active deliverables for a project, ordered for display. */
export async function getProjectTasks(
  projectId: string,
): Promise<ProjectTask[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("project_id", projectId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}
