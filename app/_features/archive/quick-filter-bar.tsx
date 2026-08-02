"use client";

import type { RefObject } from "react";
import { parseRatingFilter } from "./archive-filters";

export function QuickFilterBar({
  favorite,
  decision,
  rating,
  onUpdateQuickFilter,
  unreviewedOutputCount,
  onOpenUnreviewedOutputs,
  redoAvailableCount,
  onOpenRedoSources,
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
  unreviewedOutputCount: number;
  onOpenUnreviewedOutputs: () => void;
  redoAvailableCount: number;
  onOpenRedoSources: () => void;
  filtersOpen: boolean;
  filterButtonRef: RefObject<HTMLButtonElement | null>;
  activeFilterCount: number;
  onOpenFilters: () => void;
  onCloseFilters: () => void;
}) {
  const parsedRating = parseRatingFilter(rating);
  const isFiveStarOnly =
    parsedRating.mode === "exact" &&
    parsedRating.values.length === 1 &&
    parsedRating.values[0] === "5";

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
        <button
          type="button"
          className={
            decision === "unreviewed"
              ? "quick-filter is-active"
              : "quick-filter"
          }
          aria-pressed={decision === "unreviewed"}
          aria-label={`${unreviewedOutputCount} unreviewed generated outputs`}
          onClick={onOpenUnreviewedOutputs}
        >
          UNREVIEWED <strong>{unreviewedOutputCount}</strong>
        </button>
        <button
          type="button"
          className={
            decision === "keep" ? "quick-filter is-active" : "quick-filter"
          }
          aria-pressed={decision === "keep"}
          onClick={() => onUpdateQuickFilter("decision", "keep")}
        >
          KEEP
        </button>
        <button
          type="button"
          className={
            decision === "reject" ? "quick-filter is-active" : "quick-filter"
          }
          aria-pressed={decision === "reject"}
          aria-label={`${redoAvailableCount} available redo originals`}
          onClick={onOpenRedoSources}
        >
          REDO ORIGINALS <strong>{redoAvailableCount}</strong>
        </button>
        <button
          type="button"
          className={
            isFiveStarOnly ? "quick-filter is-active" : "quick-filter"
          }
          aria-pressed={isFiveStarOnly}
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
