import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("attempts are persisted review targets with an unreviewed queue", async () => {
  const gallery = await readFile(
    new URL("../app/_features/archive/archive-gallery.tsx", import.meta.url),
    "utf8",
  );
  const toolbar = await readFile(
    new URL("../app/_features/archive/attempt-toolbar.tsx", import.meta.url),
    "utf8",
  );
  const quickFilters = await readFile(
    new URL("../app/_features/archive/quick-filter-bar.tsx", import.meta.url),
    "utf8",
  );
  const reviewRoute = await readFile(
    new URL("../app/api/reviews/route.ts", import.meta.url),
    "utf8",
  );
  const reviewDesk = await readFile(
    new URL("../app/_features/review/review-desk.tsx", import.meta.url),
    "utf8",
  );
  const reviewPanel = await readFile(
    new URL("../app/_features/review/review-panel.tsx", import.meta.url),
    "utf8",
  );
  const originalReview = await readFile(
    new URL(
      "../app/_features/review/original-review-summary.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(gallery, /useReviewStore\(reviewableItems\)/);
  assert.match(gallery, /unreviewedAttemptCount/);
  assert.match(gallery, /openAttemptReview/);
  assert.match(toolbar, /REVIEW UNREVIEWED/);
  assert.match(toolbar, /SUCCESSFUL/);
  assert.match(gallery, /attemptSourceFilter/);
  assert.match(gallery, /unreviewedOutputCount=\{unreviewedCandidateCount\}/);
  assert.match(quickFilters, /onOpenUnreviewedOutputs/);
  assert.match(quickFilters, /UNREVIEWED <strong>\{unreviewedOutputCount\}/);
  assert.match(
    quickFilters,
    /REDO ORIGINALS <strong>\{redoAvailableCount\}/,
  );
  assert.match(gallery, /drawerDecisionCounts/);
  assert.match(gallery, /openUnreviewedOutputs/);
  assert.match(gallery, /decisionCounts=\{drawerDecisionCounts\}/);
  assert.match(gallery, /onSetFilterValue=\{setDrawerFilterValue\}/);
  assert.match(gallery, /if \(!attemptViewerRef\.current\?\.open\)/);
  assert.match(
    gallery,
    /if \("sourceKind" in item\) \{\s*const candidate = item as AttemptItem;\s*openAttemptReview\(candidate, reviewQueueForAttempt\(candidate\)\);\s*return;/,
  );
  assert.match(gallery, /\{view === "attempts" \? \(\s*<MobileAttemptViewer/);
  assert.doesNotMatch(gallery, /matchMedia\("\(max-width: 1023px\)"\)/);
  assert.match(reviewRoute, /attemptIndex/);
  assert.match(reviewRoute, /reviewTargetsByRenderId/);
  assert.match(reviewRoute, /Review history is authoritative/);
  assert.match(gallery, /useState<ArchiveView>\("catalog"\)/);
  assert.match(reviewDesk, /originalReview=\{comparisonReview\}/);
  assert.match(reviewPanel, /<OriginalReviewSummary/);
  assert.match(originalReview, /ORIGINAL REVIEW/);
  assert.match(originalReview, /Concept/);
  assert.match(originalReview, /Execution/);
  assert.match(originalReview, /Direction/);
  assert.match(originalReview, /WHAT FAILED/);
  assert.match(originalReview, /ORIGINAL NOTES/);
  assert.match(originalReview, /REQUESTED CORRECTION/);
  assert.match(originalReview, /review\.tags/);
  assert.match(originalReview, /review\.duplicateOf/);
  assert.match(originalReview, /review\.reviewedAt/);
});
