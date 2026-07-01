"use client";

import { type ReactNode, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Earning } from "@/lib/supabase/types";

import { createEarning, updateEarning } from "../actions";
import { EarningForm } from "./earning-form";

interface EarningDialogProps {
  earning?: Earning;
  defaultCurrency: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EarningDialog({
  earning,
  defaultCurrency,
  trigger,
  open,
  onOpenChange,
}: EarningDialogProps) {
  const isEdit = Boolean(earning);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setInternalOpen(value);
  };

  const action =
    isEdit && earning ? updateEarning.bind(null, earning.id) : createEarning;

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit earning" : "New earning"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this income entry." : "Record income you earned."}
          </DialogDescription>
        </DialogHeader>
        <EarningForm
          earning={earning}
          defaultCurrency={defaultCurrency}
          action={action}
          submitLabel={isEdit ? "Save changes" : "Add earning"}
          onSuccess={() => {
            setOpen(false);
            toast.success(isEdit ? "Earning updated" : "Earning added");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
