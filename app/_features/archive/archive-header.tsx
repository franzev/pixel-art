"use client";

import type { ChangeEvent, RefObject } from "react";
import type { ArchiveView } from "./archive-types";

export function ArchiveHeader({
  query,
  onQueryChange,
  searchRef,
  tileSize,
  onTileSizeChange,
  view,
  catalogCount,
  attemptCount,
  onViewChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  tileSize: number;
  onTileSizeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  view: ArchiveView;
  catalogCount: number;
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
          {view === "catalog" ? "Search renders" : "Search attempts"}
        </span>
        <input
          ref={searchRef}
          type="search"
          aria-label={view === "catalog" ? "Search renders" : "Search attempts"}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={
            view === "catalog"
              ? "Search name, collection, filename…"
              : "Search concept, collection, attempt…"
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
            <span>CATALOG</span>
            <strong>{catalogCount}</strong>
          </button>
          {view === "attempts" ? (
            <button
              type="button"
              className="is-active"
              aria-current="page"
              onClick={() => onViewChange("catalog")}
            >
              <span>HISTORY</span>
              <strong>{attemptCount}</strong>
            </button>
          ) : null}
        </nav>
        <label className="grid-control">
          <span>GRID</span>
          <input
            type="range"
            min="116"
            max="220"
            step="8"
            value={tileSize}
            onChange={onTileSizeChange}
            aria-label="Gallery tile size"
          />
        </label>
      </div>
    </header>
  );
}
