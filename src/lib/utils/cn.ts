import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve conflicting Tailwind utilities.
 * The single source of truth for composing className strings across the app.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
