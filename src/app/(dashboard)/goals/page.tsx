import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { GoalsGrid } from "@/features/goals/components/goals-grid";
import { GoalsToolbar } from "@/features/goals/components/goals-toolbar";
import { getGoals } from "@/features/goals/queries";

export const metadata: Metadata = {
  title: "Goals",
  robots: { index: false, follow: false },
};

interface GoalsPageProps {
  searchParams: Promise<{ type?: string; status?: string; q?: string }>;
}

export default async function GoalsPage({ searchParams }: GoalsPageProps) {
  const { type, status, q } = await searchParams;
  const goals = await getGoals({ type, status, q });
  const filtered = Boolean(type || status || q);

  return (
    <div>
      <PageHeader
        title="Goals"
        description="Set daily, weekly, monthly and yearly targets."
      />
      <GoalsToolbar />
      <GoalsGrid goals={goals} filtered={filtered} />
    </div>
  );
}
