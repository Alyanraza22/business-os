import { Wallet } from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
import { Card } from "@/components/ui/card";
import type { Earning } from "@/lib/supabase/types";

import { EarningRow } from "./earning-row";

interface EarningsListProps {
  earnings: Earning[];
  filtered: boolean;
}

export function EarningsList({ earnings, filtered }: EarningsListProps) {
  if (earnings.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title={filtered ? "No matching earnings" : "No earnings yet"}
        description={
          filtered
            ? "Try adjusting your search or filter."
            : "Record your income and watch your revenue add up."
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
