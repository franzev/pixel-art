"use client";

import {
  parseRatingFilter,
  serializeRatingFilter,
  type RatingFilterMode,
  type RatingValue,
} from "../archive-filters";

const exactValues: RatingValue[] = ["5", "4", "3", "2", "1", "unrated"];
const numericValues: RatingValue[] = ["5", "4", "3", "2", "1"];

export function RatingFilter({
  value,
  counts,
  onChange,
}: {
  value: string;
  counts: Map<string, number>;
  onChange: (value: string) => void;
}) {
  const filter = parseRatingFilter(value);
  const mode: RatingFilterMode = filter.mode;
  const selectedExactValues =
    filter.mode === "exact" ? filter.values : [];
  const selectedThreshold =
    filter.mode === "greater" || filter.mode === "less"
      ? filter.threshold
      : 3;

  const setMode = (nextMode: RatingFilterMode) => {
    if (nextMode === "all") {
      onChange("all");
      return;
    }
    if (nextMode === "exact") {
      onChange(serializeRatingFilter({ mode: "exact", values: ["5"] }));
      return;
    }
    onChange(
      serializeRatingFilter({
        mode: nextMode,
        threshold: filter.mode === nextMode ? filter.threshold : 3,
      }),
    );
  };

  const toggleExactValue = (rating: RatingValue) => {
    const selected = new Set(
      filter.mode === "exact" ? filter.values : [],
    );
    if (selected.has(rating)) selected.delete(rating);
    else selected.add(rating);
    onChange(
      serializeRatingFilter({
        mode: "exact",
        values: exactValues.filter((entry) => selected.has(entry)),
      }),
    );
  };

  const setThreshold = (threshold: number) => {
    if (mode !== "greater" && mode !== "less") return;
    onChange(serializeRatingFilter({ mode, threshold }));
  };

  return (
    <fieldset className="filter-group rating-filter">
      <legend className="sr-only">Rating</legend>
      <label className="rating-filter-mode">
        <span>Match</span>
        <select
          aria-label="Rating comparison"
          value={mode}
          onChange={(event) => setMode(event.target.value as RatingFilterMode)}
        >
          <option value="all">Any rating</option>
          <option value="exact">Exact ratings</option>
          <option value="greater">Greater than</option>
          <option value="less">Less than</option>
        </select>
      </label>

      {mode === "exact" ? (
        <div className="filter-list" aria-label="Exact ratings">
          {exactValues.map((rating) => (
            <label
              key={rating}
              className={[
                "filter-choice",
                selectedExactValues.includes(rating) ? "active" : "",
                (counts.get(rating) ?? 0) === 0 ? "is-empty" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <input
                className="sr-only"
                type="checkbox"
                checked={selectedExactValues.includes(rating)}
                onChange={() => toggleExactValue(rating)}
              />
              <span>{rating === "unrated" ? "Unrated" : `${rating}★`}</span>
              <strong>{counts.get(rating) ?? 0}</strong>
            </label>
          ))}
        </div>
      ) : null}

      {mode === "greater" || mode === "less" ? (
        <div className="filter-list" aria-label="Rating threshold">
          {numericValues.map((rating) => {
            const threshold = Number(rating);
            const selected = selectedThreshold === threshold;
            return (
              <label
                key={rating}
                className={["filter-choice", selected ? "active" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name={`rating-${mode}`}
                  value={rating}
                  checked={selected}
                  onChange={() => setThreshold(threshold)}
                />
                <span>
                  {mode === "greater" ? ">" : "<"} {rating}★
                </span>
                <strong>{mode === "greater" ? "up" : "down"}</strong>
              </label>
            );
          })}
        </div>
      ) : null}
    </fieldset>
  );
}
