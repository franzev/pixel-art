"use client";

import {
  type CSSProperties,
  type ChangeEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ReviewDesk, type ReviewQueue } from "./ReviewDesk";
import type {
  ArtItem,
  RenderReview,
  ReviewDecision,
} from "./review-types";
import { useReviewStore } from "./useReviewStore";

type ArchiveGalleryProps = {
  items: ArtItem[];
};

const CATEGORY_LABELS: Record<string, string> = {
  enemies: "Enemies",
  bosses: "Bosses",
  angels: "Angels",
  protagonist: "Protagonist",
  environments: "Environments",
};

const DECISION_LABELS: Record<ReviewDecision, string> = {
  keep: "Keep",
  reject: "Reject · redo",
  delete: "Delete queue",
};

const DECISION_QUEUES: Record<string, ReviewQueue> = {
  all: "all",
  unreviewed: "unreviewed",
  keep: "kept",
  reject: "rejected",
  delete: "deletion",
};

const GENDER_TAG_GROUP = "gender-presentation";
const RACE_TAG_GROUP = "body-plan";

function tagValueFor(item: ArtItem, group: string) {
  const tag = item.suggestedTags.find((entry) => entry.group === group);
  return tag ? tag.key.slice(group.length + 1) : "untagged";
}

function tagFilterOptions(items: ArtItem[], group: string, allLabel: string) {
  const labels = new Map<string, string>();
  for (const item of items) {
    for (const tag of item.suggestedTags) {
      if (tag.group === group) {
        labels.set(tag.key.slice(group.length + 1), tag.label);
      }
    }
  }
  return [
    { value: "all", label: allLabel },
    ...Array.from(labels, ([value, label]) => ({ value, label })).sort((a, b) =>
      a.label.localeCompare(b.label),
    ),
    { value: "untagged", label: "Untagged" },
  ];
}

