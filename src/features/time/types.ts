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
  /** Hours this week spent in uninterrupted sessions of 25 minutes or more. */
  deepWorkHours: number;
  /** Share of this week's tracked time that qualifies as deep work (0–100). */
  deepWorkShare: number;
  /** Times this week the active project changed between consecutive sessions. */
  contextSwitches: number;
  /** Sessions under 5 minutes this week — a proxy for fragmented attention. */
  fragmentedSessions: number;
}
