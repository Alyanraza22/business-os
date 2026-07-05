"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

const ChartFallback = () => <Skeleton className="h-[220px] w-full" />;

/**
 * Charts are the heaviest client dependency (recharts). Load them lazily on
 * the client with a skeleton fallback so they never block first paint or the
 * initial route JS.
 */
export const HoursChart = dynamic(
  () => import("./hours-chart").then((mod) => ({ default: mod.HoursChart })),
  { ssr: false, loading: ChartFallback },
);

export const RevenueChart = dynamic(
  () =>
    import("./revenue-chart").then((mod) => ({ default: mod.RevenueChart })),
  { ssr: false, loading: ChartFallback },
);
