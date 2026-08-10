"use client";

import { raceFilterValues } from "../archive-filters";

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
  const selectedValues = raceFilterValues(value);
  const selectedValueSet = new Set(selectedValues);
  const remove = (race: string) => {
    const remaining = selectedValues.filter((value) => value !== race);
    onChange(remaining.length ? remaining.join(",") : "all");
  };
  const labelFor = (race: string) =>
    matching.find((option) => option.value === race)?.label ??
    (selectedValues.length === 1 ? selectedLabel : race);
  const visibleOptions = query.trim()
    ? matching.filter((option) =>
        option.label
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
      )
    : matching;

  return (
    <div className="filter-group race-filter">
      <span className="filter-group-label" id="race-filter-label">
        Race
      </span>
      {selectedValues.length ? (
        <div className="collection-chips" aria-label="Selected races">
          {selectedValues.map((race) => {
            const label = labelFor(race);
            return (
              <button
                key={race}
                type="button"
                className="collection-chip"
                onClick={() => remove(race)}
                aria-label={`Remove ${label} race filter`}
              >
                <span>{label}</span>
                <strong aria-hidden="true">×</strong>
              </button>
            );
          })}
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
        role="group"
        aria-labelledby="race-filter-label"
      >
        {visibleOptions.map((option) => {
          const checked = selectedValueSet.has(option.value);
          const count = counts.get(option.value) ?? 0;
          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={checked}
              className={[
                "filter-row",
                checked ? "active" : "",
                count === 0 ? "is-empty" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                const next = checked
                  ? selectedValues.filter((value) => value !== option.value)
                  : [...selectedValues, option.value];
                onChange(next.length ? next.join(",") : "all");
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
        {query.trim() && visibleOptions.length === 0
          ? "No matching race."
          : selectedValues.length > 1
            ? `${selectedValues.length} races selected.`
            : "Most common shown. Search to find the rest."}
      </p>
    </div>
  );
}
