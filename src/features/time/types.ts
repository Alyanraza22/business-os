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
