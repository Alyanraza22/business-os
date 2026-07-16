import type { Metadata } from "next";
import {
  CalendarDays,
  CalendarRange,
  Coins,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EarningDialog } from "@/features/earnings/components/earning-dialog";
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
import { ProfitabilityTable } from "@/features/profitability/components/profitability-table";
import { getProjectProfitability } from "@/features/profitability/queries";
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
  const [earnings, summary, insights, profitability] = await Promise.all([
    getEarnings({ category, q }),
    getEarningsSummary(),
    getEarningsInsights(),
    getProjectProfitability(),
  ]);
  const symbol = getCurrencySymbol(summary.currency);
  const filtered = Boolean(category || q);
  // With no income at all, four zeroes + an empty chart + an empty breakdown is
  // just noise — show one guiding state instead.
  const hasEarnings = insights.lifetime > 0 || earnings.length > 0;

  if (!hasEarnings && !filtered) {
    return (
      <div>
        <PageHeader
          title="Earnings"
          description="Log income and track your revenue."
        />
        <EmptyState
          icon={Wallet}
          title="Turn your work into a revenue picture"
          description="Record what you earn by source and category. Business OS then charts your revenue trend, finds your top income source, and — combined with tracked time — reveals which projects are actually worth your hours."
          action={
            <EarningDialog
              defaultCurrency={summary.currency}
              trigger={
                <Button>
                  <Plus />
                  Record your first earning
                </Button>
              }
            />
          }
        />
      </div>
    );
  }

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

      <div className="mb-6">
        <ProfitabilityTable report={profitability} />
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
