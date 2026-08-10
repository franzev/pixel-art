"use client";

import type { RefObject } from "react";
import type { ArchiveView } from "./archive-types";

export function ArchiveHeader({
  query,
  onQueryChange,
  searchRef,
  view,
  catalogCount,
  reviewCount,
  attemptCount,
  onViewChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  view: ArchiveView;
  catalogCount: number;
  reviewCount: number;
  attemptCount: number;
  onViewChange: (view: ArchiveView) => void;
}) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div>
          <h1>THE ASHEN ARCHIVE</h1>
          <p>PRIVATE RENDER INDEX</p>
        </div>
      </div>

      <label className="search-field">
        <span className="sr-only">
          {view === "attempts" ? "Search attempts" : "Search renders"}
        </span>
        <input
          ref={searchRef}
          type="search"
          aria-label={view === "attempts" ? "Search attempts" : "Search renders"}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={
            view === "attempts"
              ? "Search concepts, collections, attempts…"
              : "Search renders, collections, filenames…"
          }
        />
        <kbd>/</kbd>
      </label>

      <div className="topbar-actions">
        <nav className="archive-view-switch" aria-label="Archive view">
          <button
            type="button"
            className={view === "catalog" ? "is-active" : undefined}
            aria-current={view === "catalog" ? "page" : undefined}
            onClick={() => onViewChange("catalog")}
          >
            <span>LIBRARY</span>
            <strong>{catalogCount}</strong>
          </button>
          <button
            type="button"
            className={view === "review" ? "is-active" : undefined}
            aria-current={view === "review" ? "page" : undefined}
            onClick={() => onViewChange("review")}
          >
            <span>REVIEW</span>
            <strong>{reviewCount}</strong>
          </button>
          <button
            type="button"
            className={view === "attempts" ? "is-active" : undefined}
            aria-current={view === "attempts" ? "page" : undefined}
            onClick={() => onViewChange("attempts")}
          >
            <span>ATTEMPTS</span>
            <strong>{attemptCount}</strong>
          </button>
        </nav>
      </div>
    </header>
  );
}
