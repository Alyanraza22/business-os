import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import type { Enums } from "@/lib/supabase/types";

import { EARNING_CATEGORY_META } from "../constants";

interface EarningsBreakdownProps {
  topSource: { name: string; amount: number } | null;
  byCategory: { category: Enums<"earning_category">; amount: number }[];
  lifetime: number;
  currency: string;
}

/** Top income source and a proportional breakdown by category. */
export function EarningsBreakdown({
  topSource,
  byCategory,
  lifetime,
  currency,
}: EarningsBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-[0.7rem] tracking-wider uppercase">
            Top source
          </p>
          {topSource ? (
            <p className="text-foreground text-sm font-semibold">
              {topSource.name}
              <span className="text-muted-foreground ml-2 font-normal tabular-nums">
                {formatMoney(topSource.amount, currency)}
              </span>
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              No income logged yet
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-muted-foreground text-[0.7rem] tracking-wider uppercase">
            By category
          </p>
          {byCategory.length === 0 ? (
            <p className="text-muted-foreground text-sm">—</p>
          ) : (
            byCategory.map((row) => {
              const pct = lifetime > 0 ? (row.amount / lifetime) * 100 : 0;
              return (
                <div key={row.category} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      {EARNING_CATEGORY_META[row.category].label}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {formatMoney(row.amount, currency)}
                    </span>
                  </div>
                  <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
