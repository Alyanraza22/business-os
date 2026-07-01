import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { createElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/typography";
import type { Project } from "@/lib/supabase/types";

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

export function ProjectCard({ project }: { project: Project }) {
  const status = PROJECT_STATUS_META[project.status];
  const priority = PRIORITY_META[project.priority];

  return (
    <Card className="group hover:border-primary/40 relative flex flex-col gap-4 overflow-hidden p-5 transition-[border-color,box-shadow] duration-200 hover:shadow-md">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
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
              className="truncate leading-tight font-semibold outline-none hover:underline focus-visible:underline"
            >
              {project.name}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant={status.badge}>{status.label}</Badge>
              <Badge variant={priority.badge}>{priority.label}</Badge>
            </div>
          </div>
        </div>
        <ProjectCardActions project={project} />
      </div>

      {project.description ? (
        <Text variant="muted" className="line-clamp-2">
          {project.description}
        </Text>
      ) : null}

      <div className="mt-auto flex flex-col gap-2">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <Progress value={project.progress} />
        {project.deadline ? (
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <CalendarDays className="size-3.5" />
            {formatDate(project.deadline)}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
