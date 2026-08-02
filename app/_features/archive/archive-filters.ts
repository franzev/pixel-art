import type { GalleryItem, ReviewMap } from "../../review-types";
import { GENDER_TAG_GROUP, RACE_TAG_GROUP } from "./archive-config";
import {
  matchesSavedTimeFilter,
  savedTimeFilterLabel,
} from "./saved-time";

export type FilterState = {
  lifecycle: string;
  decision: string;
  rating: string;
  favorite: string;
  gender: string;
  race: string;
  savedTime: string;
  savedFrom: string;
  savedTo: string;
  collections: string[];
};

export type RatingFilterMode = "all" | "exact" | "greater" | "less";
export type RatingValue = "1" | "2" | "3" | "4" | "5" | "unrated";

export type ParsedRatingFilter =
  | { mode: "all" }
  | { mode: "exact"; values: RatingValue[] }
  | { mode: "greater" | "less"; threshold: number };

const RATING_VALUES: RatingValue[] = ["5", "4", "3", "2", "1", "unrated"];

export function parseRatingFilter(value: string): ParsedRatingFilter {
  if (!value || value === "all") return { mode: "all" };
  if (/^[1-5]$/.test(value) || value === "unrated") {
    return { mode: "exact", values: [value as RatingValue] };
  }
  const [mode, payload] = value.split(":", 2);
  if (mode === "eq") {
    const values = (payload ?? "")
      .split(",")
      .filter((entry): entry is RatingValue =>
        RATING_VALUES.includes(entry as RatingValue),
      );
    if (values.length) {
      return { mode: "exact", values: Array.from(new Set(values)) };
    }
    return { mode: "all" };
  }
  if ((mode === "gt" || mode === "lt") && /^[1-5]$/.test(payload ?? "")) {
    return {
      mode: mode === "gt" ? "greater" : "less",
      threshold: Number(payload),
    };
  }
  return { mode: "all" };
}

export function serializeRatingFilter(filter: ParsedRatingFilter) {
  if (filter.mode === "all") return "all";
  if (filter.mode === "exact") {
    return filter.values.length ? `eq:${filter.values.join(",")}` : "all";
  }
  return `${filter.mode === "greater" ? "gt" : "lt"}:${filter.threshold}`;
}

export function ratingFilterLabel(value: string) {
  const filter = parseRatingFilter(value);
  if (filter.mode === "all") return "Any";
  if (filter.mode === "exact") {
    return filter.values
      .map((entry) => (entry === "unrated" ? "Unrated" : `${entry}★`))
      .join(", ");
  }
  return `${filter.mode === "greater" ? ">" : "<"}${filter.threshold}★`;
}

export function matchesRatingFilter(
  overallRating: number | null | undefined,
  filterValue: string,
) {
  const filter = parseRatingFilter(filterValue);
  if (filter.mode === "all") return true;
  if (filter.mode === "exact") {
    const itemValue: RatingValue =
      overallRating === null || overallRating === undefined
        ? "unrated"
        : String(overallRating) as RatingValue;
    return filter.values.includes(itemValue);
  }
  if (overallRating === null || overallRating === undefined) return false;
  return filter.mode === "greater"
    ? overallRating > filter.threshold
    : overallRating < filter.threshold;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  lifecycle: "active",
  decision: "all",
  rating: "all",
  favorite: "all",
  gender: "all",
  race: "all",
  savedTime: "all",
  savedFrom: "",
  savedTo: "",
  collections: [],
};

export function copyFilterState(filters: FilterState): FilterState {
  return { ...filters, collections: [...filters.collections] };
}

export const URL_FILTER_KEYS = [
  "lifecycle",
  "decision",
  "rating",
  "favorite",
  "gender",
  "race",
  "savedTime",
] as const;

export function filtersToSearchParams(filters: FilterState, query: string) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query);
  for (const key of URL_FILTER_KEYS) {
    if (filters[key] !== DEFAULT_FILTER_STATE[key]) {
      params.set(key, filters[key]);
    }
  }
  if (filters.savedTime === "custom") {
    if (filters.savedFrom) params.set("savedFrom", filters.savedFrom);
    if (filters.savedTo) params.set("savedTo", filters.savedTo);
  }
  for (const name of filters.collections) params.append("c", name);
  return params;
}

export function activeFilterDimensionCount(filters: FilterState) {
  return [
    filters.lifecycle !== DEFAULT_FILTER_STATE.lifecycle,
    filters.decision !== DEFAULT_FILTER_STATE.decision,
    filters.rating !== DEFAULT_FILTER_STATE.rating,
    filters.favorite !== DEFAULT_FILTER_STATE.favorite,
    filters.gender !== DEFAULT_FILTER_STATE.gender,
    filters.race !== DEFAULT_FILTER_STATE.race,
    filters.savedTime !== DEFAULT_FILTER_STATE.savedTime,
    filters.collections.length > 0,
  ].filter(Boolean).length;
}

export function tagValueFor(item: GalleryItem, group: string) {
  const tag = item.suggestedTags.find((entry) => entry.group === group);
  return tag ? tag.key.slice(group.length + 1) : "untagged";
}

export function filterGalleryItems(
  items: GalleryItem[],
  filters: FilterState,
  favoriteIds: Set<string>,
  reviews: ReviewMap,
  query: string,
  now = Date.now(),
) {
  const needle = query.trim().toLocaleLowerCase();
  return items.filter((item) => {
    // Candidates share the Catalog surface only through an explicit review
    // decision. The normal library stays canonical and uncluttered.
    if (
      item.status === "unreviewed" &&
      filters.decision === "all" &&
      filters.savedTime === "all"
    ) {
      return false;
    }
    if (filters.lifecycle === "active" && item.status === "rejected")
      return false;
    if (filters.lifecycle === "rejected" && item.status !== "rejected")
      return false;
    if (filters.favorite === "favorite" && !favoriteIds.has(item.renderId))
      return false;
    if (
      filters.collections.length &&
      !filters.collections.includes(item.collection)
    )
      return false;
    if (
      filters.gender !== "all" &&
      tagValueFor(item, GENDER_TAG_GROUP) !== filters.gender
    )
      return false;
    if (
      filters.race !== "all" &&
      tagValueFor(item, RACE_TAG_GROUP) !== filters.race
    )
      return false;
    if (filters.decision !== "all") {
      const reviewed = reviews[item.renderId]?.decision ?? "unreviewed";
      if (reviewed !== filters.decision) return false;
    }
    if (!matchesRatingFilter(reviews[item.renderId]?.overallRating, filters.rating))
      return false;
    if (
      !matchesSavedTimeFilter(
        item,
        filters.savedTime,
        filters.savedFrom,
        filters.savedTo,
        now,
      )
    )
      return false;
    if (!needle) return true;
    return [item.name, item.filename, item.category, item.collection]
      .join(" ")
      .toLocaleLowerCase()
      .includes(needle);
  });
}

export { savedTimeFilterLabel };

export function tagFilterOptions(
  items: GalleryItem[],
  group: string,
  allLabel: string,
) {
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
