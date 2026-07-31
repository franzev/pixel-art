"use client";

export function RaceFilter({
  value,
  selectedLabel,
  query,
  onQueryChange,
  totalCount,
  matching,
  counts,
  onChange,
}: {
  value: string;
  selectedLabel: string;
  query: string;
  onQueryChange: (value: string) => void;
  totalCount: number;
  matching: { value: string; label: string }[];
  counts: Map<string, number>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="filter-group race-filter">
      <span className="filter-group-label" id="race-filter-label">
        Race
      </span>
      {value !== "all" ? (
        <div className="collection-chips" aria-label="Selected race">
          <button
            type="button"
            className="collection-chip"
            onClick={() => onChange("all")}
            aria-label={`Remove ${selectedLabel} race filter`}
          >
            <span>{selectedLabel}</span>
            <strong aria-hidden="true">×</strong>
          </button>
        </div>
      ) : null}
      <label className="collection-combobox">
        <span className="sr-only">Find a race</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={`Search ${totalCount} races…`}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={Boolean(query.trim())}
          aria-controls="race-options"
        />
      </label>
      <div
        id="race-options"
        className="filter-list collection-options"
        role="radiogroup"
        aria-labelledby="race-filter-label"
      >
        {matching.map((option) => {
          const checked = value === option.value;
          const count = counts.get(option.value) ?? 0;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              className={[
                "filter-row",
                checked ? "active" : "",
                count === 0 ? "is-empty" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                onChange(checked ? "all" : option.value);
                onQueryChange("");
              }}
            >
              <span className="filter-marker" aria-hidden="true" />
              <span>{option.label}</span>
              <strong>{count}</strong>
            </button>
          );
        })}
      </div>
      <p className="collection-filter-hint" role="status">
        {query.trim() && matching.length === 0
          ? "No matching race."
          : "Most common shown. Search to find the rest."}
      </p>
    </div>
  );
}
