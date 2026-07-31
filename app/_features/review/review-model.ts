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
  note: string,
  correctionNote: string,
) {
  return {
    ...review,
    note,
    correctionNote,
  };
}