function Inspector({
  item,
  review,
  onPrevious,
  onNext,
  onEdit,
  onClose,
  compact = false,
}: {
  item?: ArtItem;
  review?: RenderReview;
  onPrevious: () => void;
  onNext: () => void;
  onEdit?: () => void;
  onClose?: () => void;
  compact?: boolean;
}) {
  if (!item) {
    return (
      <div className="inspector-empty">
        <span>SELECT A RENDER</span>
        <p>Choose any tile to inspect its repository details.</p>
      </div>
    );
  }

  return (
    <div className={compact ? "inspector-content compact" : "inspector-content"}>
      <div className="inspector-toolbar">
        <div>
          <span className="eyebrow">SELECTED RENDER</span>
          <h2>{item.name}</h2>
        </div>
        {onClose ? (
          <button
            className="square-action"
            type="button"
            onClick={onClose}
            aria-label="Close render viewer"
          >
            CLOSE
          </button>
        ) : null}
      </div>

      <div className="inspector-art">
        <img
          src={item.sourceUrl ?? item.url}
          data-res={item.sourceUrl ? "high" : undefined}
          alt={item.name}
        />
      </div>

      <div className="inspector-nav" aria-label="Render navigation">
        <button type="button" onClick={onPrevious}>
          ← PREVIOUS
        </button>
        <button type="button" onClick={onNext}>
          NEXT →
        </button>
      </div>

      <dl className="metadata-list">
        <div>
          <dt>Category</dt>
          <dd>{CATEGORY_LABELS[item.category] ?? item.category}</dd>
        </div>
        <div>
          <dt>Collection</dt>
          <dd>{item.collection}</dd>
        </div>
        <div>
          <dt>Dimensions</dt>
          <dd>
            {item.width} × {item.height}
          </dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{item.sourceAvailable ? "Preserved locally" : "Reference only"}</dd>
        </div>
        <div>
          <dt>Decision</dt>
          <dd>
            {review?.decision ? DECISION_LABELS[review.decision] : "Unreviewed"}
          </dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{review?.overallRating ? `${review.overallRating} / 5` : "—"}</dd>
        </div>
      </dl>

      {review?.note || review?.correctionNote ? (
        <div className="inspector-feedback">
          {review.note ? (
            <div>
              <span>FEEDBACK</span>
              <p>{review.note}</p>
            </div>
          ) : null}
          {review.correctionNote ? (
            <div>
              <span>NEXT ATTEMPT</span>
              <p>{review.correctionNote}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {onEdit ? (
        <div className="inspector-review-action">
          <button type="button" onClick={onEdit}>
            {review?.decision ? "EDIT REVIEW" : "REVIEW THIS RENDER"}
          </button>
        </div>
      ) : null}

      <div className="filename-block">
        <span>FILE</span>
        <code>{item.filename}</code>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  value,
  options,
  counts,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  counts: Map<string, number>;
  onChange: (value: string) => void;
}) {
  return (
    <section className="filter-group">
      <h3>{label}</h3>
      <div className="filter-list">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={value === option.value ? "filter-row active" : "filter-row"}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            <span className="filter-marker" />
            <span>{option.label}</span>
            <strong>{counts.get(option.value) ?? 0}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

export function ArchiveGallery({ items }: ArchiveGalleryProps) {
  const [query, setQuery] = useState("");
  const [collectionQuery, setCollectionQuery] = useState("");
  const [decision, setDecision] = useState("all");
  const [gender, setGender] = useState("all");
  const [race, setRace] = useState("all");
  const [collections, setCollections] = useState<string[]>([]);
  const [tileSize, setTileSize] = useState(152);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueue>("unreviewed");
  const searchRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLDialogElement>(null);
  const reviewStore = useReviewStore(items);
  const { reviews } = reviewStore;

  const collectionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      counts.set(item.collection, (counts.get(item.collection) ?? 0) + 1);
    }
    return counts;
  }, [items]);

  const decisionCounts = useMemo(() => {
    const counts = new Map<string, number>([["all", items.length]]);
    for (const item of items) {
      const key = reviews[item.renderId]?.decision ?? "unreviewed";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [items, reviews]);

  const genderCounts = useMemo(() => {
    const counts = new Map<string, number>([["all", items.length]]);
    for (const item of items) {
      const key = tagValueFor(item, GENDER_TAG_GROUP);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [items]);

  const raceCounts = useMemo(() => {
    const counts = new Map<string, number>([["all", items.length]]);
    for (const item of items) {
      const key = tagValueFor(item, RACE_TAG_GROUP);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [items]);

  const genderOptions = useMemo(
    () => tagFilterOptions(items, GENDER_TAG_GROUP, "All genders"),
    [items],
  );

  const raceOptions = useMemo(
    () => tagFilterOptions(items, RACE_TAG_GROUP, "All races"),
    [items],
  );

  const collectionOptions = useMemo(
    () =>
      Array.from(new Set(items.map((item) => item.collection))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [items],
  );

  const matchingCollections = useMemo(() => {
    const needle = collectionQuery.trim().toLocaleLowerCase();
    if (!needle) return [];
    return collectionOptions
      .filter((name) => name.toLocaleLowerCase().includes(needle))
      .slice(0, 8);
  }, [collectionOptions, collectionQuery]);

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return items.filter((item) => {
      if (collections.length && !collections.includes(item.collection))
        return false;
      if (gender !== "all" && tagValueFor(item, GENDER_TAG_GROUP) !== gender)
        return false;
      if (race !== "all" && tagValueFor(item, RACE_TAG_GROUP) !== race)
        return false;
      if (decision !== "all") {
        const reviewed = reviews[item.renderId]?.decision ?? "unreviewed";
        if (reviewed !== decision) return false;
      }
      if (!needle) return true;
      return [
        item.name,
        item.filename,
        item.category,
        item.collection,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(needle);
    });
  }, [collections, decision, gender, items, query, race, reviews]);

  const selected =
    filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];

  useEffect(() => {
    try {
      const storedSize = Number(window.localStorage.getItem("archive-tile-size"));
      // This is a device-local viewing preference loaded after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedSize >= 116 && storedSize <= 220) setTileSize(storedSize);
    } catch {
      // Browsing preferences are optional.
    }
  }, []);

  const resetFilters = () => {
    setQuery("");
    setCollectionQuery("");
    setDecision("all");
    setGender("all");
    setRace("all");
    setCollections([]);
  };

  const toggleCollection = (name: string) => {
    setCollections((current) =>
      current.includes(name)
        ? current.filter((value) => value !== name)
        : [...current, name],
    );
  };

  const moveSelection = (direction: -1 | 1) => {
    if (!selected || filteredItems.length < 2) return;
    const index = filteredItems.findIndex((item) => item.id === selected.id);
    const nextIndex =
      (index + direction + filteredItems.length) % filteredItems.length;
    setSelectedId(filteredItems[nextIndex].id);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "SELECT" ||
        target?.tagName === "TEXTAREA";

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (!isTyping && selected) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          moveSelection(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          moveSelection(1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const openItem = (item: ArtItem) => {
    setSelectedId(item.id);
    setReviewQueue(DECISION_QUEUES[decision] ?? "all");
    setReviewOpen(true);
  };

  const updateTileSize = (event: ChangeEvent<HTMLInputElement>) => {
    const nextSize = Number(event.target.value);
    setTileSize(nextSize);
    try {
      window.localStorage.setItem("archive-tile-size", String(nextSize));
    } catch {
      // Browsing preferences are optional.
    }
  };

  const decisionOptions = [
    { value: "all", label: "All decisions" },
    { value: "unreviewed", label: "Unreviewed" },
    { value: "keep", label: "Keep" },
    { value: "reject", label: "Reject · redo" },
    { value: "delete", label: "Delete queue" },
  ];

  const hasFilters =
    query ||
    decision !== "all" ||
    gender !== "all" ||
    race !== "all" ||
    collections.length > 0;

  return (
    <div className="archive-app">
      <a className="skip-link" href="#render-grid">
        Skip to render grid
      </a>

      <header className="topbar">
        <div className="brand-lockup">
          <div>
            <h1>THE ASHEN ARCHIVE</h1>
            <p>PRIVATE RENDER INDEX</p>
          </div>
        </div>

        <label className="search-field">
          <span className="sr-only">Search renders</span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, collection, filename…"
          />
          <kbd>/</kbd>
        </label>

        <div className="topbar-actions">
          <button
            className="utility-action review-launch"
            type="button"
            onClick={() => {
              setReviewQueue("unreviewed");
              setReviewOpen(true);
            }}
          >
            REVIEW
          </button>
          <button
            className="utility-action filter-toggle"
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="archive-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            FILTERS
          </button>
          <label className="grid-control">
            <span>GRID</span>
            <input
              type="range"
              min="116"
              max="220"
              step="8"
              value={tileSize}
              onChange={updateTileSize}
              aria-label="Gallery tile size"
            />
          </label>
        </div>
      </header>

      <div className="archive-shell">
        {filtersOpen ? (
          <button
            className="filter-backdrop"
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
        ) : null}

        <aside
          id="archive-filters"
          className={filtersOpen ? "filter-panel is-open" : "filter-panel"}
        >
          <div className="panel-heading">
            <span>FILTERS</span>
            <button type="button" onClick={resetFilters} disabled={!hasFilters}>
              CLEAR
            </button>
          </div>

          <section className="filter-group">
            <h3>Collections</h3>
            {collections.length ? (
              <div className="collection-chips" aria-label="Selected collections">
                {collections.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="collection-chip"
                    onClick={() => toggleCollection(name)}
                    aria-label={`Remove ${name} collection filter`}
                  >
                    <span>{name}</span>
                    <strong aria-hidden="true">×</strong>
                  </button>
                ))}
              </div>
            ) : null}
            <label className="collection-combobox">
              <span className="sr-only">Find a collection</span>
              <input
                type="search"
                value={collectionQuery}
                onChange={(event) => setCollectionQuery(event.target.value)}
                placeholder="Find collection…"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={Boolean(collectionQuery.trim())}
                aria-controls="collection-options"
              />
            </label>
            <div
              id="collection-options"
              className="filter-list collection-options"
              role="group"
              aria-label="Matching collections"
            >
              {matchingCollections.map((name) => {
                const checked = collections.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    className={checked ? "filter-row active" : "filter-row"}
                    onClick={() => {
                      toggleCollection(name);
                      setCollectionQuery("");
                    }}
                  >
                    <span className="filter-marker" />
                    <span>{name}</span>
                    <strong>{collectionCounts.get(name) ?? 0}</strong>
                  </button>
                );
              })}
            </div>
            {!collectionQuery.trim() ? (
              <p className="collection-filter-hint">
                Type to search {collectionOptions.length} collections.
              </p>
            ) : matchingCollections.length === 0 ? (
              <p className="collection-filter-hint">No matching collection.</p>
            ) : null}
          </section>

          <FilterGroup
            label="Gender"
            value={gender}
            options={genderOptions}
            counts={genderCounts}
            onChange={setGender}
          />

          <FilterGroup
            label="Race"
            value={race}
            options={raceOptions}
            counts={raceCounts}
            onChange={setRace}
          />

          <FilterGroup
            label="Decision"
            value={decision}
            options={decisionOptions}
            counts={decisionCounts}
            onChange={setDecision}
          />

        </aside>

        <main className="gallery-region">
          <div className="gallery-heading">
            <div>
              <span className="eyebrow">CONTACT SHEET</span>
              <p>
                {filteredItems.length} OF {items.length} RENDERS
              </p>
            </div>
            {hasFilters ? (
              <button type="button" onClick={resetFilters}>
                RESET VIEW
              </button>
            ) : (
              <span className="shortcut-hint">← → TO NAVIGATE</span>
            )}
          </div>

          {filteredItems.length ? (
            <div
              id="render-grid"
              className="render-grid"
              style={{ "--tile-size": `${tileSize}px` } as CSSProperties}
            >
              {filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    selected?.id === item.id
                      ? "render-tile is-selected"
                      : "render-tile"
                  }
                  aria-pressed={selected?.id === item.id}
                  onClick={() => openItem(item)}
                >
                  <div className="render-image">
                    <span className="render-number">
                      {String(index + 1).padStart(3, "0")}
                    </span>
                    <img
                      src={item.sourceUrl ?? item.url}
                      data-res={item.sourceUrl ? "high" : undefined}
                      alt=""
                      loading={index < 18 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                  <span className="render-title">{item.name}</span>
                  <span className="render-meta">
                    {item.collection} · {item.width}×{item.height}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div id="render-grid" className="empty-state">
              <span>NO MATCHES</span>
              <h2>Nothing in this drawer.</h2>
              <p>Clear the active filters or try a shorter search.</p>
              <button type="button" onClick={resetFilters}>
                RESET FILTERS
              </button>
            </div>
          )}
        </main>

        <aside className="desktop-inspector" aria-label="Selected render details">
          <Inspector
            item={selected}
            review={selected ? reviews[selected.renderId] : undefined}
            onPrevious={() => moveSelection(-1)}
            onNext={() => moveSelection(1)}
            onEdit={selected ? () => openItem(selected) : undefined}
          />
        </aside>
      </div>

      <div className="library-note">
        <span>LIBRARY</span>
        <strong>{items.length}</strong>
        <p>Reference renders indexed from the working repository.</p>
      </div>

      <dialog
        className="mobile-viewer"
        ref={viewerRef as RefObject<HTMLDialogElement>}
        aria-label="Render viewer"
      >
        <Inspector
          compact
          item={selected}
          review={selected ? reviews[selected.renderId] : undefined}
          onPrevious={() => moveSelection(-1)}
          onNext={() => moveSelection(1)}
          onEdit={selected ? () => openItem(selected) : undefined}
          onClose={() => viewerRef.current?.close()}
        />
      </dialog>

      {reviewOpen ? (
        <ReviewDesk
          items={items}
          store={reviewStore}
          initialRenderId={selected?.renderId}
          initialQueue={reviewQueue}
          onClose={() => setReviewOpen(false)}
        />
      ) : null}
    </div>
  );
}
