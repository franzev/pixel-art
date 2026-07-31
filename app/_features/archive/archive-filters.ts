import type { GalleryItem, ReviewMap } from "../../review-types";
import { GENDER_TAG_GROUP, RACE_TAG_GROUP } from "./archive-config";

export type FilterState = {
  lifecycle: string;
  decision: string;
  rating: string;
  favorite: string;
  gender: string;
  race: string;
  collections: string[];
};

export const DEFAULT_FILTER_STATE: FilterState = {
  lifecycle: "active",
  decision: "all",
  rating: "all",
  favorite: "all",
  gender: "all",
  race: "all",
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
] as const;

export function filtersToSearchParams(filters: FilterState, query: string) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query);
  for (const key of URL_FILTER_KEYS) {
    if (filters[key] !== DEFAULT_FILTER_STATE[key]) {
      params.set(key, filters[key]);
    }
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
) {
  const needle = query.trim().toLocaleLowerCase();
  return items.filter((item) => {
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
    if (filters.rating !== "all") {
      const overallRating = reviews[item.renderId]?.overallRating;
      const itemRating =
        overallRating === null || overallRating === undefined
          ? "unrated"
          : String(overallRating);
      if (itemRating !== filters.rating) return false;
    }
    if (!needle) return true;
    return [item.name, item.filename, item.category, item.collection]
      .join(" ")
      .toLocaleLowerCase()
      .includes(needle);
  });
}

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
