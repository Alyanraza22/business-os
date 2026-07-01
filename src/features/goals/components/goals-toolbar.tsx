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
import { GOAL_STATUSES, GOAL_TYPES } from "@/lib/enums";

import { GOAL_STATUS_META, GOAL_TYPE_META } from "../constants";
import { GoalDialog } from "./goal-dialog";

export function GoalsToolbar() {
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

  function filterSetter(key: string) {
    return (value: string) =>
      pushParams((params) => {
        if (value === "all") params.delete(key);
        else params.set(key, value);
      });
  }

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search goals..."
            className="pl-8"
            aria-label="Search goals"
          />
        </div>
        <Select
          defaultValue={searchParams.get("type") ?? "all"}
          onValueChange={filterSetter("type")}
        >
          <SelectTrigger className="w-36" aria-label="Filter by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {GOAL_TYPES.map((value) => (
              <SelectItem key={value} value={value}>
                {GOAL_TYPE_META[value].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          defaultValue={searchParams.get("status") ?? "all"}
          onValueChange={filterSetter("status")}
        >
          <SelectTrigger className="w-36" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {GOAL_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {GOAL_STATUS_META[value].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <GoalDialog
        trigger={
          <Button>
            <Plus />
            New goal
          </Button>
        }
      />
    </div>
  );
}
