import type { GalleryCatalog } from "../../review-types";

export type ArchiveGalleryProps = {
  catalog: GalleryCatalog;
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
