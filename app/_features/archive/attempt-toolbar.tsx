"use client";

export type AttemptSourceFilter = "all" | "successful" | "raw";

export function AttemptToolbar({
  attemptCount,
  seriesCount,
  unreviewedCount,
  sourceFilter,
  successfulCount,
  rawCount,
  onSourceFilterChange,
  onReviewUnreviewed,
}: {
  attemptCount: number;
  seriesCount: number;
  unreviewedCount: number;
  sourceFilter: AttemptSourceFilter;
  successfulCount: number;
  rawCount: number;
  onSourceFilterChange: (filter: AttemptSourceFilter) => void;
  onReviewUnreviewed: () => void;
}) {
  return (
    <>
      <div className="attempt-toolbar">
        <div>
          <span className="eyebrow">GENERATION OUTPUTS</span>
          <p>Compare successful candidates with their raw attempts.</p>
        </div>
        <div className="attempt-source-filter" role="group" aria-label="Output type">
          <button
            type="button"
            className={sourceFilter === "all" ? "is-active" : undefined}
            aria-pressed={sourceFilter === "all"}
            onClick={() => onSourceFilterChange("all")}
          >
            ALL <strong>{attemptCount}</strong>
          </button>
          <button
            type="button"
            className={sourceFilter === "successful" ? "is-active" : undefined}
            aria-pressed={sourceFilter === "successful"}
            onClick={() => onSourceFilterChange("successful")}
          >
            SUCCESSFUL <strong>{successfulCount}</strong>
          </button>
          <button
            type="button"
            className={sourceFilter === "raw" ? "is-active" : undefined}
            aria-pressed={sourceFilter === "raw"}
            onClick={() => onSourceFilterChange("raw")}
          >
            RAW <strong>{rawCount}</strong>
          </button>
        </div>
        <dl aria-label="Attempt archive summary">
          <div>
            <dt>Attempts</dt>
            <dd>{attemptCount}</dd>
          </div>
          <div>
            <dt>Series</dt>
            <dd>{seriesCount}</dd>
          </div>
          <div>
            <dt>Unreviewed</dt>
            <dd>{unreviewedCount}</dd>
          </div>
        </dl>
        <button
          className="attempt-review-action"
          type="button"
          onClick={onReviewUnreviewed}
          disabled={!unreviewedCount}
        >
          REVIEW UNREVIEWED · {unreviewedCount}
        </button>
      </div>
      <div className="active-filter-strip">
        <span className="shortcut-hint">
          EXCLUDED FROM CATALOG · REVIEWABLE · ← → TO NAVIGATE · / TO SEARCH
        </span>
      </div>
    </>
  );
}
