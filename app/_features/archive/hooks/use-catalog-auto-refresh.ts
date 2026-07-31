"use client";

import { useEffect, useRef } from "react";

export function useCatalogAutoRefresh({
  currentVersion,
  busy,
}: {
  currentVersion: string;
  busy: boolean;
}) {
  const busyRef = useRef(busy);

  useEffect(() => {
    busyRef.current = busy;
  }, [busy]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const controller = new AbortController();

    const checkForCatalogUpdate = async () => {
      try {
        const response = await fetch("/api/catalog", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const latest = (await response.json()) as { version?: string };
        if (latest.version && latest.version !== currentVersion) {
          // Filter state survives the reload via the URL, but an open drawer
          // or an in-progress review must not be yanked away; wait for the
          // next tick once the user is idle again.
          if (busyRef.current) return;
          window.location.reload();
        }
      } catch {
        // The dev server may be restarting while the index refreshes.
      }
    };

    const timer = window.setInterval(checkForCatalogUpdate, 2_000);
    void checkForCatalogUpdate();

    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [currentVersion]);
}
