/** Keyboard-only "skip to content" link for accessibility. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="bg-card border-border focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:border focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:outline-none"
    >
      Skip to content
    </a>
  );
}
