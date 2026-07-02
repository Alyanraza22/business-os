import type { Metadata } from "next";
import { CheckSquare, Clock, ListChecks, Wallet } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoursChart } from "@/features/dashboard/components/hours-chart";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { getAnalyticsData } from "@/features/analytics/queries";
import { getCurrencySymbol } from "@/lib/format";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage() {
  const { stats, dailyHours, hoursByProject, monthlyRevenue, currency } =
    await getAnalyticsData();
  const symbol = getCurrencySymbol(currency);

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Productivity trends across hours, tasks and revenue."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Lifetime Hours"
          value={stats.lifetimeHours}
          decimals={1}
          suffix="h"
          icon={Clock}
        />
        <StatCard
          label="Tasks Completed"
          value={stats.tasksCompleted}
          icon={CheckSquare}
        />
        <StatCard
          label="Deliverables Done"
          value={stats.deliverablesCompleted}
          icon={ListChecks}
        />
        <StatCard
          label="Total Revenue"
          value={stats.totalRevenue}
          prefix={symbol}
          icon={Wallet}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hours (last 14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <HoursChart
              data={dailyHours}
              emptyMessage="No hours tracked in the last 14 days."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hours by project</CardTitle>
          </CardHeader>
          <CardContent>
            <HoursChart
              data={hoursByProject}
              emptyMessage="No project time tracked yet."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={monthlyRevenue} currency={currency} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
