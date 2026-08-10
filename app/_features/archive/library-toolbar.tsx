"use client";

import type { ChangeEvent, RefObject } from "react";
import { ActionButton } from "../../_components/ui/action-button";
import { parseRatingFilter } from "./archive-filters";

export type LibrarySort = "catalog" | "name" | "rating";

export function LibraryToolbar({
  favorite,
  rating,
  sort,
  tileSize,
  filtersOpen,
  activeFilterCount,
  filterButtonRef,
  onShowAll,
  onShowFavorites,
  onShowAnchors,
  onSortChange,
  onTileSizeChange,
  onOpenFilters,
  onCloseFilters,
}: {
  favorite: string;
  rating: string;
  sort: LibrarySort;
  tileSize: number;
  filtersOpen: boolean;
  activeFilterCount: number;
  filterButtonRef: RefObject<HTMLButtonElement | null>;
  onShowAll: () => void;
  onShowFavorites: () => void;
  onShowAnchors: () => void;
  onSortChange: (sort: LibrarySort) => void;
  onTileSizeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenFilters: () => void;
  onCloseFilters: () => void;
}) {
  const parsedRating = parseRatingFilter(rating);
  const anchorsActive =
    parsedRating.mode === "exact" &&
    parsedRating.values.length === 1 &&
    parsedRating.values[0] === "5";
  const allActive = favorite === "all" && !anchorsActive;

  return (
    <div className="library-toolbar" aria-label="Library controls">
      <div className="library-views" role="group" aria-label="Library views">
        <ActionButton
          variant="ghost"
          size="compact"
          className={allActive ? "is-active" : undefined}
          aria-pressed={allActive}
          onClick={onShowAll}
        >
          ALL
        </ActionButton>
        <ActionButton
          variant="ghost"
          size="compact"
          className={favorite === "favorite" ? "is-active" : undefined}
          aria-pressed={favorite === "favorite"}
          onClick={onShowFavorites}
        >
          <span aria-hidden="true">★</span> FAVORITES
        </ActionButton>
        <ActionButton
          variant="ghost"
          size="compact"
          className={anchorsActive ? "is-active" : undefined}
          aria-pressed={anchorsActive}
          onClick={onShowAnchors}
        >
          5★
        </ActionButton>
      </div>

      <div className="library-tools">
        <ActionButton variant="ghost" size="compact" onClick={onOpenFilters}>
          COLLECTION
        </ActionButton>
        <ActionButton
          ref={filterButtonRef}
          variant="ghost"
          size="compact"
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
        </ActionButton>
        <label className="library-select-control">
          <span>SORT</span>
          <select
            aria-label="Sort library"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as LibrarySort)}
          >
            <option value="catalog">Catalog order</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </label>
        <label className="library-view-control">
          <span>VIEW</span>
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
    </div>
  );
}
