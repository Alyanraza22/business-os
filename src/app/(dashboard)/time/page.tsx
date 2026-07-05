import type { Metadata } from "next";
import { CalendarDays, Clock, History, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
import { HoursChart } from "@/features/dashboard/components/hours-chart";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { ActiveTimerCard } from "@/features/time/components/active-timer-card";
import { SessionInsights } from "@/features/time/components/session-insights";
import { SessionsList } from "@/features/time/components/sessions-list";
import { TodaysTimeline } from "@/features/time/components/todays-timeline";
import {
  getActiveSession,
  getRecentSessions,
  getTimeInsights,
  getTimeStats,
} from "@/features/time/queries";

export const metadata: Metadata = {
  title: "Time Tracker",
  robots: { index: false, follow: false },
};

export default async function TimeTrackerPage() {
  const [stats, active, sessions, insights] = await Promise.all([
    getTimeStats(),
    getActiveSession(),
    getRecentSessions(),
    getTimeInsights(),
  ]);

  return (
    <div>
      <PageHeader
        title="Time Tracker"
        description="Your focus time across everything you track."
      />

      <div className="flex flex-col gap-6">
        <ActiveTimerCard session={active} />

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            label="Today"
            value={stats.today}
            decimals={1}
            suffix="h"
            icon={Clock}
          />
          <StatCard
            label="This Week"
            value={stats.week}
            decimals={1}
            suffix="h"
            icon={CalendarDays}
          />
          <StatCard
            label="This Month"
            value={stats.month}
            decimals={1}
            suffix="h"
            icon={TrendingUp}
          />
          <StatCard
            label="Lifetime"
            value={stats.lifetime}
            decimals={1}
            suffix="h"
            icon={History}
          />
        </div>

        <TodaysTimeline blocks={insights.todaysSessions} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>This week</CardTitle>
            </CardHeader>
            <CardContent>
              <HoursChart
                data={insights.weekly}
                emptyMessage="No time tracked in the last 7 days."
              />
            </CardContent>
          </Card>
          <SessionInsights
            longestSeconds={insights.longestSeconds}
            averageSeconds={insights.averageSeconds}
            sessionCount={insights.sessionCount}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Heading size="h4">Recent sessions</Heading>
          <SessionsList sessions={sessions} />
        </div>
      </div>
    </div>
  );
}
