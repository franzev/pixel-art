"use client";

import { type ReactNode, useEffect, useState } from "react";

export function FilterSection({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const syncToViewport = () => setOpen(media.matches);
    syncToViewport();
    media.addEventListener("change", syncToViewport);
    return () => media.removeEventListener("change", syncToViewport);
  }, []);

  return (
    <details
      className="filter-section"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        <span>{title}</span>
        <small>{summary}</small>
      </summary>
      <div className="filter-section-body">{children}</div>
    </details>
  );
}
