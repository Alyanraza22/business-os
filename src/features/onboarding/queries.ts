import "server-only";

import { getUser } from "@/features/auth/auth";
import { dayKey } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

export interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  href: string;
  done: boolean;
}

export interface OnboardingProgress {
  steps: OnboardingStep[];
  completed: number;
  total: number;
  percent: number;
  complete: boolean;
}

function build(
  flags: Record<string, boolean>,
): Omit<OnboardingProgress, "completed" | "total" | "percent" | "complete"> {
  return {
    steps: [
      {
        id: "project",
        label: "Create your first project",
        description: "Give everything you're building a home.",
        href: "/projects",
        done: flags.project ?? false,
      },
      {
        id: "deliverables",
        label: "Add deliverables to a project",
        description:
          "Progress is driven by completed deliverables — not guesswork.",
        href: "/projects",
        done: flags.deliverables ?? false,
      },
      {
        id: "plan",
        label: "Plan today's work",
        description: "Lay out your day in the Daily Planner.",
        href: "/tasks",
        done: flags.plan ?? false,
      },
      {
        id: "timer",
        label: "Start your first timer",
        description: "See where your hours actually go.",
        href: "/tasks",
        done: flags.timer ?? false,
      },
      {
        id: "complete",
        label: "Complete a task",
        description: "Check something off and build the streak.",
        href: "/tasks",
        done: flags.complete ?? false,
      },
      {
        id: "goal",
        label: "Set your first goal",
        description: "Turn intent into a measurable target.",
        href: "/goals",
        done: flags.goal ?? false,
      },
      {
        id: "earning",
        label: "Record your first earning",
        description: "Unlocks revenue trends and project profitability.",
        href: "/earnings",
        done: flags.earning ?? false,
      },
    ],
  };
}

/**
 * Activation checklist. Every step is derived from data the user already has —
 * no extra tables, no state to keep in sync.
 */
export async function getOnboardingProgress(): Promise<OnboardingProgress> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user) return finalize(build({}));

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();
  const todayKey = dayKey(new Date(), profile?.timezone ?? "UTC");

  const [projects, deliverables, planned, timers, completed, goals, earnings] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("project_tasks")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("work_date", todayKey)
        .is("deleted_at", null),
      supabase
        .from("time_logs")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .is("deleted_at", null),
      supabase
        .from("goals")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("earnings")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
    ]);

  const has = (result: { count: number | null }) => (result.count ?? 0) > 0;

  return finalize(
    build({
      project: has(projects),
      deliverables: has(deliverables),
      plan: has(planned),
      timer: has(timers),
      complete: has(completed),
      goal: has(goals),
      earning: has(earnings),
    }),
  );
}

function finalize(
  partial: Omit<
    OnboardingProgress,
    "completed" | "total" | "percent" | "complete"
  >,
): OnboardingProgress {
  const total = partial.steps.length;
  const completed = partial.steps.filter((step) => step.done).length;
  return {
    ...partial,
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    complete: completed === total,
  };
}
