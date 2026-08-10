"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GalleryItem, ReviewMap } from "../../../review-types";
import {
  DECISION_FILTER_OPTIONS,
  GENDER_TAG_GROUP,
  LIFECYCLE_FILTER_OPTIONS,
  RACE_TAG_GROUP,
} from "../archive-config";
import {
  DEFAULT_FILTER_STATE,
  type FilterState,
  activeFilterDimensionCount,
  copyFilterState,
  filterGalleryItems,
  filtersToSearchParams,
  parseRatingFilter,
  raceFilterValues,
  ratingFilterLabel,
  timeFilterLabel,
  tagFilterOptions,
  tagValueFor,
} from "../archive-filters";
import { SAVED_TIME_PRESETS } from "../saved-time";
import type { EmptyRecoveryCandidate, FilterToken } from "../archive-types";
import { isRedoAwaitingGeneration } from "../review-summary";

function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function useGalleryFilters(
  items: GalleryItem[],
  favoriteIds: Set<string>,
  reviews: ReviewMap,
  completedRedoRenderIds: ReadonlySet<string>,
) {
  const [query, setQuery] = useState("");
  const [collectionQuery, setCollectionQuery] = useState("");
  const [raceQuery, setRaceQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(() =>
    copyFilterState(DEFAULT_FILTER_STATE),
  );
  const [timeAnchor, setTimeAnchor] = useState(() => Date.now());
  const urlRestoredRef = useRef(false);

  useEffect(() => {
    if (
      filters.generatedTime === "all" &&
      filters.reviewedTime === "all"
    )
      return;
    const interval = window.setInterval(() => setTimeAnchor(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, [filters.generatedTime, filters.reviewedTime]);

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
        timeAnchor,
        completedRedoRenderIds,
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
  }, [
    completedRedoRenderIds,
    favoriteIds,
    filters,
    items,
    query,
    reviews,
    timeAnchor,
  ]);

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
      const decision = reviews[item.renderId]?.decision;
      const key = decision ?? "unreviewed";
      counts.set(key, (counts.get(key) ?? 0) + 1);
      if (isRedoAwaitingGeneration(
        item,
        reviews[item.renderId],
        completedRedoRenderIds,
      )) {
        counts.set("redo-pending", (counts.get("redo-pending") ?? 0) + 1);
      }
    }
    return counts;
  }, [completedRedoRenderIds, conditionedPools.decision, reviews]);

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
    const selectedValues = new Set(raceFilterValues(filters.race));
    const selected = pool.filter((option) => selectedValues.has(option.value));
    const withSelected = (options: typeof pool) => [
      ...selected,
      ...options.filter((option) => !selectedValues.has(option.value)),
    ];
    if (!needle) {
      return withSelected(
        [...pool]
          .sort(
            (a, b) =>
              (raceCounts.get(b.value) ?? 0) - (raceCounts.get(a.value) ?? 0),
          )
          .slice(0, 8),
      );
    }
    return withSelected(
      pool
        .filter((option) => option.label.toLocaleLowerCase().includes(needle))
        .slice(0, 8),
    );
  }, [filters.race, raceCounts, raceOptions, raceQuery]);

  const filteredItems = useMemo(() => {
    return filterGalleryItems(
      items,
      filters,
      favoriteIds,
      reviews,
      query,
      timeAnchor,
      completedRedoRenderIds,
    );
  }, [
    completedRedoRenderIds,
    favoriteIds,
    filters,
    items,
    query,
    reviews,
    timeAnchor,
  ]);

  const hiddenRejectedCount = useMemo(
    () =>
      filters.lifecycle === "active"
        ? items.filter((item) => item.status === "rejected").length
        : 0,
    [filters.lifecycle, items],
  );

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
    pick("decision", [
      "all",
      "unreviewed",
      "keep",
      "reject",
      "redo-pending",
      "delete",
    ]);
    // A Redo decision can outlive the source's active lifecycle. Restore the
    // complete browseable Redo set instead of silently hiding rejected sources.
    if (["reject", "redo-pending"].includes(next.decision)) {
      next.lifecycle = "all";
    }
    const rating = params.get("rating");
    if (rating && parseRatingFilter(rating).mode !== "all") {
      next.rating = rating;
    }
    pick("favorite", ["all", "favorite"]);
    pick(
      "gender",
      genderOptions.map((option) => option.value),
    );
    const allowedRaces = new Set(
      raceOptions
        .filter((option) => option.value !== "all")
        .map((option) => option.value),
    );
    const restoredRaces = raceFilterValues(params.get("race") ?? "").filter(
      (value) => allowedRaces.has(value),
    );
    if (restoredRaces.length) next.race = restoredRaces.join(",");
    const timePresetValues = SAVED_TIME_PRESETS.map((preset) => preset.value);
    pick("generatedTime", timePresetValues);
    pick("reviewedTime", timePresetValues);
    // Older bookmarked galleries used savedTime for the generated timestamp.
    if (next.generatedTime === "all") {
      const legacyGeneratedTime = params.get("savedTime");
      if (
        legacyGeneratedTime &&
        timePresetValues.includes(
          legacyGeneratedTime as (typeof timePresetValues)[number],
        )
      ) {
        next.generatedTime = legacyGeneratedTime;
      }
    }
    const localDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    const restoreRange = (
      timeKey: "generatedTime" | "reviewedTime",
      fromKey: "generatedFrom" | "reviewedFrom",
      toKey: "generatedTo" | "reviewedTo",
      legacy = false,
    ) => {
      if (next[timeKey] !== "custom") return;
      const from =
        params.get(fromKey) ?? (legacy ? params.get("savedFrom") : "") ?? "";
      const to =
        params.get(toKey) ?? (legacy ? params.get("savedTo") : "") ?? "";
      if (localDateTime.test(from)) next[fromKey] = from;
      if (localDateTime.test(to)) next[toKey] = to;
    };
    restoreRange(
      "generatedTime",
      "generatedFrom",
      "generatedTo",
      true,
    );
    restoreRange("reviewedTime", "reviewedFrom", "reviewedTo");
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

  const activeFilterCount = activeFilterDimensionCount(filters);
  const hasFilters = activeFilterCount > 0;

  // The token strip is the single source of truth: every non-default
  // dimension gets a removable token, no exceptions.
  const singleValueToken = (
    key:
      | "decision"
      | "rating"
      | "favorite"
      | "gender"
      | "race"
      | "lifecycle",
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
    ...singleValueToken("favorite", "Favorites only"),
    ...singleValueToken(
      "decision",
      `Decision: ${labelFor(DECISION_FILTER_OPTIONS, filters.decision)}`,
    ),
    ...singleValueToken(
      "rating",
      `Rating: ${ratingFilterLabel(filters.rating)}`,
    ),
    ...(filters.generatedTime !== "all"
      ? [
          {
            id: "generatedTime",
            label: `Generated: ${timeFilterLabel(
              filters.generatedTime,
              filters.generatedFrom,
              filters.generatedTo,
            )}`,
            onRemove: () => setFilterValue("generatedTime", "all"),
          },
        ]
      : []),
    ...(filters.reviewedTime !== "all"
      ? [
          {
            id: "reviewedTime",
            label: `Reviewed: ${timeFilterLabel(
              filters.reviewedTime,
              filters.reviewedFrom,
              filters.reviewedTo,
            )}`,
            onRemove: () => setFilterValue("reviewedTime", "all"),
          },
        ]
      : []),
    ...singleValueToken(
      "gender",
      `Gender: ${labelFor(genderOptions, filters.gender)}`,
    ),
    ...raceFilterValues(filters.race).map((race) => ({
      id: `race:${race}`,
      label: `Race: ${labelFor(raceOptions, race)}`,
      onRemove: () =>
        setFilters((current) => {
          const remaining = raceFilterValues(current.race).filter(
            (value) => value !== race,
          );
          return {
            ...current,
            race: remaining.length ? remaining.join(",") : "all",
          };
        }),
    })),
    ...singleValueToken(
      "lifecycle",
      `Lifecycle: ${labelFor(LIFECYCLE_FILTER_OPTIONS, filters.lifecycle)}`,
    ),
  ];

  // When the view is empty, find the binding constraint: the single active
  // dimension whose removal frees the most renders.
  const emptyRecovery: EmptyRecoveryCandidate | null = (() => {
    if (filteredItems.length > 0) return null;
    const countWith = (overrides: Partial<FilterState>, dropQuery = false) =>
      filterGalleryItems(
        items,
        { ...filters, ...overrides },
        favoriteIds,
        reviews,
        dropQuery ? "" : query,
        timeAnchor,
        completedRedoRenderIds,
      ).length;
    const candidates: EmptyRecoveryCandidate[] = [];
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
        label: labelFor(
          DECISION_FILTER_OPTIONS,
          filters.decision,
        ).toUpperCase(),
        freed: countWith({ decision: "all" }),
        loosen: () => setFilterValue("decision", "all"),
      });
    }
    if (filters.rating !== "all") {
      candidates.push({
        label: ratingFilterLabel(filters.rating).toUpperCase(),
        freed: countWith({ rating: "all" }),
        loosen: () => setFilterValue("rating", "all"),
      });
    }
    if (filters.generatedTime !== "all") {
      candidates.push({
        label: "GENERATED TIME",
        freed: countWith({
          generatedTime: "all",
          generatedFrom: "",
          generatedTo: "",
        }),
        loosen: () => setFilterValue("generatedTime", "all"),
      });
    }
    if (filters.reviewedTime !== "all") {
      candidates.push({
        label: "REVIEWED TIME",
        freed: countWith({
          reviewedTime: "all",
          reviewedFrom: "",
          reviewedTo: "",
        }),
        loosen: () => setFilterValue("reviewedTime", "all"),
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
      const selectedRaces = raceFilterValues(filters.race);
      candidates.push({
        label:
          selectedRaces.length === 1
            ? labelFor(raceOptions, selectedRaces[0]).toUpperCase()
            : "RACES",
        freed: countWith({ race: "all" }),
        loosen: () => setFilterValue("race", "all"),
      });
    }
    if (filters.collections.length) {
      candidates.push({
        label:
          filters.collections.length === 1 ? "COLLECTION" : "COLLECTIONS",
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
    const best = candidates.reduce<EmptyRecoveryCandidate | null>(
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
    filters.generatedTime,
    filters.generatedFrom,
    filters.generatedTo,
    filters.reviewedTime,
    filters.reviewedFrom,
    filters.reviewedTo,
    filters.collections.join("\u0000"),
  ].join("\u0001");

  return {
    query,
    setQuery,
    collectionQuery,
    setCollectionQuery,
    raceQuery,
    setRaceQuery,
    filters,
    setFilterValue,
    updateQuickFilter,
    toggleCollection,
    clearEverything,
    collectionOptions,
    collectionCounts,
    matchingCollections,
    genderOptions,
    genderCounts,
    raceOptions,
    raceCounts,
    matchingRaceOptions,
    decisionCounts,
    ratingCounts,
    lifecycleCounts,
    favoriteCounts,
    filteredItems,
    hiddenRejectedCount,
    activeFilterCount,
    hasFilters,
    filterTokens,
    emptyRecovery,
    gridResetKey,
    timeAnchor,
  };
}
