import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/typography";
import { getProjectTasks } from "@/features/project-tasks/queries";
import { getProjectById, getProjectHours } from "@/features/projects/queries";
import { PRIORITY_META } from "@/features/shared/constants";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, tasks, hours] = await Promise.all([
    getProjectById(id),
    getProjectTasks(id),
    getProjectHours(id),
  ]);
  if (!project) {
    notFound();
  }

  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;

  const timeStats = [
    { label: "Total", value: hours.total },
    { label: "Today", value: hours.today },
    { label: "This week", value: hours.week },
    { label: "This month", value: hours.month },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Text variant="muted">
              {project.description || "No description yet."}
            </Text>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Priority</dt>
                <dd className="mt-0.5 font-medium">
                  {PRIORITY_META[project.priority].label}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Deadline</dt>
                <dd className="mt-0.5 font-medium">
                  {project.deadline ? formatDate(project.deadline) : "—"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <span className="text-3xl font-semibold tracking-tight">
              {project.progress}%
            </span>
            <Progress value={project.progress} />
            <Text variant="muted">
              {completed} of {total} deliverables completed
            </Text>
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link href={`/projects/${project.id}/tasks`}>
                Manage deliverables
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time tracked</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {timeStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-2xl font-semibold tabular-nums">
                {stat.value}h
              </span>
              <span className="text-muted-foreground text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
