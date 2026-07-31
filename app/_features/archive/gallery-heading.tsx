"use client";

export function GalleryHeading({
  filteredCount,
  totalCount,
  hiddenRejectedCount,
  hasFilters,
  query,
  onClear,
}: {
  filteredCount: number;
  totalCount: number;
  hiddenRejectedCount: number;
  hasFilters: boolean;
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="gallery-heading">
      <div>
        <span className="eyebrow">CONTACT SHEET</span>
        <p>
          {filteredCount} OF {totalCount} RENDERS
          {hiddenRejectedCount ? (
            <span className="heading-note">
              {" "}
              · {hiddenRejectedCount} REJECTED HIDDEN
            </span>
          ) : null}
        </p>
      </div>
      <p className="sr-only" role="status">
        Showing {filteredCount} of {totalCount} renders
      </p>
      {hasFilters || query.trim() ? (
        <button type="button" onClick={onClear}>
          {hasFilters && query.trim()
            ? "CLEAR FILTERS & SEARCH"
            : hasFilters
              ? "CLEAR FILTERS"
              : "CLEAR SEARCH"}
        </button>
      ) : null}
    </div>
  );
}
