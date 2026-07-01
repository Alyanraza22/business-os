import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ProjectsGrid } from "@/features/projects/components/projects-grid";
import { ProjectsToolbar } from "@/features/projects/components/projects-toolbar";
import { getProjects } from "@/features/projects/queries";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

interface ProjectsPageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { status, q } = await searchParams;
  const projects = await getProjects({ status, q });
  const filtered = Boolean(status || q);

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Plan and track everything you're working on."
      />
      <ProjectsToolbar />
      <ProjectsGrid projects={projects} filtered={filtered} />
    </div>
  );
}
