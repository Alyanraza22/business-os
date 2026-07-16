import { differenceInCalendarDays, parseISO } from "date-fns";
import { CalendarDays, Clock, ListChecks, Plus } from "lucide-react";
import Link from "next/link";
import { createElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/typography";
import type { ProjectWithMetrics } from "@/features/projects/queries";

import {
  getProjectIcon,
  PRIORITY_META,
  PROJECT_STATUS_META,
} from "../constants";
import { ProjectCardActions } from "./project-card-actions";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function relativePast(iso: string): string {
  const days = differenceInCalendarDays(new Date(), parseISO(iso));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function ProjectCard({
  project,
  onDelete,
}: {
  project: ProjectWithMetrics;
  onDelete?: (id: string) => void;
}) {
  const status = PROJECT_STATUS_META[project.status];
  const priority = PRIORITY_META[project.priority];
  const tasksRemaining = Math.max(
    0,
    project.tasksTotal - project.tasksCompleted,
  );

  return (
    <Card className="group hover-lift hover:border-primary/40 relative flex flex-col gap-4 overflow-hidden p-5 hover:shadow-sm">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ backgroundColor: project.color }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: `${project.color}1a`,
              color: project.color,
            }}
          >
            {createElement(getProjectIcon(project.icon), {
              className: "size-5",
            })}
          </span>
          <div className="flex min-w-0 flex-col">
            <Link
              href={`/projects/${project.id}`}
              className="truncate leading-tight font-semibold tracking-tight outline-none hover:underline focus-visible:underline"
            >
              {project.name}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant={status.badge}>{status.label}</Badge>
              <Badge variant={priority.badge}>{priority.label}</Badge>
            </div>
          </div>
        </div>
        <ProjectCardActions project={project} onDelete={onDelete} />
      </div>

      {project.description ? (
        <Text variant="muted" className="line-clamp-2">
          {project.description}
        </Text>
      ) : null}

      <div className="mt-auto flex flex-col gap-2.5">
        {project.tasksTotal === 0 ? (
          // Progress is deliverable-driven, so 0% is meaningless without any.
          // Point the user at the action that actually unlocks it.
          <Link
            href={`/projects/${project.id}/tasks`}
            className="border-primary/30 text-primary hover:bg-primary/10 flex items-center justify-center gap-1.5 rounded-md border border-dashed px-3 py-2 text-xs font-medium transition-colors"
          >
            <Plus className="size-3.5" />
            Add deliverables to track progress
          </Link>
        ) : (
          <>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>Progress</span>
              <span className="tabular-nums">
                {project.tasksCompleted}/{project.tasksTotal} deliverables ·{" "}
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} />
          </>
        )}

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {project.tasksTotal > 0 ? (
            <span
              className="flex items-center gap-1"
              title="Deliverables done / remaining"
            >
              <ListChecks className="size-3.5" />
              {project.tasksCompleted} done
              {tasksRemaining > 0 ? ` · ${tasksRemaining} left` : ""}
            </span>
          ) : null}
          <span className="flex items-center gap-1" title="Time tracked">
            <Clock className="size-3.5" />
            {project.hoursSpent}h
          </span>
          {project.deadline ? (
            <span className="flex items-center gap-1" title="Deadline">
              <CalendarDays className="size-3.5" />
              {formatDate(project.deadline)}
            </span>
          ) : null}
          <span className="ml-auto shrink-0">
            Updated {relativePast(project.lastActivity)}
          </span>
        </div>
      </div>
    </Card>
  );
}
