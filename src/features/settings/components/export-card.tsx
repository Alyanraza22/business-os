"use client";

import { Download } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { exportData } from "../actions";

export function ExportCard() {
  const [pending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const result = await exportData();
      if (!result.ok || !result.json) {
        toast.error(result.message ?? "Export failed");
        return;
      }
      const blob = new Blob([result.json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `business-os-export-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    });
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      loading={pending}
      className="w-fit gap-2"
    >
      <Download className="size-4" />
      Export data (JSON)
    </Button>
  );
}
