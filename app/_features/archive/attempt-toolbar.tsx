"use client";

import { SavedTimeFilter } from "./filters/saved-time-filter";

export type AttemptSourceFilter = "all" | "successful" | "raw";

export function AttemptToolbar({
  attemptCount,
  seriesCount,
  unreviewedCount,
  sourceFilter,
  successfulCount,
  rawCount,
  savedTime,
  savedFrom,
  savedTo,
  onSourceFilterChange,
  onSavedTimeChange,
  onSavedFromChange,
  onSavedToChange,
  onReviewUnreviewed,
}: {
  attemptCount: number;
  seriesCount: number;
  unreviewedCount: number;
  sourceFilter: AttemptSourceFilter;
  successfulCount: number;
  rawCount: number;
  savedTime: string;
  savedFrom: string;
  savedTo: string;
  onSourceFilterChange: (filter: AttemptSourceFilter) => void;
  onSavedTimeChange: (value: string) => void;
  onSavedFromChange: (value: string) => void;
  onSavedToChange: (value: string) => void;
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
        <SavedTimeFilter
          compact
          value={savedTime}
          customFrom={savedFrom}
          customTo={savedTo}
          onChange={onSavedTimeChange}
          onCustomFromChange={onSavedFromChange}
          onCustomToChange={onSavedToChange}
        />
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
