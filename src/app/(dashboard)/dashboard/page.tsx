import type { Metadata } from "next";
import {
  CalendarDays,
  Clock,
  FolderKanban,
  Gauge,
  History,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoursChart } from "@/features/dashboard/components/hours-chart";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { getDashboardData } from "@/features/dashboard/queries";
import { getCurrencySymbol } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const { stats, weeklyHours, monthlyRevenue, currency } =
    await getDashboardData();
  const symbol = getCurrencySymbol(currency);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="An overview of your work today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's Hours"
          value={stats.todayHours}
          decimals={1}
          suffix="h"
          icon={Clock}
        />
        <StatCard
          label="This Week"
          value={stats.weekHours}
          decimals={1}
          suffix="h"
          icon={CalendarDays}
        />
        <StatCard
          label="Active Projects"
          value={stats.activeProjects}
          icon={FolderKanban}
        />
        <StatCard
          label="This Month"
          value={stats.monthEarnings}
          prefix={symbol}
          icon={Wallet}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Lifetime Hours"
          value={stats.lifetimeHours}
          decimals={1}
          suffix="h"
          icon={History}
        />
        <StatCard
          label="Avg / Day"
          value={stats.avgPerDay}
          decimals={1}
          suffix="h"
          icon={Gauge}
        />
        <StatCard
          label="Avg / Week"
          value={stats.avgPerWeek}
          decimals={1}
          suffix="h"
          icon={TrendingUp}
        />
        <StatCard
          label="Avg / Month"
          value={stats.avgPerMonth}
          decimals={1}
          suffix="h"
          icon={CalendarDays}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hours this week</CardTitle>
          </CardHeader>
          <CardContent>
            <HoursChart data={weeklyHours} />
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
