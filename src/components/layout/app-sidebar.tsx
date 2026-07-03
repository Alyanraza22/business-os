import { Brand } from "./brand";
import { SidebarNav } from "./sidebar-nav";

/** Fixed desktop sidebar. Hidden below the md breakpoint (see MobileNav). */
export function AppSidebar() {
  return (
    <aside className="border-border bg-card hidden w-64 shrink-0 flex-col border-r md:flex">
      <div className="border-border flex h-14 items-center border-b px-5">
        <Brand href="/" />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <SidebarNav />
      </div>
    </aside>
  );
}
