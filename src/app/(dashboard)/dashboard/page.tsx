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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InsightsCard,
  UpcomingDeadlines,
} from "@/features/dashboard/components/dashboard-insights";
import {
  HoursChart,
  RevenueChart,
} from "@/features/dashboard/components/lazy-charts";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { TodaysFocus } from "@/features/dashboard/components/todays-focus";
import { WelcomeHeader } from "@/features/dashboard/components/welcome-header";
import {
  getDashboardData,
  getDashboardOverview,
} from "@/features/dashboard/queries";
import { BusinessHealthCard } from "@/features/health/components/business-health-card";
import { getBusinessHealth } from "@/features/health/queries";
import { OnboardingChecklist } from "@/features/onboarding/components/onboarding-checklist";
import { getOnboardingProgress } from "@/features/onboarding/queries";
import { NextUpCard } from "@/features/priority/components/next-up-card";
import { getCommandCenter } from "@/features/priority/queries";
import { getCurrencySymbol } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const [
    { stats, weeklyHours, monthlyRevenue, currency },
    overview,
    setup,
    commandCenter,
    health,
  ] = await Promise.all([
    getDashboardData(),
    getDashboardOverview(),
    getOnboardingProgress(),
    getCommandCenter(),
    getBusinessHealth(),
  ]);
  const symbol = getCurrencySymbol(currency);
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <WelcomeHeader
        greeting={overview.greeting}
        firstName={overview.firstName}
        dateLabel={dateLabel}
        streakDays={overview.streakDays}
        attentionCount={overview.attentionCount}
      />

      <QuickActions />

      <OnboardingChecklist progress={setup} />

      <NextUpCard data={commandCenter} />

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodaysFocus
            tasks={overview.todayTasks}
            total={overview.todayTotal}
            done={overview.todayDone}
          />
        </div>
        <div className="flex flex-col gap-4">
          <BusinessHealthCard health={health} />
          <InsightsCard
            weekCompletedTasks={overview.weekCompletedTasks}
            weekHours={stats.weekHours}
            mostActiveProject={overview.mostActiveProject}
            nextDeadline={overview.nextDeadline}
          />
          <UpcomingDeadlines items={overview.upcomingDeadlines} />
        </div>
      </div>

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
