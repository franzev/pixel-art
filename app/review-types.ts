export type ArtStatus = "retained" | "draft" | "rejected" | "unreviewed";

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
  generatedAt: string;
  renderGateVersion?: number;
  suggestedTags: SuggestedTag[];
};

export type GalleryItem = Pick<
  ArtItem,
  | "id"
  | "renderId"
  | "assetHash"
  | "url"
  | "name"
  | "filename"
  | "category"
  | "collection"
  | "status"
  | "width"
  | "height"
  | "generatedAt"
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

export type AttemptItem = GalleryItem & {
  path: string;
  attempt: number;
  concept: string;
  series: string;
  sourceKind: "archive" | "redo-staging";
  sourcePath: string;
};

export type AttemptCatalog = {
  version: string;
  items: AttemptItem[];
};

export type RedoCompletion = {
  sourceRenderId: string;
  sourcePath: string;
  candidatePaths: string[];
  selectionFiles: string[];
};

export type ReviewDecision = "keep" | "reject" | "delete";

const LEGACY_DECISIONS: Record<string, ReviewDecision> = {
  correct: "reject",
  rerender: "reject",
  redesign: "reject",
  reference: "reject",
  duplicate: "reject",
};

const VALID_DECISIONS: ReadonlySet<ReviewDecision> = new Set([
  "keep",
  "reject",
  "delete",
]);

export function normalizeDecision(
  value: string | null,
): ReviewDecision | null {
  if (!value) return null;
  const legacy = LEGACY_DECISIONS[value];
  if (legacy) return legacy;
  // Validate rather than trust: an unrecognized decision string reads as
  // unreviewed instead of silently masquerading as a valid ReviewDecision.
  return VALID_DECISIONS.has(value as ReviewDecision)
    ? (value as ReviewDecision)
    : null;
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
