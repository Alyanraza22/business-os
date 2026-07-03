import { Plus, Wallet } from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Earning } from "@/lib/supabase/types";

import { EarningRow } from "./earning-row";
import { EarningDialog } from "./earning-dialog";

interface EarningsListProps {
  earnings: Earning[];
  filtered: boolean;
  defaultCurrency: string;
}

export function EarningsList({
  earnings,
  filtered,
  defaultCurrency,
}: EarningsListProps) {
  if (earnings.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title={filtered ? "No matching earnings" : "No earnings yet"}
        description={
          filtered
            ? "Try adjusting your search or filter."
            : "Earnings track the income you bring in, by source and category. Record your first entry to build a clear picture of your revenue over time."
        }
        action={
          filtered ? undefined : (
            <EarningDialog
              defaultCurrency={defaultCurrency}
              trigger={
                <Button>
                  <Plus />
                  Record earning
                </Button>
              }
            />
          )
        }
      />
    );
  }

  return (
    <Card className="divide-border divide-y overflow-hidden">
      {earnings.map((earning) => (
        <EarningRow key={earning.id} earning={earning} />
      ))}
    </Card>
  );
}
