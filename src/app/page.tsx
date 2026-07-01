/**
 * Temporary root placeholder.
 *
 * Product pages (marketing landing, auth, dashboard) are built in their own
 * approved modules. This minimal page exists only so the app renders during
 * the foundation phase and confirms the design tokens + dark mode are wired up.
 */
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="border-border bg-card text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium">
        Foundation ready
      </span>
      <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
        Business OS
      </h1>
      <p className="text-muted-foreground max-w-md text-sm">
        Project initialized. Design system, theming and tooling are configured.
        Feature modules are built next.
      </p>
    </main>
  );
}
