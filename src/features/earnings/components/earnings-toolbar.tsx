"use client";

import { Plus, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EARNING_CATEGORIES } from "@/lib/enums";

import { EARNING_CATEGORY_META } from "../constants";
import { EarningDialog } from "./earning-dialog";

export function EarningsToolbar({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const queryString = params.toString();
    startTransition(() =>
      router.replace(queryString ? `${pathname}?${queryString}` : pathname),
    );
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      pushParams((params) => {
        if (query) params.set("q", query);
        else params.delete("q");
      });
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by source..."
            className="pl-8"
            aria-label="Search earnings"
          />
        </div>
        <Select
          defaultValue={searchParams.get("category") ?? "all"}
          onValueChange={(value) =>
            pushParams((params) => {
              if (value === "all") params.delete("category");
              else params.set("category", value);
            })
          }
        >
          <SelectTrigger className="w-40" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {EARNING_CATEGORIES.map((value) => (
              <SelectItem key={value} value={value}>
                {EARNING_CATEGORY_META[value].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <EarningDialog
        defaultCurrency={defaultCurrency}
        trigger={
          <Button>
            <Plus />
            New earning
          </Button>
        }
      />
    </div>
  );
}
