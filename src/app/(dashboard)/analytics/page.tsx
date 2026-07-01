import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Productivity trends across hours, tasks and revenue."
      />
      <ComingSoon label="Analytics" />
    </div>
  );
}
