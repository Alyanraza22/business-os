"use client";

import { FolderKanban, Plus } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import type { ProjectWithMetrics } from "@/features/projects/queries";

import { deleteProject } from "../actions";
import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";

interface ProjectsGridProps {
  projects: ProjectWithMetrics[];
  filtered: boolean;
}

export function ProjectsGrid({ projects, filtered }: ProjectsGridProps) {
  const [optimistic, removeOptimistic] = useOptimistic(
    projects,
    (state, removedId: string) => state.filter((p) => p.id !== removedId),
  );
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      // Instantly remove; if the server rejects, the base list re-syncs and
      // the card reappears with an error toast.
      removeOptimistic(id);
      const result = await deleteProject(id);
      if (result.ok) toast.success("Project deleted");
      else toast.error(result.message ?? "Failed to delete project");
    });
  }

  if (optimistic.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title={filtered ? "No matching projects" : "No projects yet"}
        description={
          filtered
            ? "Try adjusting your search or status filter."
            : "Projects are home base for everything you're building. Create one to group deliverables, track real progress, and see where your time goes."
        }
        action={
          filtered ? undefined : (
            <ProjectDialog
              trigger={
                <Button>
                  <Plus />
                  New project
                </Button>
              }
            />
          )
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {optimistic.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
