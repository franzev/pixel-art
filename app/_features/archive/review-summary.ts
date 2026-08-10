import type {
  GalleryItem,
  RedoCompletion,
  RenderReview,
  ReviewMap,
} from "../../review-types";

export function isRedoAwaitingGeneration(
  item: GalleryItem,
  review: RenderReview | undefined,
  completedRedoRenderIds: ReadonlySet<string>,
) {
  return (
    review?.decision === "reject" &&
    !("sourceKind" in item) &&
    !completedRedoRenderIds.has(item.renderId)
  );
}

export type ReviewProgress = {
  saved: {
    keep: number;
    redo: number;
    delete: number;
  };
  queue: {
    redoAwaitingGeneration: number;
    redoSourcesAvailable: number;
    redoSourcesRegenerated: number;
    redoSourcesAwaitingGenerationAvailable: number;
    redoSourcesUnavailable: number;
    generatedOutputsAvailable: number;
    generatedOutputsAwaitingReview: number;
    deletionAwaitingApplication: number;
  };
};

/**
 * Keep saved decisions and actionable queues separate. A source can leave the
 * live catalog after a Delete, and a Redo can acquire a generated candidate;
 * neither transition removes the original decision from review history.
 */
export function summarizeReviewProgress(
  reviews: ReviewMap,
  catalogItems: GalleryItem[],
  candidates: GalleryItem[],
  redoCompletions: RedoCompletion[],
): ReviewProgress {
  const saved = { keep: 0, redo: 0, delete: 0 };
  for (const review of Object.values(reviews)) {
    if (review.decision === "keep") saved.keep += 1;
    if (review.decision === "reject") saved.redo += 1;
    if (review.decision === "delete") saved.delete += 1;
  }

  const completedRedoRenderIds = new Set(
    redoCompletions.map((completion) => completion.sourceRenderId),
  );
  const catalogRenderIds = new Set(
    catalogItems.map((item) => item.renderId),
  );

  const generatedOutputsAwaitingReview = candidates.filter(
    (candidate) => !reviews[candidate.renderId]?.decision,
  ).length;
  const redoSourcesAvailable = Object.values(reviews).filter(
    (review) =>
      review.decision === "reject" && catalogRenderIds.has(review.renderId),
  ).length;
  const redoSourcesRegenerated = Object.values(reviews).filter(
    (review) =>
      review.decision === "reject" &&
      catalogRenderIds.has(review.renderId) &&
      completedRedoRenderIds.has(review.renderId),
  ).length;
  const redoSourcesAwaitingGenerationAvailable = Object.values(reviews).filter(
    (review) =>
      review.decision === "reject" &&
      catalogRenderIds.has(review.renderId) &&
      !completedRedoRenderIds.has(review.renderId),
  ).length;
  const deletionAwaitingApplication = Object.values(reviews).filter(
    (review) =>
      review.decision === "delete" &&
      review.deletionState === "marked" &&
      catalogRenderIds.has(review.renderId),
  ).length;
  const redoAwaitingGeneration = Object.values(reviews).filter(
    (review) =>
      review.decision === "reject" &&
      !completedRedoRenderIds.has(review.renderId),
  ).length;

  return {
    saved,
    queue: {
      redoAwaitingGeneration,
      redoSourcesAvailable,
      redoSourcesRegenerated,
      redoSourcesAwaitingGenerationAvailable,
      redoSourcesUnavailable: saved.redo - redoSourcesAvailable,
      generatedOutputsAvailable: candidates.length,
      generatedOutputsAwaitingReview,
      deletionAwaitingApplication,
    },
  };
}
