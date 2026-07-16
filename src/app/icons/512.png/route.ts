import { renderAppIcon } from "@/lib/app-icon";

/** PWA manifest icon — used for install dialogs and the app window. */
export function GET() {
  return renderAppIcon({ size: 512 });
}
