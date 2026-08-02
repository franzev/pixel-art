import assert from "node:assert/strict";
import test from "node:test";

import { summarizeReviewProgress } from "../app/_features/archive/review-summary.ts";

const item = (renderId, status = "draft") => ({
  id: renderId,
  renderId,
  url: `/art/${renderId}.png`,
  name: renderId,
  filename: `${renderId}.png`,
  category: "enemies",
  collection: "fixture",
  status,
  width: 256,
  height: 256,
  suggestedTags: [],
});

const review = (renderId, decision, deletionState = "none") => ({
  renderId,
  overallRating: null,
  conceptRating: null,
  executionRating: null,
  directionRating: null,
  decision,
  note: "",
  correctionNote: "",
  duplicateOf: null,
  deletionState,
  tags: [],
  defects: [],
  revision: 1,
  reviewedAt: "2026-08-02T00:00:00.000Z",
  updatedAt: "2026-08-02T00:00:00.000Z",
});

test("review progress keeps completed Redos and removed Deletes in saved totals", () => {
  const reviews = {
    completedRedo: review("completed-redo", "reject"),
    pendingRedo: review("pending-redo", "reject"),
    removedDelete: review("removed-delete", "delete", "marked"),
    liveDelete: review("live-delete", "delete", "marked"),
    kept: review("kept", "keep"),
  };

  const progress = summarizeReviewProgress(
    reviews,
    [item("completed-redo"), item("live-delete")],
    [
      item("candidate-unreviewed", "unreviewed"),
      item("candidate-kept", "unreviewed"),
    ],
    [
      {
        sourceRenderId: "completed-redo",
        sourcePath: "enemies/fixture/completed-redo.png",
        candidatePaths: ["enemies/fixture/completed-redo-v02.png"],
        selectionFiles: ["selection.json"],
      },
    ],
  );

  assert.deepEqual(progress.saved, { keep: 1, redo: 2, delete: 2 });
  assert.deepEqual(progress.queue, {
    redoAwaitingGeneration: 1,
    redoSourcesAvailable: 1,
    redoSourcesRegenerated: 1,
    redoSourcesUnavailable: 1,
    generatedOutputsAvailable: 2,
    generatedOutputsAwaitingReview: 2,
    deletionAwaitingApplication: 1,
  });
});

test("reviewed generated candidates are not counted as outputs awaiting review", () => {
  const reviews = {
    candidate: review("candidate", "keep"),
  };
  const progress = summarizeReviewProgress(
    reviews,
    [],
    [item("candidate", "unreviewed")],
    [],
  );

  assert.equal(progress.queue.generatedOutputsAwaitingReview, 0);
});
