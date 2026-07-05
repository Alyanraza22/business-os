"use client";

import { addDays, format, parseISO } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";

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

  // Keyboard shortcuts: [ / ] change day, t today, n add task. Ignored while
  // typing in a field so inline editing is never disrupted.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "[") {
        event.preventDefault();
        goTo(format(addDays(current, -1), "yyyy-MM-dd"));
      } else if (event.key === "]") {
        event.preventDefault();
        goTo(format(addDays(current, 1), "yyyy-MM-dd"));
      } else if (event.key === "t" && !isToday) {
        event.preventDefault();
        goTo(today);
      } else if (event.key === "n") {
        const input = document.getElementById("worksheet-new-task");
        if (input) {
          event.preventDefault();
          input.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, isToday]);

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

      <span className="text-muted-foreground ml-auto hidden text-xs lg:inline">
        <kbd className="font-sans">[</kbd> <kbd className="font-sans">]</kbd>{" "}
        change day · <kbd className="font-sans">n</kbd> add ·{" "}
        <kbd className="font-sans">t</kbd> today
      </span>
    </div>
  );
}
