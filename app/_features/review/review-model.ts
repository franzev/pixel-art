import type { DefectSeverity, ReviewDecision, RenderReview } from "../../review-types";

export function defaultSeverity(decision: ReviewDecision | null): DefectSeverity {
  if (decision === "delete") return "fatal";
  return "major";
}

export function nextSeverity(value: DefectSeverity): DefectSeverity {
  if (value === "minor") return "major";
  if (value === "major") return "fatal";
  return "minor";
}

export function mergeDrafts(
  review: RenderReview,
  feedback: string,
) {
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
