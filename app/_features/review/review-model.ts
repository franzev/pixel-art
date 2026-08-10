import type {
  DefectSeverity,
  ReviewDecision,
  RenderReview,
} from "../../review-types";

export function defaultSeverity(
  decision: ReviewDecision | null,
): DefectSeverity {
  if (decision === "delete") return "fatal";
  return "major";
}

export function nextSeverity(value: DefectSeverity): DefectSeverity {
  if (value === "minor") return "major";
  if (value === "major") return "fatal";
  return "minor";
}

export function mergeDrafts(review: RenderReview, feedback: string) {
  return {
    ...review,
    note: feedback,
    correctionNote: "",
  };
}

export function combinedFeedback(
  note: string | null | undefined,
  correctionNote: string | null | undefined,
) {
  const feedback = note?.trim() ?? "";
  const nextAttempt = correctionNote?.trim() ?? "";
  if (!feedback) return nextAttempt;
  if (!nextAttempt || nextAttempt === feedback) return feedback;
  return `${feedback}\n\nNext: ${nextAttempt}`;
}

export function qualityCheckFeedback(feedback: string, errors: string[]) {
  const existing = feedback.trim();
  const additions = [...new Set(errors.map((error) => error.trim()))].filter(
    (error) => error && !existing.includes(error),
  );
  if (!additions.length) return existing;

  const qualityFeedback = [
    "Quality check for the next render:",
    ...additions.map((error) => `- ${error}`),
  ].join("\n");
  return existing ? `${existing}\n\n${qualityFeedback}` : qualityFeedback;
}

export function correctedRenderReviews({
  candidateReview,
  sourceReview,
  candidateFeedback,
  errors,
}: {
  candidateReview: RenderReview;
  sourceReview: RenderReview;
  candidateFeedback: string;
  errors: string[];
}) {
  const candidateInstructions = qualityCheckFeedback(candidateFeedback, errors);
  const sourceFeedback = [
    combinedFeedback(sourceReview.note, sourceReview.correctionNote),
    candidateFeedback.trim(),
  ]
    .filter(Boolean)
    .join("\n\n");
  const sourceInstructions = qualityCheckFeedback(sourceFeedback, errors);

  return {
    candidate: {
      ...mergeDrafts(candidateReview, candidateInstructions),
      decision: "reject" as const,
      deletionState: "none" as const,
    },
    source: {
      ...mergeDrafts(sourceReview, sourceInstructions),
      decision: "reject" as const,
      deletionState: "none" as const,
      reviewedAt: null,
    },
  };
}
