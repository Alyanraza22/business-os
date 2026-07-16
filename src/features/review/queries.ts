import "server-only";

import {
  getDashboardData,
  getDashboardOverview,
} from "@/features/dashboard/queries";
import { getEarningsSummary } from "@/features/earnings/queries";
import {
  getBusinessHealth,
  type BusinessHealth,
} from "@/features/health/queries";
import { getCommandCenter } from "@/features/priority/queries";
import { getProjectProfitability } from "@/features/profitability/queries";
import { getTimeInsights } from "@/features/time/queries";

export interface DailyReview {
  completed: number;
  planned: number;
  missed: number;
  hours: number;
  carriedOver: number;
  topProject: string | null;
  suggestions: string[];
}

export interface WeeklyReview {
  hours: number;
  revenue: number;
  currency: string;
  completedTasks: number;
  topProject: string | null;
  bestPaying: { name: string; rate: number } | null;
  worstPaying: { name: string; rate: number } | null;
  deepWorkShare: number;
  contextSwitches: number;
  health: BusinessHealth;
  priorities: string[];
}

export interface ReviewData {
  daily: DailyReview;
  weekly: WeeklyReview;
}

/**
 * Daily and weekly reviews, composed entirely from queries that already exist.
 * Rule-based rather than generative — the data is right here, so it needs no
 * model to summarize it.
 */
export async function getReviewData(): Promise<ReviewData> {
  const [dashboard, overview, command, time, earnings, profitability, health] =
    await Promise.all([
      getDashboardData(),
      getDashboardOverview(),
      getCommandCenter(),
      getTimeInsights(),
      getEarningsSummary(),
      getProjectProfitability(),
      getBusinessHealth(),
    ]);

  const missed = Math.max(0, overview.todayTotal - overview.todayDone);

  // Daily suggestions — concrete, drawn from what actually happened today.
  const suggestions: string[] = [];
  if (command.overdue.length > 0) {
    suggestions.push(
      `Carry over ${command.overdue.length} unfinished ${
        command.overdue.length === 1 ? "task" : "tasks"
      } so they don't slip further.`,
    );
  }
  if (missed > 0) {
    suggestions.push(
      `${missed} of today's ${overview.todayTotal} tasks are still open — move them to tomorrow or drop them.`,
    );
  }
  if (dashboard.stats.todayHours === 0) {
    suggestions.push(
      "No time tracked today — start a timer to see where it goes.",
    );
  } else if (time.deepWorkShare < 50 && time.fragmentedSessions > 0) {
    suggestions.push(
      `${time.fragmentedSessions} sessions ran under 5 minutes. Try one longer block tomorrow.`,
    );
  }
  if (command.nextTask) {
    suggestions.push(`Start tomorrow with "${command.nextTask.title}".`);
  }
  if (suggestions.length === 0) {
    suggestions.push("Clean day — everything planned got done.");
  }

  const rated = profitability.projects.filter(
    (project) => project.effectiveHourly !== null,
  );
  const bestPaying = rated[0]
    ? { name: rated[0].name, rate: rated[0].effectiveHourly as number }
    : null;
  const worst = rated.at(-1);
  const worstPaying =
    worst && rated.length > 1
      ? { name: worst.name, rate: worst.effectiveHourly as number }
      : null;

  // Next week's priorities — the engine's own top picks.
  const priorities = [command.nextTask, ...command.overdue]
    .filter((task): task is NonNullable<typeof task> => Boolean(task))
    .filter(
      (task, index, all) => all.findIndex((t) => t.id === task.id) === index,
    )
    .slice(0, 3)
    .map((task) => task.title);

  return {
    daily: {
      completed: overview.todayDone,
      planned: overview.todayTotal,
      missed,
      hours: dashboard.stats.todayHours,
      carriedOver: command.overdue.length,
      topProject: overview.mostActiveProject,
      suggestions,
    },
    weekly: {
      hours: dashboard.stats.weekHours,
      revenue: earnings.week,
      currency: earnings.currency,
      completedTasks: overview.weekCompletedTasks,
      topProject: overview.mostActiveProject,
      bestPaying,
      worstPaying,
      deepWorkShare: time.deepWorkShare,
      contextSwitches: time.contextSwitches,
      health,
      priorities,
    },
  };
}
