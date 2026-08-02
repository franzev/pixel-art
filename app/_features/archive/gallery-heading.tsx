"use client";

export function GalleryHeading({
  eyebrow = "CONTACT SHEET",
  noun = "RENDERS",
  filteredCount,
  totalCount,
  hiddenRejectedCount,
  hasFilters,
  query,
  onClear,
}: {
  eyebrow?: string;
  noun?: string;
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
        <span className="eyebrow">{eyebrow}</span>
        <p>
          {filteredCount} OF {totalCount} {noun}
          {hiddenRejectedCount ? (
            <span className="heading-note">
              {" "}
              · {hiddenRejectedCount} REJECTED HIDDEN
            </span>
          ) : null}
        </p>
      </div>
      <p className="sr-only" role="status">
        Showing {filteredCount} of {totalCount} {noun.toLocaleLowerCase()}
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
