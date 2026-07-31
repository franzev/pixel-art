"use client";

import type { FilterToken } from "./archive-types";

export function ActiveFilterStrip({ tokens }: { tokens: FilterToken[] }) {
  return (
    <div className="active-filter-strip" aria-label="Active filters">
      {tokens.length ? (
        tokens.map((token) => (
          <button
            key={token.id}
            type="button"
            onClick={token.onRemove}
            aria-label={`Remove ${token.label} filter`}
          >
            <span>{token.label}</span>
            <strong aria-hidden="true">×</strong>
          </button>
        ))
      ) : (
        <span className="shortcut-hint">
          F TO FAVORITE · ← → TO NAVIGATE · / TO SEARCH
        </span>
      )}
    </div>
  );
}
