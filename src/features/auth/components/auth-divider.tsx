/** "OR" separator used between OAuth and email/password on the auth pages. */
export function AuthDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <span className="bg-border h-px flex-1" />
      <span className="text-muted-foreground text-xs font-medium">OR</span>
      <span className="bg-border h-px flex-1" />
    </div>
  );
}
