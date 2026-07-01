import {
  Briefcase,
  Code,
  FolderKanban,
  Globe,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  Palette,
  PenTool,
  Rocket,
  ShoppingBag,
  Store,
  type LucideIcon,
} from "lucide-react";

import { type BadgeVariant, PRIORITY_META } from "@/features/shared/constants";
import type { Enums } from "@/lib/supabase/types";

export { PRIORITY_META };

export const PROJECT_STATUS_META: Record<
  Enums<"project_status">,
  { label: string; badge: BadgeVariant }
> = {
  planning: { label: "Planning", badge: "secondary" },
  active: { label: "Active", badge: "success" },
  paused: { label: "Paused", badge: "warning" },
  completed: { label: "Completed", badge: "default" },
  archived: { label: "Archived", badge: "outline" },
};

export const PROJECT_COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
  "#8B5CF6",
  "#64748B",
] as const;

export const DEFAULT_PROJECT_COLOR = "#6366F1";
export const DEFAULT_PROJECT_ICON = "FolderKanban";

export const PROJECT_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "FolderKanban", icon: FolderKanban },
  { name: "LayoutDashboard", icon: LayoutDashboard },
  { name: "Rocket", icon: Rocket },
  { name: "Code", icon: Code },
  { name: "Palette", icon: Palette },
  { name: "PenTool", icon: PenTool },
  { name: "Globe", icon: Globe },
  { name: "Store", icon: Store },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Megaphone", icon: Megaphone },
  { name: "Briefcase", icon: Briefcase },
  { name: "Lightbulb", icon: Lightbulb },
];

const ICON_MAP = new Map(
  PROJECT_ICONS.map((entry) => [entry.name, entry.icon]),
);

/** Resolve a stored icon name to its Lucide component (default FolderKanban). */
export function getProjectIcon(name?: string | null): LucideIcon {
  return (name ? ICON_MAP.get(name) : undefined) ?? FolderKanban;
}
