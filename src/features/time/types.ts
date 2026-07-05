export interface ActiveSession {
  id: string;
  taskId: string | null;
  taskTitle: string | null;
  projectName: string | null;
  projectColor: string | null;
  startedAt: string;
}

export interface TimeSession {
  id: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  taskTitle: string | null;
  projectName: string | null;
  projectColor: string | null;
}

export interface TimeStats {
  today: number;
  week: number;
  month: number;
  lifetime: number;
}

/** A completed session positioned across today's 24-hour track (0–100%). */
export interface TimelineBlock {
  startPct: number;
  endPct: number;
  title: string | null;
  color: string | null;
}

export interface TimeInsights {
  longestSeconds: number;
  averageSeconds: number;
  sessionCount: number;
  weekly: { label: string; value: number }[];
  todaysSessions: TimelineBlock[];
}
