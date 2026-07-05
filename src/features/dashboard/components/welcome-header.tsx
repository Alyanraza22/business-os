import { AlertTriangle, Flame } from "lucide-react";

interface WelcomeHeaderProps {
  greeting: string;
  firstName: string;
  dateLabel: string;
  streakDays: number;
  attentionCount: number;
}

/** Personal greeting + at-a-glance status chips for the dashboard. */
export function WelcomeHeader({
  greeting,
  firstName,
  dateLabel,
  streakDays,
  attentionCount,
}: WelcomeHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {greeting}, {firstName} <span aria-hidden>👋</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          {dateLabel} · Here&apos;s your overview
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {streakDays > 0 ? (
          <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <Flame className="size-3.5" />
            {streakDays}-day streak
          </span>
        ) : null}
        {attentionCount > 0 ? (
          <span className="bg-warning/10 text-warning inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <AlertTriangle className="size-3.5" />
            {attentionCount}{" "}
            {attentionCount === 1 ? "project needs" : "projects need"} attention
          </span>
        ) : null}
      </div>
    </div>
  );
}
