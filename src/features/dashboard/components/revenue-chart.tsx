"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/format";

import type { ChartPoint } from "../types";
import { ChartEmpty, ChartTooltip } from "./chart-primitives";

interface RevenueChartProps {
  data: ChartPoint[];
  currency: string;
  emptyMessage?: string;
}

export function RevenueChart({
  data,
  currency,
  emptyMessage,
}: RevenueChartProps) {
  const hasData = data.some((point) => point.value > 0);
  if (!hasData) {
    return (
      <ChartEmpty
        message={emptyMessage ?? "No earnings recorded in the last 6 months."}
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="var(--border)"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickFormatter={(value) => formatCurrency(Number(value), currency)}
        />
        <Tooltip
          content={
            <ChartTooltip
              formatter={(value) => formatCurrency(value, currency)}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-2)"
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
