import { renderAppIcon } from "@/lib/app-icon";

/** PWA manifest icon — the minimum size Chrome wants for installability. */
export function GET() {
  return renderAppIcon({ size: 192 });
}
