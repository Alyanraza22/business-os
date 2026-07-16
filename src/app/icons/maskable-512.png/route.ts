import { renderAppIcon } from "@/lib/app-icon";

/** Full-bleed variant the OS can crop to its own icon shape. */
export function GET() {
  return renderAppIcon({ size: 512, maskable: true });
}
