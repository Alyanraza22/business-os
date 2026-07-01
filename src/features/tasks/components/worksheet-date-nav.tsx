"use client";

import { addDays, format, parseISO } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function WorksheetDateNav({ date }: { date: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function goTo(nextDate: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", nextDate);
    params.delete("page");
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  const current = parseISO(date);
  const label = format(current, "EEEE • d MMMM yyyy");
  const today = format(new Date(), "yyyy-MM-dd");
  const isToday = date === today;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous day"
        disabled={pending}
        onClick={() => goTo(format(addDays(current, -1), "yyyy-MM-dd"))}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <Button
        variant="outline"
        className="min-w-[15rem] justify-start gap-2"
        onClick={() => inputRef.current?.showPicker()}
      >
        <CalendarDays className="text-muted-foreground size-4" />
        <span className="font-medium">{label}</span>
      </Button>
      <input
        ref={inputRef}
        type="date"
        value={date}
        onChange={(event) => event.target.value && goTo(event.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />

      <Button
        variant="outline"
        size="icon"
        aria-label="Next day"
        disabled={pending}
        onClick={() => goTo(format(addDays(current, 1), "yyyy-MM-dd"))}
      >
        <ChevronRight className="size-4" />
      </Button>

      <Button
        variant={isToday ? "secondary" : "ghost"}
        disabled={isToday || pending}
        onClick={() => goTo(today)}
      >
        Today
      </Button>
    </div>
  );
}
