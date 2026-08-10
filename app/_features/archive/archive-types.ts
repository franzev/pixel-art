import type {
  AttemptCatalog,
  GalleryCatalog,
  RedoCompletion,
} from "../../review-types";

export type ArchiveView = "catalog" | "review" | "attempts";

export type ArchiveGalleryProps = {
  catalog: GalleryCatalog;
  attemptCatalog: AttemptCatalog;
  redoCompletions: RedoCompletion[];
  redoCompletionVersion: string;
};

export type FilterToken = {
  id: string;
  label: string;
  onRemove: () => void;
};

export type EmptyRecoveryCandidate = {
  label: string;
  freed: number;
  loosen: () => void;
};
