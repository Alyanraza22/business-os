import { FolderKanban, Plus } from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/supabase/types";

import { ProjectCard } from "./project-card";
import { ProjectDialog } from "./project-dialog";

interface ProjectsGridProps {
  projects: Project[];
  filtered: boolean;
}

export function ProjectsGrid({ projects, filtered }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title={filtered ? "No matching projects" : "No projects yet"}
        description={
          filtered
            ? "Try adjusting your search or status filter."
            : "Create your first project to start organizing your work."
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
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
