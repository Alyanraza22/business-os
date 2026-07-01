import type { Metadata } from "next";
import { CalendarDays, Clock, History, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Heading } from "@/components/ui/typography";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { ActiveTimerCard } from "@/features/time/components/active-timer-card";
import { SessionsList } from "@/features/time/components/sessions-list";
import {
  getActiveSession,
  getRecentSessions,
  getTimeStats,
} from "@/features/time/queries";

export const metadata: Metadata = {
  title: "Time Tracker",
  robots: { index: false, follow: false },
};

export default async function TimeTrackerPage() {
  const [stats, active, sessions] = await Promise.all([
    getTimeStats(),
    getActiveSession(),
    getRecentSessions(),
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

        <div className="flex flex-col gap-3">
          <Heading size="h4">Recent sessions</Heading>
          <SessionsList sessions={sessions} />
        </div>
      </div>
    </div>
  );
}
