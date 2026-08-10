import assert from "node:assert/strict";
import test from "node:test";

import {
  correctedRenderReviews,
  qualityCheckFeedback,
} from "../app/_features/review/review-model.ts";

function review(renderId, overrides = {}) {
  return {
    renderId,
    overallRating: 3,
    conceptRating: null,
    executionRating: null,
    directionRating: null,
    decision: null,
    note: "",
    correctionNote: "",
    duplicateOf: null,
    deletionState: "none",
    tags: [],
    defects: [],
    revision: 1,
    reviewedAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

test("failed quality checks become concise instructions for the next render", () => {
  assert.equal(
    qualityCheckFeedback("Preserve the face and clothing.", [
      "The outer band must be exactly #171311.",
      "The outer band must be exactly #171311.",
    ]),
    [
      "Preserve the face and clothing.",
      "",
      "Quality check for the next render:",
      "- The outer band must be exactly #171311.",
    ].join("\n"),
  );
});

test("quality-check feedback is not duplicated when requesting another render", () => {
  const existing = [
    "Quality check for the next render:",
    "- Use the exact background.",
  ].join("\n");

  assert.equal(
    qualityCheckFeedback(existing, ["Use the exact background."]),
    existing,
  );
});

test("a failed candidate queues its catalog source for another redo", () => {
  const result = correctedRenderReviews({
    candidateReview: review("candidate"),
    sourceReview: review("source", {
      decision: "keep",
      note: "Preserve the original face.",
    }),
    candidateFeedback: "Candidate anatomy is correct.",
    errors: ["Use the exact #171311 background."],
  });

  assert.equal(result.candidate.decision, "reject");
  assert.equal(result.source.decision, "reject");
  assert.equal(result.source.reviewedAt, null);
  assert.match(result.source.note, /Preserve the original face/);
  assert.match(result.source.note, /Candidate anatomy is correct/);
  assert.match(result.source.note, /exact #171311 background/);
});
