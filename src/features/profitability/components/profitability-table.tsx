import { TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { ProfitabilityReport } from "../queries";

/**
 * Which work actually pays. Rates are coloured relative to the user's own
 * blended rate rather than an arbitrary threshold, so the comparison is always
 * meaningful for their business.
 */
export function ProfitabilityTable({
  report,
}: {
  report: ProfitabilityReport;
}) {
  const { projects, currency, overallHourly, unassignedRevenue } = report;

  if (projects.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle>Project profitability</CardTitle>
          <p className="text-muted-foreground text-sm">
            Revenue against the hours each project consumed.
          </p>
        </div>
        {overallHourly !== null ? (
          <div className="flex shrink-0 flex-col items-end">
            <span className="text-muted-foreground text-[0.7rem] tracking-wider uppercase">
              Blended rate
            </span>
            <span className="text-foreground inline-flex items-center gap-1 text-lg font-semibold tabular-nums">
              <TrendingUp className="text-primary size-4" />
              {formatMoney(overallHourly, currency)}/h
            </span>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] text-sm">
            <thead>
              <tr className="text-muted-foreground border-border border-b text-left text-[0.7rem] tracking-wider uppercase">
                <th className="pb-2 font-medium">Project</th>
                <th className="pb-2 text-right font-medium">Revenue</th>
                <th className="pb-2 text-right font-medium">Hours</th>
                <th className="pb-2 text-right font-medium">Rate</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const better =
                  overallHourly !== null &&
                  project.effectiveHourly !== null &&
                  project.effectiveHourly >= overallHourly;

                return (
                  <tr
                    key={project.id}
                    className="border-border hover:bg-muted/40 border-b transition-colors last:border-0"
                  >
                    <td className="py-2.5">
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-foreground truncate">
                          {project.name}
                        </span>
                      </span>
                    </td>
                    <td className="text-muted-foreground py-2.5 text-right tabular-nums">
                      {project.revenue > 0
                        ? formatMoney(project.revenue, currency)
                        : "—"}
                    </td>
                    <td className="text-muted-foreground py-2.5 text-right tabular-nums">
                      {project.hours}h
                    </td>
                    <td className="py-2.5 text-right">
                      {project.effectiveHourly === null ? (
                        <span className="text-muted-foreground/60 text-xs">
                          {project.revenue > 0
                            ? "no time logged"
                            : "no revenue"}
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "font-semibold tabular-nums",
                            better ? "text-success" : "text-warning",
                          )}
                        >
                          {formatMoney(project.effectiveHourly, currency)}/h
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {unassignedRevenue > 0 ? (
          <p className="text-muted-foreground/70 text-xs leading-relaxed">
            {formatMoney(unassignedRevenue, currency)} isn&apos;t linked to a
            project yet — assign it to an earning&apos;s project to sharpen
            these rates.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
