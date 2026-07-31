"use client";

export function CollectionFilter({
  selectedCollections,
  query,
  onQueryChange,
  totalCount,
  matching,
  counts,
  onToggle,
}: {
  selectedCollections: string[];
  query: string;
  onQueryChange: (value: string) => void;
  totalCount: number;
  matching: string[];
  counts: Map<string, number>;
  onToggle: (name: string) => void;
}) {
  return (
    <>
      {selectedCollections.length ? (
        <div className="collection-chips" aria-label="Selected collections">
          {selectedCollections.map((name) => (
            <button
              key={name}
              type="button"
              className="collection-chip"
              onClick={() => onToggle(name)}
              aria-label={`Remove ${name} collection filter`}
            >
              <span>{name}</span>
              <strong aria-hidden="true">×</strong>
            </button>
          ))}
        </div>
      ) : null}
      <label className="collection-combobox">
        <span>Find a collection</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={`Search ${totalCount} collections…`}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={Boolean(query.trim())}
          aria-controls="collection-options"
        />
      </label>
      <div
        id="collection-options"
        className="filter-list collection-options"
        role="group"
        aria-label="Matching collections"
      >
        {matching.map((name) => {
          const checked = selectedCollections.includes(name);
          const count = counts.get(name) ?? 0;
          return (
            <button
              key={name}
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
                onToggle(name);
                onQueryChange("");
              }}
            >
              <span className="filter-marker" aria-hidden="true" />
              <span>{name}</span>
              <strong>{count}</strong>
            </button>
          );
        })}
      </div>
      <p className="collection-filter-hint" role="status">
        {query.trim() && matching.length === 0
          ? "No matching collection."
          : query.trim()
            ? "Select more than one collection to compare batches."
            : "Largest batches shown. Search to find the rest."}
      </p>
    </>
  );
}
