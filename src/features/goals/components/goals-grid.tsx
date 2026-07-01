import { Plus, Target } from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import type { Goal } from "@/lib/supabase/types";

import { GoalCard } from "./goal-card";
import { GoalDialog } from "./goal-dialog";

interface GoalsGridProps {
  goals: Goal[];
  filtered: boolean;
}

export function GoalsGrid({ goals, filtered }: GoalsGridProps) {
  if (goals.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title={filtered ? "No matching goals" : "No goals yet"}
        description={
          filtered
            ? "Try adjusting your search or filters."
            : "Set your first goal and track progress towards it."
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
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
