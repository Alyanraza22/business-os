import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { PlannerActions } from "@/features/tasks/components/planner-actions";
import { WorksheetDateNav } from "@/features/tasks/components/worksheet-date-nav";
import { WorksheetTable } from "@/features/tasks/components/worksheet-table";
import { WorksheetToolbar } from "@/features/tasks/components/worksheet-toolbar";
import {
  getProjectOptions,
  getProjectTaskOptions,
  getRunningTimer,
  getTodayDate,
  getWorksheetTasks,
  WORKSHEET_PAGE_SIZE,
} from "@/features/tasks/queries";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daily Planner",
  robots: { index: false, follow: false },
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type SearchParams = Record<string, string | string[] | undefined>;

function buildHref(params: SearchParams, page: number) {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") next.set(key, value);
  }
  next.set("page", String(page));
  return `/tasks?${next.toString()}`;
}

export default async function DailyPlannerPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const today = await getTodayDate();
  const date =
    typeof params.date === "string" && DATE_RE.test(params.date)
      ? params.date
      : today;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const stringParam = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : undefined;

  const [{ tasks, total }, projects, projectTasks, runningTimer] =
    await Promise.all([
      getWorksheetTasks({
        date,
        page,
        projectId: stringParam("project"),
        status: stringParam("status"),
        priority: stringParam("priority"),
        q: stringParam("q"),
        sort: stringParam("sort"),
      }),
      getProjectOptions(),
      getProjectTaskOptions(),
      getRunningTimer(),
    ]);

  const totalPages = Math.max(1, Math.ceil(total / WORKSHEET_PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Daily Planner"
        description="Your day, one sheet at a time."
      />
      <WorksheetDateNav date={date} />
      <div className="mb-3">
        <PlannerActions date={date} />
      </div>
      <WorksheetToolbar projects={projects} />
      <WorksheetTable
        tasks={tasks}
        projects={projects}
        projectTasks={projectTasks}
        runningTimer={runningTimer}
        date={date}
        defaultProjectId={stringParam("project") ?? ""}
      />

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-between">
          <Text variant="small">
            Page {page} of {totalPages} · {total} tasks
          </Text>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={buildHref(params, page - 1)}>Previous</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
            )}
            {page < totalPages ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={buildHref(params, page + 1)}>Next</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
