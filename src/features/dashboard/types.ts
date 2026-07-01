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
