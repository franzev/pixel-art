"use client";

import type { ChangeEvent, RefObject } from "react";

export function ArchiveHeader({
  query,
  onQueryChange,
  searchRef,
  tileSize,
  onTileSizeChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  tileSize: number;
  onTileSizeChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
        <span className="sr-only">Search renders</span>
        <input
          ref={searchRef}
          type="search"
          aria-label="Search renders"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search name, collection, filename…"
        />
        <kbd>/</kbd>
      </label>

      <div className="topbar-actions">
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
