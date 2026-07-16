import { differenceInCalendarDays, parseISO } from "date-fns";

import type { Enums } from "@/lib/supabase/types";

export interface PriorityTaskInput {
  id: string;
  title: string;
  priority: Enums<"priority">;
  status: Enums<"task_status">;
  /** Planner date (yyyy-MM-dd). */
  workDate: string;
  dueDate: string | null;
  estimatedHours: number | null;
  projectName: string | null;
  projectDeadline: string | null;
  projectPriority: Enums<"priority"> | null;
}

export interface ScoredTask extends PriorityTaskInput {
  score: number;
  /** Human-readable justification — the dashboard always explains itself. */
  reasons: string[];
}

const TASK_PRIORITY_WEIGHT: Record<Enums<"priority">, number> = {
  urgent: 30,
  high: 20,
  medium: 10,
  low: 0,
};

const PROJECT_PRIORITY_WEIGHT: Record<Enums<"priority">, number> = {
  urgent: 10,
  high: 6,
  medium: 3,
  low: 0,
};

/**
 * Rule-based priority score for a single task.
 *
 * Deterministic and transparent by design: every contribution that materially
 * changes the ranking also pushes a reason string, so the UI can justify the
 * recommendation rather than showing an opaque number. Pure function — no I/O,
 * no clock access (today is injected) — which keeps it testable.
 */
export function scoreTask(
  task: PriorityTaskInput,
  todayKey: string,
): ScoredTask {
  const today = parseISO(todayKey);
  const reasons: string[] = [];
  let score = 0;

  // Carried over from an earlier day — the strongest everyday signal.
  const daysLate = differenceInCalendarDays(today, parseISO(task.workDate));
  if (daysLate > 0) {
    score += 30 + Math.min(daysLate * 3, 20);
    reasons.push(
      daysLate === 1 ? "Carried over from yesterday" : `${daysLate} days late`,
    );
  }

  // Hard due date.
  if (task.dueDate) {
    const days = differenceInCalendarDays(parseISO(task.dueDate), today);
    if (days < 0) {
      score += 40;
      reasons.push(`Overdue by ${Math.abs(days)}d`);
    } else if (days === 0) {
      score += 25;
      reasons.push("Due today");
    } else if (days <= 2) {
      score += 15;
      reasons.push(`Due in ${days}d`);
    } else if (days <= 7) {
      score += 5;
    }
  }

  // Explicit priority.
  score += TASK_PRIORITY_WEIGHT[task.priority];
  if (task.priority === "urgent") reasons.push("Urgent");
  else if (task.priority === "high") reasons.push("High priority");

  // Finish what you started.
  if (task.status === "in_progress") {
    score += 15;
    reasons.push("Already in progress");
  }

  // Business impact: pressure from the parent project.
  if (task.projectDeadline) {
    const days = differenceInCalendarDays(
      parseISO(task.projectDeadline),
      today,
    );
    const project = task.projectName ?? "Project";
    if (days < 0) {
      score += 20;
      reasons.push(`${project} is past deadline`);
    } else if (days <= 3) {
      score += 12;
      reasons.push(`${project} due in ${days}d`);
    } else if (days <= 7) {
      score += 6;
    }
  }
  if (task.projectPriority) {
    score += PROJECT_PRIORITY_WEIGHT[task.projectPriority];
  }

  // Quick win — cheap to clear, keeps momentum.
  if (
    task.estimatedHours !== null &&
    task.estimatedHours > 0 &&
    task.estimatedHours <= 1
  ) {
    score += 5;
    reasons.push("Quick win");
  }

  return { ...task, score, reasons };
}

/** Rank tasks highest-value first. */
export function rankTasks(
  tasks: PriorityTaskInput[],
  todayKey: string,
): ScoredTask[] {
  return tasks
    .map((task) => scoreTask(task, todayKey))
    .sort((a, b) => b.score - a.score);
}
