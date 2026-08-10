import assert from "node:assert/strict";
import test from "node:test";

import { redoProcessingStatus } from "../app/_features/review/redo-processing-status.ts";

const source = {
  id: "enemies/fixture/source.png",
  renderId: "source",
  assetHash: "source-hash",
  url: "/art/source.png",
  name: "Source",
  filename: "source.png",
  category: "enemies",
  collection: "fixture",
  status: "draft",
  width: 256,
  height: 256,
  suggestedTags: [],
};

const review = {
  renderId: "source",
  overallRating: 2,
  conceptRating: null,
  executionRating: null,
  directionRating: null,
  decision: "reject",
  note: "",
  correctionNote: "",
  duplicateOf: null,
  deletionState: "none",
  tags: [],
  defects: [],
  revision: 1,
  reviewedAt: "2026-08-02T01:00:00.000Z",
  updatedAt: "2026-08-02T01:00:00.500Z",
};

const completion = {
  sourceRenderId: "source",
  sourcePath: "enemies/fixture/source.png",
  candidatePaths: ["enemies/fixture/source-v02.png"],
  selectionFiles: ["selection.json"],
};

const candidate = {
  ...source,
  id: "candidate",
  renderId: "candidate",
  assetHash: "candidate-hash",
  path: "work/redo-staging/enemies/fixture/source-v02.png",
  sourcePath: "work/redo-staging/enemies/fixture/source-v02.png",
  url: "/staged-attempts/enemies/fixture/source-v02.png",
  filename: "source-v02.png",
  attempt: 2,
  concept: "Source",
  series: "enemies/fixture/source",
  sourceKind: "redo-staging",
  generatedAt: "2026-08-02T02:00:00.000Z",
};

test("marks a Redo processed only for a later different candidate", () => {
  const status = redoProcessingStatus(
    source,
    review,
    [completion],
    [candidate],
  );

  assert.equal(status?.state, "processed");
  assert.equal(status?.latestCandidate?.renderId, "candidate");
});

test("does not mistake an unchanged or older image for processed work", () => {
  const sameImage = { ...candidate, assetHash: source.assetHash };
  const oldImage = {
    ...candidate,
    renderId: "old-candidate",
    generatedAt: "2026-08-02T00:30:00.000Z",
  };

  assert.equal(
    redoProcessingStatus(source, review, [completion], [sameImage])?.state,
    "waiting",
  );
  assert.equal(
    redoProcessingStatus(source, review, [completion], [oldImage])?.state,
    "waiting",
  );
});
