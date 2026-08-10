import type {
  AttemptItem,
  GalleryItem,
  RedoCompletion,
  RenderReview,
} from "../../review-types";

export type RedoProcessingStatus = {
  state: "waiting" | "processed";
  requestedAt: string;
  candidates: AttemptItem[];
  latestCandidate?: AttemptItem;
};

function candidateSourcePath(value: string) {
  return `work/redo-staging/${value.replace(/^\/+/, "")}`;
}

/**
 * A Redo is processed only when a different candidate was saved after the
 * decision. The permanent Reject decision is review history, not queue state.
 */
export function redoProcessingStatus(
  source: GalleryItem,
  review: RenderReview,
  completions: RedoCompletion[],
  attempts: AttemptItem[],
): RedoProcessingStatus | null {
  if (review.decision !== "reject" || "sourceKind" in source) return null;

  const requestedAt = review.reviewedAt ?? review.updatedAt;
  const requestedTimestamp = Date.parse(requestedAt);
  const completion = completions.find(
    (candidate) => candidate.sourceRenderId === source.renderId,
  );
  const completedPaths = new Set(
    (completion?.candidatePaths ?? []).map(candidateSourcePath),
  );

  const candidates = attempts
    .filter((candidate) => {
      const generatedTimestamp = Date.parse(candidate.generatedAt);
      return (
        candidate.sourceKind === "redo-staging" &&
        completedPaths.has(candidate.sourcePath) &&
        candidate.assetHash !== source.assetHash &&
        !Number.isNaN(generatedTimestamp) &&
        !Number.isNaN(requestedTimestamp) &&
        generatedTimestamp > requestedTimestamp
      );
    })
    .sort(
      (a, b) =>
        b.generatedAt.localeCompare(a.generatedAt) || b.attempt - a.attempt,
    );

  return {
    state: candidates.length ? "processed" : "waiting",
    requestedAt,
    candidates,
    latestCandidate: candidates[0],
  };
}
