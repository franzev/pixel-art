import type { ReviewDecision } from "../../review-types";
import type { ReviewQueue } from "../review/review-queue";

export const CATEGORY_LABELS: Record<string, string> = {
  enemies: "Enemies",
  bosses: "Bosses",
  angels: "Angels",
  protagonist: "Protagonist",
  environments: "Environments",
};

export const DECISION_LABELS: Record<ReviewDecision, string> = {
  keep: "Keep",
  reject: "Redo",
  delete: "Delete queue",
};

export const DECISION_QUEUES: Record<string, ReviewQueue> = {
  all: "all",
  unreviewed: "unreviewed",
  keep: "kept",
  reject: "rejected",
  delete: "deletion",
};

export const GENDER_TAG_GROUP = "gender-presentation";
export const RACE_TAG_GROUP = "race";
export const FAVORITES_STORAGE_KEY = "ashen-archive-favorites-v1";
export const TILE_SIZE_STORAGE_KEY = "archive-tile-size";
export const INITIAL_RENDER_COUNT = 24;
export const GRID_GAP = 8;
export const TILE_CHROME_HEIGHT = 49;
export const GRID_PREVIEW_SIZES =
  "(max-width: 720px) 42vw, (max-width: 1100px) 25vw, 220px";

export const DECISION_FILTER_OPTIONS = [
  { value: "all", label: "All decisions" },
  { value: "unreviewed", label: "Unreviewed" },
  { value: "keep", label: "Keep" },
  { value: "reject", label: "Redo" },
  { value: "delete", label: "Delete queue" },
];

export const LIFECYCLE_FILTER_OPTIONS = [
  { value: "active", label: "Active · not rejected" },
  { value: "rejected", label: "Rejected only" },
  { value: "all", label: "Everything" },
];

export const RATING_FILTER_OPTIONS = [
  { value: "all", label: "Any" },
  { value: "5", label: "5" },
  { value: "4", label: "4" },
  { value: "3", label: "3" },
  { value: "2", label: "2" },
  { value: "1", label: "1" },
  { value: "unrated", label: "Unrated" },
];

export const FAVORITE_FILTER_OPTIONS = [
  { value: "all", label: "All renders" },
  { value: "favorite", label: "Favorites" },
];
