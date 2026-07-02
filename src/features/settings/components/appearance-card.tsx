"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function AppearanceCard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid a hydration mismatch: only reflect the active theme after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const active = mounted ? theme : undefined;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        return (
          <Button
            key={option.value}
            variant={active === option.value ? "primary" : "outline"}
            onClick={() => setTheme(option.value)}
            className="flex-1 gap-2"
          >
            <Icon className="size-4" />
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
