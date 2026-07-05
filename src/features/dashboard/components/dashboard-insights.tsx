import { differenceInCalendarDays, parseISO } from "date-fns";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FolderKanban,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DeadlineItem } from "../types";

function relativeDay(date: string): string {
  const days = differenceInCalendarDays(parseISO(date), new Date());
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

interface InsightsCardProps {
  weekCompletedTasks: number;
  weekHours: number;
  mostActiveProject: string | null;
  nextDeadline: DeadlineItem | null;
}

/** Plain-language summary of the week — the "so what" behind the numbers. */
export function InsightsCard({
  weekCompletedTasks,
  weekHours,
  mostActiveProject,
  nextDeadline,
}: InsightsCardProps) {
  const insights: { icon: LucideIcon; node: ReactNode }[] = [
    {
      icon: CheckCircle2,
      node: (
        <>
          You completed{" "}
          <strong className="text-foreground font-medium">
            {weekCompletedTasks}
          </strong>{" "}
          {weekCompletedTasks === 1 ? "task" : "tasks"} this week.
        </>
      ),
    },
    {
      icon: Clock,
      node: (
        <>
          You worked{" "}
          <strong className="text-foreground font-medium">{weekHours}h</strong>{" "}
          this week.
        </>
      ),
    },
  ];

  if (mostActiveProject) {
    insights.push({
      icon: FolderKanban,
      node: (
        <>
          Most active project is{" "}
          <strong className="text-foreground font-medium">
            {mostActiveProject}
          </strong>
          .
        </>
      ),
    });
  }

  if (nextDeadline) {
    insights.push({
      icon: CalendarClock,
      node: (
        <>
          Next deadline is{" "}
          <strong className="text-foreground font-medium">
            {nextDeadline.title}
          </strong>{" "}
          — {relativeDay(nextDeadline.date).toLowerCase()}.
        </>
      ),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>This week</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-3">
              <insight.icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <span className="text-muted-foreground text-sm leading-relaxed">
                {insight.node}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/** Nearest upcoming project and task deadlines. */
export function UpcomingDeadlines({ items }: { items: DeadlineItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nothing due soon. You&apos;re all caught up.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item, index) => {
              const Icon = item.kind === "project" ? FolderKanban : ListChecks;
              const overdue =
                differenceInCalendarDays(parseISO(item.date), new Date()) < 0;
              return (
                <li key={index} className="flex items-center gap-3">
                  <Icon className="text-muted-foreground size-4 shrink-0" />
                  <span className="text-foreground min-w-0 flex-1 truncate text-sm">
                    {item.title}
                  </span>
                  <span
                    className={
                      overdue
                        ? "text-destructive shrink-0 text-xs font-medium"
                        : "text-muted-foreground shrink-0 text-xs"
                    }
                  >
                    {relativeDay(item.date)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
