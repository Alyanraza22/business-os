import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getUserSettings } from "@/lib/user-settings";

export interface ProjectProfitability {
  id: string;
  name: string;
  color: string;
  revenue: number;
  hours: number;
  /** Revenue ÷ hours. Null when either side is missing. */
  effectiveHourly: number | null;
}

export interface ProfitabilityReport {
  projects: ProjectProfitability[];
  currency: string;
  totalRevenue: number;
  totalHours: number;
  /** Blended rate across everything tracked. */
  overallHourly: number | null;
  /** Revenue that isn't attributed to any project yet. */
  unassignedRevenue: number;
}

const EMPTY: ProfitabilityReport = {
  projects: [],
  currency: "USD",
  totalRevenue: 0,
  totalHours: 0,
  overallHourly: null,
  unassignedRevenue: 0,
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Per-project profitability: what each project earned versus the hours it
 * consumed, and the effective hourly rate that falls out of it.
 *
 * Needs no schema changes — earnings already carry a project_id and time_logs
 * already carry hours, so this is purely a matter of joining what's there.
 */
export async function getProjectProfitability(): Promise<ProfitabilityReport> {
  const supabase = await createClient();
  const { currency } = await getUserSettings();

  const [projectsRes, earningsRes, logsRes] = await Promise.all([
    supabase.from("projects").select("id, name, color").is("deleted_at", null),
    supabase
      .from("earnings")
      .select("project_id, amount")
      .is("deleted_at", null),
    supabase
      .from("time_logs")
      .select("project_id, duration_seconds")
      .not("ended_at", "is", null)
      .is("deleted_at", null),
  ]);

  const projects = projectsRes.data ?? [];
  if (projects.length === 0) return { ...EMPTY, currency };

  const revenueByProject = new Map<string, number>();
  let totalRevenue = 0;
  let unassignedRevenue = 0;
  for (const entry of earningsRes.data ?? []) {
    const amount = Number(entry.amount);
    totalRevenue += amount;
    if (!entry.project_id) {
      unassignedRevenue += amount;
      continue;
    }
    revenueByProject.set(
      entry.project_id,
      (revenueByProject.get(entry.project_id) ?? 0) + amount,
    );
  }

  const secondsByProject = new Map<string, number>();
  let totalSeconds = 0;
  for (const log of logsRes.data ?? []) {
    const seconds = log.duration_seconds ?? 0;
    if (seconds <= 0) continue;
    totalSeconds += seconds;
    if (!log.project_id) continue;
    secondsByProject.set(
      log.project_id,
      (secondsByProject.get(log.project_id) ?? 0) + seconds,
    );
  }

  const rows: ProjectProfitability[] = projects
    .map((project) => {
      const revenue = round2(revenueByProject.get(project.id) ?? 0);
      const hours =
        Math.round((secondsByProject.get(project.id) ?? 0) / 360) / 10;
      return {
        id: project.id,
        name: project.name,
        color: project.color,
        revenue,
        hours,
        effectiveHourly:
          revenue > 0 && hours > 0 ? round2(revenue / hours) : null,
      };
    })
    // Only projects that actually have money or time attached are meaningful.
    .filter((row) => row.revenue > 0 || row.hours > 0)
    .sort((a, b) => {
      // Best rate first; projects without a rate sink to the bottom.
      if (a.effectiveHourly === null && b.effectiveHourly === null) {
        return b.hours - a.hours;
      }
      if (a.effectiveHourly === null) return 1;
      if (b.effectiveHourly === null) return -1;
      return b.effectiveHourly - a.effectiveHourly;
    });

  const totalHours = Math.round(totalSeconds / 360) / 10;

  return {
    projects: rows,
    currency,
    totalRevenue: round2(totalRevenue),
    totalHours,
    overallHourly:
      totalRevenue > 0 && totalHours > 0
        ? round2(totalRevenue / totalHours)
        : null,
    unassignedRevenue: round2(unassignedRevenue),
  };
}
