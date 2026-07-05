"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatMoney } from "@/lib/format";
import type { Earning } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

import { deleteEarning } from "../actions";
import { EARNING_CATEGORY_META } from "../constants";
import { EarningDialog } from "./earning-dialog";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EarningRow({
  earning,
  onDelete,
}: {
  earning: Earning;
  onDelete?: (id: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const category = EARNING_CATEGORY_META[earning.category];

  function handleDelete() {
    if (onDelete) {
      setDeleteOpen(false);
      onDelete(earning.id);
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      startTransition(async () => {
        const result = await deleteEarning(earning.id);
        if (result.ok) {
          toast.success("Earning deleted");
          setDeleteOpen(false);
        } else {
          toast.error(result.message ?? "Delete failed");
        }
        resolve();
      });
    });
  }

  return (
    <div
      className={cn(
        "hover:bg-muted/40 flex items-center gap-3 px-4 py-3 transition-colors",
        pending && "opacity-70",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm font-medium">
          {earning.source || "Income"}
        </span>
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <Badge variant={category.badge}>{category.label}</Badge>
          <span>{formatDate(earning.earned_on)}</span>
        </div>
      </div>

      <span className="text-success shrink-0 text-sm font-semibold tabular-nums">
        {formatMoney(Number(earning.amount), earning.currency)}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-8"
            aria-label="Earning actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EarningDialog
        earning={earning}
        defaultCurrency={earning.currency}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete earning?"
        description="This income entry will be moved to trash."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  );
}
