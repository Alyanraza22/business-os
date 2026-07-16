"use client";

import { useEffect } from "react";

/**
 * Registers the service worker that makes Business OS installable.
 *
 * Production only — a worker in development just gets in the way of hot reload.
 * Registration waits for load so it never competes with the first paint, and
 * failures are swallowed: installability is a nice-to-have, never a reason to
 * break the page.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const register = () => {
      void navigator.serviceWorker.register("/sw.js").catch(() => {
        // Installability is optional; the app works regardless.
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
