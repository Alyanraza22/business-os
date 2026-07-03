import type { Metadata } from "next";
import {
  BarChart3,
  CheckSquare,
  Clock,
  ListChecks,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
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

  const hasData =
    stats.lifetimeHours > 0 ||
    stats.tasksCompleted > 0 ||
    stats.deliverablesCompleted > 0 ||
    stats.totalRevenue > 0;

  if (!hasData) {
    return (
      <div>
        <PageHeader
          title="Analytics"
          description="Productivity trends across hours, tasks and revenue."
        />
        <EmptyState
          icon={BarChart3}
          title="Your insights will appear here"
          description="Analytics turns the work you track into trends — hours over time, time by project, and revenue by month. Track a task or log some time to see your first chart come to life."
          action={
            <Button asChild>
              <Link href="/tasks">Go to Daily Planner</Link>
            </Button>
          }
        />
      </div>
    );
  }

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
