import { ListChecks, Plus } from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProjectTask } from "@/lib/supabase/types";

import { ProjectTaskDialog } from "./project-task-dialog";
import { ProjectTaskRow } from "./project-task-row";

interface ProjectTasksListProps {
  projectId: string;
  tasks: ProjectTask[];
}

export function ProjectTasksList({ projectId, tasks }: ProjectTasksListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No deliverables yet"
        description="Break this project into deliverables. Completing them drives project progress."
        action={
          <ProjectTaskDialog
            projectId={projectId}
            trigger={
              <Button>
                <Plus />
                New deliverable
              </Button>
            }
          />
        }
      />
    );
  }

  return (
    <Card className="divide-border divide-y overflow-hidden">
      {tasks.map((task) => (
        <ProjectTaskRow key={task.id} task={task} />
      ))}
    </Card>
  );
}
