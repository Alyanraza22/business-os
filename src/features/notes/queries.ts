import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/supabase/types";

interface GetNotesParams {
  q?: string;
  archived?: boolean;
}

/** Notes for the current user: pinned first, then most recently updated. */
export async function getNotes({
  q,
  archived = false,
}: GetNotesParams = {}): Promise<Note[]> {
  const supabase = await createClient();
  let query = supabase
    .from("notes")
    .select("*")
    .is("deleted_at", null)
    .eq("is_archived", archived)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (q && q.trim()) {
    // Full-text search over the generated tsvector (GIN-indexed).
    query = query.textSearch("search_vector", q.trim(), { type: "websearch" });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}
