export interface DashboardStats {
  todayHours: number;
  weekHours: number;
  monthHours: number;
  lifetimeHours: number;
  avgPerDay: number;
  avgPerWeek: number;
  avgPerMonth: number;
  activeProjects: number;
  monthEarnings: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardData {
  currency: string;
  stats: DashboardStats;
  weeklyHours: ChartPoint[];
  monthlyRevenue: ChartPoint[];
}

import type { Enums } from "@/lib/supabase/types";

export interface FocusTask {
  id: string;
  title: string;
  priority: Enums<"priority">;
  status: Enums<"task_status">;
  projectName: string | null;
}

export interface DeadlineItem {
  title: string;
  date: string;
  kind: "project" | "task";
}

export interface DashboardOverview {
  greeting: string;
  firstName: string;
  todayTasks: FocusTask[];
  todayTotal: number;
  todayDone: number;
  streakDays: number;
  weekCompletedTasks: number;
  mostActiveProject: string | null;
  nextDeadline: DeadlineItem | null;
  upcomingDeadlines: DeadlineItem[];
  attentionCount: number;
}
