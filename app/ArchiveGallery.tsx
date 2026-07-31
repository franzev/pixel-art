"use client";

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { AutoHideScrollArea } from "./_components/ui/auto-hide-scroll-area";
import {
  DECISION_FILTER_OPTIONS,
  DECISION_QUEUES,
  FAVORITES_STORAGE_KEY,
  FAVORITE_FILTER_OPTIONS,
  GENDER_TAG_GROUP,
  LIFECYCLE_FILTER_OPTIONS,
  RACE_TAG_GROUP,
  RATING_FILTER_OPTIONS,
  TILE_SIZE_STORAGE_KEY,
} from "./_features/archive/archive-config";
import {
  DEFAULT_FILTER_STATE,
  type FilterState,
  activeFilterDimensionCount,
  copyFilterState,
  filterGalleryItems,
  filtersToSearchParams,
  tagFilterOptions,
  tagValueFor,
} from "./_features/archive/archive-filters";
import type {
  ArchiveGalleryProps,
  FilterToken,
} from "./_features/archive/archive-types";
import { RenderGrid } from "./_features/archive/grid/render-grid";
import { MobileRenderViewer } from "./_features/archive/mobile-render-viewer";
import { RenderInspector } from "./_features/archive/render-inspector";
import type { ReviewQueue } from "./_features/review/review-queue";
import { expandGalleryCatalog } from "./gallery-catalog";
import { ReviewDesk } from "./ReviewDesk";
import type { GalleryItem } from "./review-types";
import { useReviewStore } from "./useReviewStore";

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
  const groupName = useId();

  return (
    <fieldset className="filter-group">
      <legend>{label}</legend>
      <div className="filter-list">
        {options.map((option) => (
          <label
            key={option.value}
            className={[
              "filter-choice",
              value === option.value ? "active" : "",
              (counts.get(option.value) ?? 0) === 0 ? "is-empty" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <input
              className="sr-only"
              type="radio"
              name={groupName}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
            <strong>{counts.get(option.value) ?? 0}</strong>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ArchiveGallery({ catalog }: ArchiveGalleryProps) {
  const items = useMemo(() => expandGalleryCatalog(catalog), [catalog]);
  const [query, setQuery] = useState("");
  const [collectionQuery, setCollectionQuery] = useState("");
  const [raceQuery, setRaceQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(() =>
    copyFilterState(DEFAULT_FILTER_STATE),
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tileSize, setTileSize] = useState(152);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewItems, setReviewItems] = useState<GalleryItem[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueue>("unreviewed");
  const [galleryViewport, setGalleryViewport] =
    useState<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const urlRestoredRef = useRef(false);
  const busyRef = useRef(false);
  const viewerRef = useRef<HTMLDialogElement>(null);
  const reviewStore = useReviewStore(items);
  const { reviews } = reviewStore;
  const favoriteIds = useMemo(() => new Set(favorites), [favorites]);
  const galleryViewportRef = useCallback(
    (node: HTMLDivElement | null) => setGalleryViewport(node),
    [],
  );

  useEffect(() => {
    busyRef.current = filtersOpen || reviewOpen;
  }, [filtersOpen, reviewOpen]);

  // Facet counts are conditioned on every OTHER active dimension (plus the
  // search query), so the number next to an option always equals the result
  // of clicking it.
  const conditionedPools = useMemo(() => {
    const pool = (overrides: Partial<FilterState>) =>
      filterGalleryItems(
        items,
        { ...filters, ...overrides },
        favoriteIds,
        reviews,
        query,
      );
    return {
      lifecycle: pool({ lifecycle: "all" }),
      decision: pool({ decision: "all" }),
      rating: pool({ rating: "all" }),
      favorite: pool({ favorite: "all" }),
      gender: pool({ gender: "all" }),
      race: pool({ race: "all" }),
      collections: pool({ collections: [] }),
    };
  }, [favoriteIds, filters, items, query, reviews]);

  const collectionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of conditionedPools.collections) {
      counts.set(item.collection, (counts.get(item.collection) ?? 0) + 1);
    }
    return counts;
  }, [conditionedPools.collections]);

  const decisionCounts = useMemo(() => {
    const pool = conditionedPools.decision;
    const counts = new Map<string, number>([["all", pool.length]]);
    for (const item of pool) {
      const key = reviews[item.renderId]?.decision ?? "unreviewed";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [conditionedPools.decision, reviews]);

  const ratingCounts = useMemo(() => {
    const pool = conditionedPools.rating;
    const counts = new Map<string, number>([["all", pool.length]]);
    for (const item of pool) {
      const overallRating = reviews[item.renderId]?.overallRating;
      const key =
        overallRating === null || overallRating === undefined
          ? "unrated"
          : String(overallRating);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [conditionedPools.rating, reviews]);

  const lifecycleCounts = useMemo(() => {
    const pool = conditionedPools.lifecycle;
    const active = pool.filter((item) => item.status !== "rejected").length;
    return new Map([
      ["active", active],
      ["rejected", pool.length - active],
      ["all", pool.length],
    ]);
  }, [conditionedPools.lifecycle]);

  const favoriteCounts = useMemo(() => {
    const pool = conditionedPools.favorite;
    return new Map([
      ["all", pool.length],
      [
        "favorite",
        pool.filter((item) => favoriteIds.has(item.renderId)).length,
      ],
    ]);
  }, [conditionedPools.favorite, favoriteIds]);

  const genderCounts = useMemo(() => {
    const pool = conditionedPools.gender;
    const counts = new Map<string, number>([["all", pool.length]]);
    for (const item of pool) {
      const key = tagValueFor(item, GENDER_TAG_GROUP);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [conditionedPools.gender]);

  const raceCounts = useMemo(() => {
    const pool = conditionedPools.race;
    const counts = new Map<string, number>([["all", pool.length]]);
    for (const item of pool) {
      const key = tagValueFor(item, RACE_TAG_GROUP);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [conditionedPools.race]);

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
    if (!needle) {
      // Recognition over recall: surface the largest batches before typing.
      return [...collectionOptions]
        .sort(
          (a, b) =>
            (collectionCounts.get(b) ?? 0) - (collectionCounts.get(a) ?? 0),
        )
        .slice(0, 8);
    }
    return collectionOptions
      .filter((name) => name.toLocaleLowerCase().includes(needle))
      .slice(0, 8);
  }, [collectionCounts, collectionOptions, collectionQuery]);

  const matchingRaceOptions = useMemo(() => {
    const needle = raceQuery.trim().toLocaleLowerCase();
    const pool = raceOptions.filter((option) => option.value !== "all");
    if (!needle) {
      return [...pool]
        .sort(
          (a, b) =>
            (raceCounts.get(b.value) ?? 0) - (raceCounts.get(a.value) ?? 0),
        )
        .slice(0, 8);
    }
    return pool
      .filter((option) => option.label.toLocaleLowerCase().includes(needle))
      .slice(0, 8);
  }, [raceCounts, raceOptions, raceQuery]);

  const filteredItems = useMemo(() => {
    return filterGalleryItems(items, filters, favoriteIds, reviews, query);
  }, [favoriteIds, filters, items, query, reviews]);

  const hiddenRejectedCount = useMemo(
    () =>
      filters.lifecycle === "active"
        ? items.filter((item) => item.status === "rejected").length
        : 0,
    [filters.lifecycle, items],
  );

  const selected =
    filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];

  useEffect(() => {
    try {
      const storedSize = Number(
        window.localStorage.getItem(TILE_SIZE_STORAGE_KEY),
      );
      const storedFavorites = JSON.parse(
        window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]",
      ) as unknown;
      const currentRenderIds = new Set(items.map((item) => item.renderId));
      // This is a device-local viewing preference loaded after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedSize >= 116 && storedSize <= 220) setTileSize(storedSize);
      if (Array.isArray(storedFavorites)) {
        const validFavorites = storedFavorites.filter(
          (value): value is string =>
            typeof value === "string" && currentRenderIds.has(value),
        );
        // Favorites are a device-local catalog preference.
        setFavorites(Array.from(new Set(validFavorites)));
      }
    } catch {
      // Browsing preferences are optional.
    }
  }, [items]);

  // Filter state lives in the URL: each narrowed view is bookmarkable and
  // survives reload. Restore once after hydration, then mirror every change.
  useEffect(() => {
    if (urlRestoredRef.current) return;
    urlRestoredRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const next = copyFilterState(DEFAULT_FILTER_STATE);
    const pick = (key: keyof FilterState, allowed: string[]) => {
      const value = params.get(key);
      if (value && allowed.includes(value)) next[key] = value as never;
    };
    pick("lifecycle", ["active", "rejected", "all"]);
    pick("decision", ["all", "unreviewed", "keep", "reject", "delete"]);
    pick("rating", ["all", "5", "4", "3", "2", "1", "unrated"]);
    pick("favorite", ["all", "favorite"]);
    pick(
      "gender",
      genderOptions.map((option) => option.value),
    );
    pick(
      "race",
      raceOptions.map((option) => option.value),
    );
    next.collections = params
      .getAll("c")
      .filter((name) => collectionOptions.includes(name));

    const q = params.get("q") ?? "";
    // Rehydrating browsing state from the URL is a one-time, load-only sync.
    setFilters(next);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setQuery(q);
  }, [collectionOptions, genderOptions, raceOptions]);

  useEffect(() => {
    if (!urlRestoredRef.current) return;
    const params = filtersToSearchParams(filters, query);
    const search = params.toString();
    const nextUrl = search
      ? `${window.location.pathname}?${search}`
      : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [filters, query]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const controller = new AbortController();

    const checkForCatalogUpdate = async () => {
      try {
        const response = await fetch("/api/catalog", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const latest = (await response.json()) as { version?: string };
        if (latest.version && latest.version !== catalog.version) {
          // Filter state survives the reload via the URL, but an open drawer
          // or an in-progress review must not be yanked away; wait for the
          // next tick once the user is idle again.
          if (busyRef.current) return;
          window.location.reload();
        }
      } catch {
        // The dev server may be restarting while the index refreshes.
      }
    };

    const timer = window.setInterval(checkForCatalogUpdate, 2_000);
    void checkForCatalogUpdate();

    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [catalog.version]);

  const clearEverything = () => {
    setFilters(copyFilterState(DEFAULT_FILTER_STATE));
    setQuery("");
    setCollectionQuery("");
    setRaceQuery("");
  };

  const setFilterValue = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const updateQuickFilter = (
    key: "favorite" | "decision" | "rating",
    value: string,
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key] === value ? "all" : value,
    }));
  };

  const toggleCollection = (name: string) => {
    setFilters((current) => ({
      ...current,
      collections: current.collections.includes(name)
        ? current.collections.filter((value) => value !== name)
        : [...current.collections, name],
    }));
  };

  const openFilters = () => {
    setFiltersOpen(true);
  };

  const closeFilters = () => {
    setFiltersOpen(false);
    filterButtonRef.current?.focus();
  };

  const toggleFavorite = (renderId: string) => {
    setFavorites((current) => {
      const next = current.includes(renderId)
        ? current.filter((value) => value !== renderId)
        : [...current, renderId];
      try {
        window.localStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(next),
        );
      } catch {
        // Browsing preferences are optional.
      }
      return next;
    });
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

      if (!isTyping && !reviewOpen && selected) {
        if (
          event.key.toLocaleLowerCase() === "f" &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.repeat
        ) {
          event.preventDefault();
          toggleFavorite(selected.renderId);
        }
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

  const openItem = (item: GalleryItem) => {
    setSelectedId(item.id);
    setReviewQueue(DECISION_QUEUES[filters.decision] ?? "all");
    // Snapshot the current narrowed view: with instant filters, a decision
    // made inside the desk must not eject the render mid-review (losing the
    // What-failed detail step) or reshuffle the queue underfoot.
    setReviewItems(filteredItems);
    setReviewOpen(true);
  };

  const updateTileSize = (event: ChangeEvent<HTMLInputElement>) => {
    const nextSize = Number(event.target.value);
    setTileSize(nextSize);
    try {
      window.localStorage.setItem(TILE_SIZE_STORAGE_KEY, String(nextSize));
    } catch {
      // Browsing preferences are optional.
    }
  };

  const decisionOptions = DECISION_FILTER_OPTIONS;
  const lifecycleOptions = LIFECYCLE_FILTER_OPTIONS;
  const ratingOptions = RATING_FILTER_OPTIONS;
  const favoriteOptions = FAVORITE_FILTER_OPTIONS;

  const labelFor = (
    options: { value: string; label: string }[],
    value: string,
  ) => options.find((option) => option.value === value)?.label ?? value;

  const activeFilterCount = activeFilterDimensionCount(filters);
  const hasFilters = activeFilterCount > 0;

  // The token strip is the single source of truth: every non-default
  // dimension gets a removable token, no exceptions.
  const singleValueToken = (
    key: "decision" | "rating" | "favorite" | "gender" | "race" | "lifecycle",
    label: string,
  ): FilterToken[] =>
    filters[key] !== DEFAULT_FILTER_STATE[key]
      ? [
          {
            id: key,
            label,
            onRemove: () => setFilterValue(key, DEFAULT_FILTER_STATE[key]),
          },
        ]
      : [];
  const filterTokens: FilterToken[] = [
    ...filters.collections.map((name) => ({
      id: `collection:${name}`,
      label: `Collection: ${name}`,
      onRemove: () => toggleCollection(name),
    })),
    ...singleValueToken(
      "favorite",
      "Favorites only",
    ),
    ...singleValueToken(
      "decision",
      `Decision: ${labelFor(decisionOptions, filters.decision)}`,
    ),
    ...singleValueToken(
      "rating",
      `Rating: ${
        filters.rating === "unrated"
          ? "Unrated"
          : `${filters.rating}★`
      }`,
    ),
    ...singleValueToken(
      "gender",
      `Gender: ${labelFor(genderOptions, filters.gender)}`,
    ),
    ...singleValueToken(
      "race",
      `Race: ${labelFor(raceOptions, filters.race)}`,
    ),
    ...singleValueToken(
      "lifecycle",
      `Lifecycle: ${labelFor(lifecycleOptions, filters.lifecycle)}`,
    ),
  ];

  // When the view is empty, find the binding constraint: the single active
  // dimension whose removal frees the most renders.
  const emptyRecovery = (() => {
    if (filteredItems.length > 0) return null;
    const countWith = (overrides: Partial<FilterState>, dropQuery = false) =>
      filterGalleryItems(
        items,
        { ...filters, ...overrides },
        favoriteIds,
        reviews,
        dropQuery ? "" : query,
      ).length;
    const candidates: { label: string; freed: number; loosen: () => void }[] =
      [];
    if (query.trim()) {
      candidates.push({
        label: "SEARCH",
        freed: countWith({}, true),
        loosen: () => setQuery(""),
      });
    }
    if (filters.favorite !== "all") {
      candidates.push({
        label: "FAVORITES",
        freed: countWith({ favorite: "all" }),
        loosen: () => setFilterValue("favorite", "all"),
      });
    }
    if (filters.decision !== "all") {
      candidates.push({
        label: labelFor(decisionOptions, filters.decision).toUpperCase(),
        freed: countWith({ decision: "all" }),
        loosen: () => setFilterValue("decision", "all"),
      });
    }
    if (filters.rating !== "all") {
      candidates.push({
        label:
          filters.rating === "unrated" ? "UNRATED" : `${filters.rating}★`,
        freed: countWith({ rating: "all" }),
        loosen: () => setFilterValue("rating", "all"),
      });
    }
    if (filters.gender !== "all") {
      candidates.push({
        label: labelFor(genderOptions, filters.gender).toUpperCase(),
        freed: countWith({ gender: "all" }),
        loosen: () => setFilterValue("gender", "all"),
      });
    }
    if (filters.race !== "all") {
      candidates.push({
        label: labelFor(raceOptions, filters.race).toUpperCase(),
        freed: countWith({ race: "all" }),
        loosen: () => setFilterValue("race", "all"),
      });
    }
    if (filters.collections.length) {
      candidates.push({
        label:
          filters.collections.length === 1
            ? "COLLECTION"
            : "COLLECTIONS",
        freed: countWith({ collections: [] }),
        loosen: () =>
          setFilters((current) => ({ ...current, collections: [] })),
      });
    }
    if (filters.lifecycle !== "active") {
      candidates.push({
        label: "LIFECYCLE",
        freed: countWith({ lifecycle: "active" }),
        loosen: () => setFilterValue("lifecycle", "active"),
      });
    }
    const best = candidates.reduce<(typeof candidates)[number] | null>(
      (winner, candidate) =>
        candidate.freed > (winner?.freed ?? 0) ? candidate : winner,
      null,
    );
    return best;
  })();
  const gridResetKey = [
    query,
    filters.lifecycle,
    filters.decision,
    filters.rating,
    filters.favorite,
    filters.gender,
    filters.race,
    filters.collections.join("\u0000"),
  ].join("\u0001");

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
            aria-label="Search renders"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, collection, filename…"
          />
          <kbd>/</kbd>
        </label>

        <div className="topbar-actions">
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
        <section className="gallery-browser" aria-label="Render browser">
          <div className="quick-filter-bar">
            <div
              className="quick-filter-scroll"
              role="group"
              aria-label="Quick filters"
            >
              <button
                type="button"
                className={
                  filters.favorite === "favorite"
                    ? "quick-filter is-active"
                    : "quick-filter"
                }
                aria-label="Favorites"
                aria-pressed={filters.favorite === "favorite"}
                onClick={() => updateQuickFilter("favorite", "favorite")}
              >
                <span aria-hidden="true">★</span>
                <span className="quick-favorite-label">FAVORITES</span>
              </button>
              {[
                ["unreviewed", "UNREVIEWED"],
                ["keep", "KEEP"],
                ["reject", "REDO"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={
                    filters.decision === value
                      ? "quick-filter is-active"
                      : "quick-filter"
                  }
                  aria-pressed={filters.decision === value}
                  onClick={() => updateQuickFilter("decision", value)}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                className={
                  filters.rating === "5"
                    ? "quick-filter is-active"
                    : "quick-filter"
                }
                aria-pressed={filters.rating === "5"}
                onClick={() => updateQuickFilter("rating", "5")}
              >
                5★
              </button>
            </div>

            <button
              ref={filterButtonRef}
              className="all-filters-action"
              type="button"
              aria-expanded={filtersOpen}
              aria-controls="archive-filters"
              onClick={() => (filtersOpen ? closeFilters() : openFilters())}
            >
              FILTERS
              {activeFilterCount ? (
                <strong aria-label={`${activeFilterCount} active filters`}>
                  {activeFilterCount}
                </strong>
              ) : null}
            </button>
          </div>

          {filtersOpen ? (
            <section
              id="archive-filters"
              className="filter-drawer"
              aria-label="Filter renders"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.stopPropagation();
                  closeFilters();
                }
              }}
            >
              <AutoHideScrollArea className="filter-drawer-scroll">
                <div className="filter-drawer-columns">
                  <section className="filter-section">
                    <h3>Collections</h3>
                    {filters.collections.length ? (
                      <div
                        className="collection-chips"
                        aria-label="Selected collections"
                      >
                        {filters.collections.map((name) => (
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
                      <span>Find a collection</span>
                      <input
                        type="search"
                        value={collectionQuery}
                        onChange={(event) =>
                          setCollectionQuery(event.target.value)
                        }
                        placeholder={`Search ${collectionOptions.length} collections…`}
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
                        const checked = filters.collections.includes(name);
                        const count = collectionCounts.get(name) ?? 0;
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
                              toggleCollection(name);
                              setCollectionQuery("");
                            }}
                          >
                            <span
                              className="filter-marker"
                              aria-hidden="true"
                            />
                            <span>{name}</span>
                            <strong>{count}</strong>
                          </button>
                        );
                      })}
                    </div>
                    <p className="collection-filter-hint" role="status">
                      {collectionQuery.trim() && matchingCollections.length === 0
                        ? "No matching collection."
                        : collectionQuery.trim()
                          ? "Select more than one collection to compare batches."
                          : "Largest batches shown. Search to find the rest."}
                    </p>
                  </section>

                  <section className="filter-section">
                    <h3>Subject</h3>
                    <FilterGroup
                      label="Gender"
                      value={filters.gender}
                      options={genderOptions}
                      counts={genderCounts}
                      onChange={(gender) => setFilterValue("gender", gender)}
                    />
                    <div className="filter-group race-filter">
                      <span className="filter-group-label" id="race-filter-label">
                        Race
                      </span>
                      {filters.race !== "all" ? (
                        <div
                          className="collection-chips"
                          aria-label="Selected race"
                        >
                          <button
                            type="button"
                            className="collection-chip"
                            onClick={() => setFilterValue("race", "all")}
                            aria-label={`Remove ${labelFor(
                              raceOptions,
                              filters.race,
                            )} race filter`}
                          >
                            <span>{labelFor(raceOptions, filters.race)}</span>
                            <strong aria-hidden="true">×</strong>
                          </button>
                        </div>
                      ) : null}
                      <label className="collection-combobox">
                        <span className="sr-only">Find a race</span>
                        <input
                          type="search"
                          value={raceQuery}
                          onChange={(event) =>
                            setRaceQuery(event.target.value)
                          }
                          placeholder={`Search ${raceOptions.length - 1} races…`}
                          role="combobox"
                          aria-autocomplete="list"
                          aria-expanded={Boolean(raceQuery.trim())}
                          aria-controls="race-options"
                        />
                      </label>
                      <div
                        id="race-options"
                        className="filter-list collection-options"
                        role="radiogroup"
                        aria-labelledby="race-filter-label"
                      >
                        {matchingRaceOptions.map((option) => {
                          const checked = filters.race === option.value;
                          const count = raceCounts.get(option.value) ?? 0;
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
                                setFilterValue(
                                  "race",
                                  checked ? "all" : option.value,
                                );
                                setRaceQuery("");
                              }}
                            >
                              <span
                                className="filter-marker"
                                aria-hidden="true"
                              />
                              <span>{option.label}</span>
                              <strong>{count}</strong>
                            </button>
                          );
                        })}
                      </div>
                      <p className="collection-filter-hint" role="status">
                        {raceQuery.trim() && matchingRaceOptions.length === 0
                          ? "No matching race."
                          : "Most common shown. Search to find the rest."}
                      </p>
                    </div>
                  </section>

                  <section className="filter-section">
                    <h3>Review</h3>
                    <FilterGroup
                      label="Favorites"
                      value={filters.favorite}
                      options={favoriteOptions}
                      counts={favoriteCounts}
                      onChange={(favorite) =>
                        setFilterValue("favorite", favorite)
                      }
                    />
                    <FilterGroup
                      label="Decision"
                      value={filters.decision}
                      options={decisionOptions}
                      counts={decisionCounts}
                      onChange={(decision) =>
                        setFilterValue("decision", decision)
                      }
                    />
                  </section>

                  <section className="filter-section">
                    <h3>Rating &amp; state</h3>
                    <FilterGroup
                      label="Rating"
                      value={filters.rating}
                      options={ratingOptions}
                      counts={ratingCounts}
                      onChange={(rating) => setFilterValue("rating", rating)}
                    />
                    <FilterGroup
                      label="Lifecycle"
                      value={filters.lifecycle}
                      options={lifecycleOptions}
                      counts={lifecycleCounts}
                      onChange={(lifecycle) =>
                        setFilterValue("lifecycle", lifecycle)
                      }
                    />
                  </section>
                </div>
              </AutoHideScrollArea>

              <div className="filter-drawer-footer">
                <button
                  type="button"
                  onClick={clearEverything}
                  disabled={!hasFilters && !query.trim()}
                >
                  CLEAR ALL
                </button>
                <span className="filter-drawer-count">
                  SHOWING {filteredItems.length} RENDERS
                </span>
                <button
                  className="filter-drawer-done"
                  type="button"
                  onClick={closeFilters}
                >
                  DONE
                </button>
              </div>
            </section>
          ) : null}

          <div className="active-filter-strip" aria-label="Active filters">
            {filterTokens.length ? (
              filterTokens.map((token) => (
                <button
                  key={token.id}
                  type="button"
                  onClick={token.onRemove}
                  aria-label={`Remove ${token.label} filter`}
                >
                  <span>{token.label}</span>
                  <strong aria-hidden="true">×</strong>
                </button>
              ))
            ) : (
              <span className="shortcut-hint">
                F TO FAVORITE · ← → TO NAVIGATE · / TO SEARCH
              </span>
            )}
          </div>

          <AutoHideScrollArea
            className="gallery-scroll-area"
            viewportRef={galleryViewportRef}
          >
            <main className="gallery-region">
              <div className="gallery-heading">
                <div>
                  <span className="eyebrow">CONTACT SHEET</span>
                  <p>
                    {filteredItems.length} OF {items.length} RENDERS
                    {hiddenRejectedCount ? (
                      <span className="heading-note">
                        {" "}
                        · {hiddenRejectedCount} REJECTED HIDDEN
                      </span>
                    ) : null}
                  </p>
                </div>
                <p className="sr-only" role="status">
                  Showing {filteredItems.length} of {items.length} renders
                </p>
                {hasFilters || query.trim() ? (
                  <button type="button" onClick={clearEverything}>
                    {hasFilters && query.trim()
                      ? "CLEAR FILTERS & SEARCH"
                      : hasFilters
                        ? "CLEAR FILTERS"
                        : "CLEAR SEARCH"}
                  </button>
                ) : null}
              </div>

              {filteredItems.length ? (
                <RenderGrid
                  items={filteredItems}
                  selectedId={selected?.id}
                  tileSize={tileSize}
                  scrollElement={galleryViewport}
                  resetKey={gridResetKey}
                  onOpen={openItem}
                />
              ) : (
                <div id="render-grid" className="empty-state">
                  {filters.favorite === "favorite" &&
                  activeFilterCount === 1 &&
                  !query.trim() ? (
                    <>
                      <span>NO FAVORITES</span>
                      <h2>No favorites in this drawer.</h2>
                      <p>
                        <span className="pointer-fine-only">
                          Select a render and press F to add it to favorites.
                        </span>
                        <span className="pointer-coarse-only">
                          Open a render and tap the star to favorite it.
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setFilterValue("favorite", "all")}
                      >
                        SHOW ALL RENDERS
                      </button>
                    </>
                  ) : emptyRecovery && emptyRecovery.freed > 0 ? (
                    <>
                      <span>NO MATCHES</span>
                      <h2>Nothing in this drawer.</h2>
                      <p>
                        The {emptyRecovery.label} filter is emptying this
                        view.
                      </p>
                      <button type="button" onClick={emptyRecovery.loosen}>
                        DROP {emptyRecovery.label} · SHOW{" "}
                        {emptyRecovery.freed} RENDERS
                      </button>
                      <button
                        type="button"
                        className="empty-state-secondary"
                        onClick={clearEverything}
                      >
                        CLEAR ALL
                      </button>
                    </>
                  ) : (
                    <>
                      <span>NO MATCHES</span>
                      <h2>Nothing in this drawer.</h2>
                      <p>
                        No single filter frees this view. Clear everything
                        and start again.
                      </p>
                      <button type="button" onClick={clearEverything}>
                        CLEAR ALL
                      </button>
                    </>
                  )}
                </div>
              )}
            </main>
          </AutoHideScrollArea>
        </section>

        <aside
          className="desktop-inspector"
          aria-label="Selected render details"
        >
          <AutoHideScrollArea>
            <RenderInspector
              item={selected}
              review={selected ? reviews[selected.renderId] : undefined}
              isFavorite={
                selected ? favoriteIds.has(selected.renderId) : false
              }
              onPrevious={() => moveSelection(-1)}
              onNext={() => moveSelection(1)}
              onToggleFavorite={
                selected
                  ? () => toggleFavorite(selected.renderId)
                  : undefined
              }
              onEdit={selected ? () => openItem(selected) : undefined}
            />
            <div className="library-note">
              <span>LIBRARY</span>
              <strong>{items.length}</strong>
              <p>Reference renders indexed from the working repository.</p>
            </div>
          </AutoHideScrollArea>
        </aside>
      </div>

      <MobileRenderViewer
        viewerRef={viewerRef}
        item={selected}
        review={selected ? reviews[selected.renderId] : undefined}
        isFavorite={selected ? favoriteIds.has(selected.renderId) : false}
        onPrevious={() => moveSelection(-1)}
        onNext={() => moveSelection(1)}
        onToggleFavorite={
          selected ? () => toggleFavorite(selected.renderId) : undefined
        }
        onEdit={selected ? () => openItem(selected) : undefined}
        onClose={() => viewerRef.current?.close()}
      />

      {reviewOpen ? (
        <ReviewDesk
          items={reviewItems}
          store={reviewStore}
          initialRenderId={selected?.renderId}
          initialQueue={reviewQueue}
          onClose={() => setReviewOpen(false)}
        />
      ) : null}
    </div>
  );
}
