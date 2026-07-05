import type { Metadata } from "next";
import { CalendarDays, CalendarRange, Coins, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/features/dashboard/components/lazy-charts";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { EarningsBreakdown } from "@/features/earnings/components/earnings-breakdown";
import { EarningsList } from "@/features/earnings/components/earnings-list";
import { EarningsToolbar } from "@/features/earnings/components/earnings-toolbar";
import {
  getEarnings,
  getEarningsInsights,
  getEarningsSummary,
} from "@/features/earnings/queries";
import { getCurrencySymbol } from "@/lib/format";

export const metadata: Metadata = {
  title: "Earnings",
  robots: { index: false, follow: false },
};

interface EarningsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function EarningsPage({
  searchParams,
}: EarningsPageProps) {
  const { category, q } = await searchParams;
  const [earnings, summary, insights] = await Promise.all([
    getEarnings({ category, q }),
    getEarningsSummary(),
    getEarningsInsights(),
  ]);
  const symbol = getCurrencySymbol(summary.currency);
  const filtered = Boolean(category || q);

  return (
    <div>
      <PageHeader
        title="Earnings"
        description="Log income and track your revenue."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Today"
          value={summary.today}
          prefix={symbol}
          icon={Coins}
        />
        <StatCard
          label="This Week"
          value={summary.week}
          prefix={symbol}
          icon={CalendarDays}
        />
        <StatCard
          label="This Month"
          value={summary.month}
          prefix={symbol}
          icon={CalendarRange}
        />
        <StatCard
          label="This Year"
          value={summary.year}
          prefix={symbol}
          icon={TrendingUp}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart
              data={insights.monthly}
              currency={summary.currency}
              emptyMessage="No earnings recorded in the last 6 months."
            />
          </CardContent>
        </Card>
        <EarningsBreakdown
          topSource={insights.topSource}
          byCategory={insights.byCategory}
          lifetime={insights.lifetime}
          currency={summary.currency}
        />
      </div>

      <EarningsToolbar defaultCurrency={summary.currency} />
      <EarningsList
        earnings={earnings}
        filtered={filtered}
        defaultCurrency={summary.currency}
      />
    </div>
  );
}
