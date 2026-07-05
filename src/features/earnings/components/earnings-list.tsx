"use client";

import { Plus, Wallet } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Earning } from "@/lib/supabase/types";

import { deleteEarning } from "../actions";
import { EarningDialog } from "./earning-dialog";
import { EarningRow } from "./earning-row";

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
  const [optimistic, removeOptimistic] = useOptimistic(
    earnings,
    (state, removedId: string) => state.filter((e) => e.id !== removedId),
  );
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      removeOptimistic(id);
      const result = await deleteEarning(id);
      if (result.ok) toast.success("Earning deleted");
      else toast.error(result.message ?? "Delete failed");
    });
  }

  if (optimistic.length === 0) {
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
      {optimistic.map((earning) => (
        <EarningRow
          key={earning.id}
          earning={earning}
          onDelete={handleDelete}
        />
      ))}
    </Card>
  );
}
