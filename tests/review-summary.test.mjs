import assert from "node:assert/strict";
import test from "node:test";

import {
  isRedoAwaitingGeneration,
  summarizeReviewProgress,
} from "../app/_features/archive/review-summary.ts";

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
    redoSourcesAwaitingGenerationAvailable: 0,
    redoSourcesUnavailable: 1,
    generatedOutputsAvailable: 2,
    generatedOutputsAwaitingReview: 2,
    deletionAwaitingApplication: 1,
  });
});

test("awaiting-generation predicate accepts only redo originals without a replacement", () => {
  const pending = item("pending-redo");
  const completed = item("completed-redo");
  const kept = item("kept");
  const candidate = {
    ...item("candidate", "unreviewed"),
    sourceKind: "redo-staging",
  };
  const completedIds = new Set(["completed-redo"]);

  assert.equal(
    isRedoAwaitingGeneration(
      pending,
      review("pending-redo", "reject"),
      completedIds,
    ),
    true,
  );
  assert.equal(
    isRedoAwaitingGeneration(
      completed,
      review("completed-redo", "reject"),
      completedIds,
    ),
    false,
  );
  assert.equal(
    isRedoAwaitingGeneration(kept, review("kept", "keep"), completedIds),
    false,
  );
  assert.equal(
    isRedoAwaitingGeneration(
      candidate,
      review("candidate", "reject"),
      completedIds,
    ),
    false,
  );
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
