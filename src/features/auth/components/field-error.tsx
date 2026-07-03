/** Inline validation message for a form field. */
export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-destructive text-xs">{messages[0]}</p>;
}

/** Non-field form-level error banner. */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm"
    >
      {message}
    </p>
  );
}
