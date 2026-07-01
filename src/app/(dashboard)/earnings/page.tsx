import type { Metadata } from "next";
import { CalendarDays, CalendarRange, Coins, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { EarningsList } from "@/features/earnings/components/earnings-list";
import { EarningsToolbar } from "@/features/earnings/components/earnings-toolbar";
import { getEarnings, getEarningsSummary } from "@/features/earnings/queries";
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
  const [earnings, summary] = await Promise.all([
    getEarnings({ category, q }),
    getEarningsSummary(),
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

      <EarningsToolbar defaultCurrency={summary.currency} />
      <EarningsList earnings={earnings} filtered={filtered} />
    </div>
  );
}
