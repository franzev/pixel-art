export type ArtStatus = "retained" | "draft" | "rejected";

export type SuggestedTag = {
  key: string;
  label: string;
  group: string;
  source: "path" | "filename" | "document" | "visual";
  confidence: number;
};

export type ArtItem = {
  id: string;
  renderId: string;
  assetHash: string;
  path: string;
  url: string;
  name: string;
  filename: string;
  category: string;
  collection: string;
  status: ArtStatus;
  width: number;
  height: number;
  suggestedTags: SuggestedTag[];
};

export type GalleryItem = Pick<
  ArtItem,
  | "id"
  | "renderId"
  | "url"
  | "name"
  | "filename"
  | "category"
  | "collection"
  | "status"
  | "width"
  | "height"
  | "suggestedTags"
>;

export type CompactGalleryItem = Omit<GalleryItem, "suggestedTags"> & {
  tagDefinitionIds: number[];
};

export type GalleryCatalog = {
  version: string;
  items: CompactGalleryItem[];
  tagDefinitions: SuggestedTag[];
};

export type ReviewDecision = "keep" | "reject" | "delete";

const LEGACY_DECISIONS: Record<string, ReviewDecision> = {
  correct: "reject",
  rerender: "reject",
  redesign: "reject",
  reference: "reject",
  duplicate: "reject",
};

export function normalizeDecision(
  value: string | null,
): ReviewDecision | null {
  if (!value) return null;
  return LEGACY_DECISIONS[value] ?? (value as ReviewDecision);
}

export type DefectSeverity = "minor" | "major" | "fatal";

export type ReviewDefect = {
  key: string;
  label: string;
  severity: DefectSeverity;
  note?: string;
};

export type TagState = "suggested" | "confirmed" | "rejected";

export type ReviewTag = SuggestedTag & {
  state: TagState;
};

export type RenderReview = {
  renderId: string;
  overallRating: number | null;
  conceptRating: number | null;
  executionRating: number | null;
  directionRating: number | null;
  decision: ReviewDecision | null;
  note: string;
  correctionNote: string;
  duplicateOf: string | null;
  deletionState: "none" | "marked";
  tags: ReviewTag[];
  defects: ReviewDefect[];
  revision: number;
  reviewedAt: string | null;
  updatedAt: string;
};

export type ReviewMap = Record<string, RenderReview>;

export function emptyReview(
  item: GalleryItem,
  timestamp = new Date().toISOString(),
): RenderReview {
  return {
    renderId: item.renderId,
    overallRating: null,
    conceptRating: null,
    executionRating: null,
    directionRating: null,
    decision: null,
    note: "",
    correctionNote: "",
    duplicateOf: null,
    deletionState: "none",
    tags: item.suggestedTags.map((tag) => ({
      ...tag,
      state: "suggested" as const,
    })),
    defects: [],
    revision: 0,
    reviewedAt: null,
    updatedAt: timestamp,
  };
}
