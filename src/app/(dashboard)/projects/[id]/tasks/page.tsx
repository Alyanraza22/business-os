import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { ProjectTaskDialog } from "@/features/project-tasks/components/project-task-dialog";
import { ProjectTasksList } from "@/features/project-tasks/components/project-tasks-list";
import { getProjectTasks } from "@/features/project-tasks/queries";

export default async function ProjectTasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tasks = await getProjectTasks(id);
  const completed = tasks.filter((task) => task.status === "completed").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Heading size="h4">Deliverables</Heading>
          <Text variant="muted">
            {completed}/{tasks.length} completed — completing these updates
            project progress.
          </Text>
        </div>
        <ProjectTaskDialog
          projectId={id}
          trigger={
            <Button>
              <Plus />
              New deliverable
            </Button>
          }
        />
      </div>
      <ProjectTasksList projectId={id} tasks={tasks} />
    </div>
  );
}
