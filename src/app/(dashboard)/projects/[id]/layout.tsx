import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createElement, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heading } from "@/components/ui/typography";
import {
  getProjectIcon,
  PROJECT_STATUS_META,
} from "@/features/projects/constants";
import { getProjectById } from "@/features/projects/queries";

import { ProjectTabs } from "./project-tabs";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  return {
    title: project?.name ?? "Project",
    robots: { index: false, follow: false },
  };
}

export default async function ProjectLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) {
    notFound();
  }

  const status = PROJECT_STATUS_META[project.status];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="size-4" />
          Projects
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${project.color}1a`,
                color: project.color,
              }}
            >
              {createElement(getProjectIcon(project.icon), {
                className: "size-6",
              })}
            </span>
            <div className="flex flex-col gap-1">
              <Heading size="h2">{project.name}</Heading>
              <Badge variant={status.badge} className="w-fit">
                {status.label}
              </Badge>
            </div>
          </div>

          <div className="flex w-full max-w-xs flex-col gap-1.5 sm:w-56">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
        </div>

        <ProjectTabs projectId={project.id} />
      </div>

      {children}
    </div>
  );
}
