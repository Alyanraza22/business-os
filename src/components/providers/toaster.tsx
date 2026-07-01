"use client";

import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = ComponentProps<typeof SonnerToaster>;

/**
 * App toast portal. Themed with our tokens and synced to the active theme.
 * Use the `toast()` function (re-exported from the ui barrel) to trigger toasts.
 */
function Toaster(props: ToasterProps) {
  const { theme = "dark" } = useTheme();

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:border-border group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
