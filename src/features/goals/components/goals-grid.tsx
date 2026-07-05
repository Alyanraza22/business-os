"use client";

import { Plus, Target } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import type { Goal } from "@/lib/supabase/types";

import { deleteGoal } from "../actions";
import { GoalCard } from "./goal-card";
import { GoalDialog } from "./goal-dialog";

interface GoalsGridProps {
  goals: Goal[];
  filtered: boolean;
}

export function GoalsGrid({ goals, filtered }: GoalsGridProps) {
  const [optimistic, removeOptimistic] = useOptimistic(
    goals,
    (state, removedId: string) => state.filter((g) => g.id !== removedId),
  );
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      removeOptimistic(id);
      const result = await deleteGoal(id);
      if (result.ok) toast.success("Goal deleted");
      else toast.error(result.message ?? "Delete failed");
    });
  }

  if (optimistic.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title={filtered ? "No matching goals" : "No goals yet"}
        description={
          filtered
            ? "Try adjusting your search or filters."
            : "Goals turn intentions into measurable progress. Set a target — a number or a milestone — and watch the bar fill as you close in on it."
        }
        action={
          filtered ? undefined : (
            <GoalDialog
              trigger={
                <Button>
                  <Plus />
                  New goal
                </Button>
              }
            />
          )
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {optimistic.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
      ))}
    </div>
  );
}
