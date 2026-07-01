"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint } from "../types";
import { ChartEmpty, ChartTooltip } from "./chart-primitives";

interface HoursChartProps {
  data: ChartPoint[];
  emptyMessage?: string;
}

export function HoursChart({ data, emptyMessage }: HoursChartProps) {
  const hasData = data.some((point) => point.value > 0);
  if (!hasData) {
    return (
      <ChartEmpty
        message={emptyMessage ?? "No hours logged in the last 7 days."}
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
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
          width={36}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
        />
        <Tooltip
          cursor={{ fill: "var(--accent)", opacity: 0.4 }}
          content={<ChartTooltip formatter={(value) => `${value} h`} />}
        />
        <Bar
          dataKey="value"
          fill="var(--chart-1)"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
