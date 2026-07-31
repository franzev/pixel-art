"use client";

import type { EmptyRecoveryCandidate } from "./archive-types";

export function GalleryEmptyState({
  favorite,
  activeFilterCount,
  query,
  emptyRecovery,
  onShowAllFavorites,
  onClearEverything,
}: {
  favorite: string;
  activeFilterCount: number;
  query: string;
  emptyRecovery: EmptyRecoveryCandidate | null;
  onShowAllFavorites: () => void;
  onClearEverything: () => void;
}) {
  return (
    <div id="render-grid" className="empty-state">
      {favorite === "favorite" && activeFilterCount === 1 && !query.trim() ? (
        <>
          <span>NO FAVORITES</span>
          <h2>No favorites in this drawer.</h2>
          <p>
            <span className="pointer-fine-only">
              Select a render and press F to add it to favorites.
            </span>
            <span className="pointer-coarse-only">
              Open a render and tap the star to favorite it.
            </span>
          </p>
          <button type="button" onClick={onShowAllFavorites}>
            SHOW ALL RENDERS
          </button>
        </>
      ) : emptyRecovery && emptyRecovery.freed > 0 ? (
        <>
          <span>NO MATCHES</span>
          <h2>Nothing in this drawer.</h2>
          <p>The {emptyRecovery.label} filter is emptying this view.</p>
          <button type="button" onClick={emptyRecovery.loosen}>
            DROP {emptyRecovery.label} · SHOW {emptyRecovery.freed} RENDERS
          </button>
          <button
            type="button"
            className="empty-state-secondary"
            onClick={onClearEverything}
          >
            CLEAR ALL
          </button>
        </>
      ) : (
        <>
          <span>NO MATCHES</span>
          <h2>Nothing in this drawer.</h2>
          <p>
            No single filter frees this view. Clear everything and start
            again.
          </p>
          <button type="button" onClick={onClearEverything}>
            CLEAR ALL
          </button>
        </>
      )}
    </div>
  );
}
