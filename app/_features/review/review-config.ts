import type { ReviewDecision } from "../../review-types";
import type { ReviewQueue } from "./review-queue";

export type DecisionOption = {
  value: ReviewDecision;
  label: string;
  shortcut: string;
  detail: boolean;
};

export type DefectOption = {
  key: string;
  label: string;
  shortcut: string;
};

export const QUEUE_LABELS: Record<ReviewQueue, string> = {
  unreviewed: "Unreviewed",
  all: "All renders",
  kept: "Kept",
  rejected: "Rejected · redo",
  deletion: "Marked for deletion",
  favorites: "Five-star anchors",
};

export const DECISIONS: DecisionOption[] = [
  { value: "keep", label: "Keep", shortcut: "K", detail: false },
  { value: "reject", label: "Reject · redo", shortcut: "R", detail: true },
  { value: "delete", label: "Delete · next", shortcut: "D", detail: false },
];

export const DEFECTS: DefectOption[] = [
  { key: "proportions", label: "Wrong proportions", shortcut: "P" },
  { key: "anatomy", label: "Anatomy or limbs", shortcut: "A" },
  { key: "hands-fingers", label: "Hands or fingers", shortcut: "F" },
  { key: "weapon-handling", label: "Weapon handling", shortcut: "H" },
  { key: "weapon-too-short", label: "Weapon too short", shortcut: "L" },
  { key: "weapon-bent", label: "Bent / crooked weapon", shortcut: "B" },
  { key: "wrong-weapon-design", label: "Wrong weapon design", shortcut: "W" },
  { key: "magic-effects", label: "Unwanted magic / effects", shortcut: "M" },
  { key: "silhouette-pose", label: "Silhouette or pose", shortcut: "S" },
  {
    key: "duplicate-repetition",
    label: "Feels repetitive / samey",
    shortcut: "Q",
  },
  { key: "costume", label: "Costume or styling", shortcut: "C" },
  { key: "technical", label: "Technical failure", shortcut: "T" },
];

export const DETAIL_DECISIONS = new Set(
  DECISIONS.filter((decision) => decision.detail).map(
    (decision) => decision.value,
  ),
);

export const SYNC_LABELS = {
  loading: "LOADING REVIEWS",
  saved: "ALL SAVED",
  saving: "SAVING",
  offline: "BUFFERED LOCALLY",
} as const;
