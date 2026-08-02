"use client";

export function AttemptEmptyState({
  hasQuery,
  onClear,
}: {
  hasQuery: boolean;
  onClear: () => void;
}) {
  return (
    <div className="empty-state attempt-empty">
      <span>{hasQuery ? "NO MATCHING ATTEMPTS" : "NO ATTEMPTS ARCHIVED"}</span>
      <h2>{hasQuery ? "Nothing in this archive slice" : "Archive is empty"}</h2>
      <p>
        {hasQuery
          ? "Try a concept, collection, category, or attempt number."
          : "Raw generator outputs appear here after they are archived."}
      </p>
      {hasQuery ? (
        <button type="button" onClick={onClear}>
          CLEAR SEARCH
        </button>
      ) : null}
    </div>
  );
}
