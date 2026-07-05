"use server";

import { createClient } from "@/lib/supabase/server";

import type { SearchResult } from "./types";

/**
 * Universal search across the user's projects, tasks, goals, notes and
 * earnings. Runs under the user's session, so RLS scopes results to them.
 */
export async function globalSearch(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 1) return [];

  const supabase = await createClient();
  const like = `%${q}%`;

  const [projects, tasks, goals, notes, earnings] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name")
      .is("deleted_at", null)
      .ilike("name", like)
      .limit(5),
    supabase
      .from("tasks")
      .select("id, title, work_date")
      .is("deleted_at", null)
      .ilike("title", like)
      .order("work_date", { ascending: false })
      .limit(5),
    supabase
      .from("goals")
      .select("id, title")
      .is("deleted_at", null)
      .ilike("title", like)
      .limit(5),
    supabase
      .from("notes")
      .select("id, title")
      .is("deleted_at", null)
      .ilike("title", like)
      .limit(5),
    supabase
      .from("earnings")
      .select("id, source, earned_on")
      .is("deleted_at", null)
      .ilike("source", like)
      .limit(5),
  ]);

  const results: SearchResult[] = [];

  for (const p of projects.data ?? []) {
    results.push({
      type: "project",
      id: p.id,
      title: p.name,
      href: `/projects/${p.id}`,
    });
  }
  for (const t of tasks.data ?? []) {
    results.push({
      type: "task",
      id: t.id,
      title: t.title,
      subtitle: t.work_date,
      href: `/tasks?date=${t.work_date}`,
    });
  }
  for (const g of goals.data ?? []) {
    results.push({ type: "goal", id: g.id, title: g.title, href: "/goals" });
  }
  for (const n of notes.data ?? []) {
    results.push({
      type: "note",
      id: n.id,
      title: n.title || "Untitled note",
      href: "/notes",
    });
  }
  for (const e of earnings.data ?? []) {
    results.push({
      type: "earning",
      id: e.id,
      title: e.source || "Income",
      subtitle: e.earned_on,
      href: "/earnings",
    });
  }

  return results;
}
