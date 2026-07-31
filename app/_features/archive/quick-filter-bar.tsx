"use client";

import type { RefObject } from "react";

export function QuickFilterBar({
  favorite,
  decision,
  rating,
  onUpdateQuickFilter,
  filtersOpen,
  filterButtonRef,
  activeFilterCount,
  onOpenFilters,
  onCloseFilters,
}: {
  favorite: string;
  decision: string;
  rating: string;
  onUpdateQuickFilter: (
    key: "favorite" | "decision" | "rating",
    value: string,
  ) => void;
  filtersOpen: boolean;
  filterButtonRef: RefObject<HTMLButtonElement | null>;
  activeFilterCount: number;
  onOpenFilters: () => void;
  onCloseFilters: () => void;
}) {
  return (
    <div className="quick-filter-bar">
      <div
        className="quick-filter-scroll"
        role="group"
        aria-label="Quick filters"
      >
        <button
          type="button"
          className={
            favorite === "favorite" ? "quick-filter is-active" : "quick-filter"
          }
          aria-label="Favorites"
          aria-pressed={favorite === "favorite"}
          onClick={() => onUpdateQuickFilter("favorite", "favorite")}
        >
          <span aria-hidden="true">★</span>
          <span className="quick-favorite-label">FAVORITES</span>
        </button>
        {[
          ["unreviewed", "UNREVIEWED"],
          ["keep", "KEEP"],
          ["reject", "REDO"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={
              decision === value ? "quick-filter is-active" : "quick-filter"
            }
            aria-pressed={decision === value}
            onClick={() => onUpdateQuickFilter("decision", value)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className={
            rating === "5" ? "quick-filter is-active" : "quick-filter"
          }
          aria-pressed={rating === "5"}
          onClick={() => onUpdateQuickFilter("rating", "5")}
        >
          5★
        </button>
      </div>

      <button
        ref={filterButtonRef}
        className="all-filters-action"
        type="button"
        aria-expanded={filtersOpen}
        aria-controls="archive-filters"
        onClick={() => (filtersOpen ? onCloseFilters() : onOpenFilters())}
      >
        FILTERS
        {activeFilterCount ? (
          <strong aria-label={`${activeFilterCount} active filters`}>
            {activeFilterCount}
          </strong>
        ) : null}
      </button>
    </div>
  );
}
