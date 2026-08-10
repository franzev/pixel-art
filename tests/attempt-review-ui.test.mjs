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
  const reviewWorkspace = await readFile(
    new URL("../app/_features/archive/review-workspace.tsx", import.meta.url),
    "utf8",
  );
  const workspaces = await readFile(
    new URL("../app/_features/archive/archive-workspaces.ts", import.meta.url),
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
  const redoProcessingSummary = await readFile(
    new URL(
      "../app/_features/review/redo-processing-summary.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const favoriteControl = await readFile(
    new URL("../app/_features/review/favorite-control.tsx", import.meta.url),
    "utf8",
  );
  const savedTimeFilter = await readFile(
    new URL(
      "../app/_features/archive/filters/saved-time-filter.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const renderTile = await readFile(
    new URL("../app/_features/archive/grid/render-tile.tsx", import.meta.url),
    "utf8",
  );
  const renderGateControl = await readFile(
    new URL("../app/_features/review/render-gate-control.tsx", import.meta.url),
    "utf8",
  );
  const renderGatePresentation = await readFile(
    new URL(
      "../app/_features/review/render-gate-presentation.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const catalogOutcome = await readFile(
    new URL(
      "../app/_features/review/catalog-outcome-control.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const candidateInspector = await readFile(
    new URL(
      "../app/_features/archive/candidate-inspector.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(gallery, /useReviewStore\(reviewableItems\)/);
  assert.match(gallery, /unreviewedAttemptCount/);
  assert.match(gallery, /openAttemptReview/);
  assert.match(toolbar, /REVIEW NEW/);
  assert.match(toolbar, /Candidates/);
  assert.match(toolbar, /Preserved/);
  assert.match(gallery, /attemptSourceFilter/);
  assert.match(workspaces, /groupAttemptSeries/);
  assert.match(gallery, /attemptPresentationById/);
  assert.match(gallery, /<ReviewWorkspace/);
  assert.match(reviewWorkspace, /New candidates/);
  assert.match(reviewWorkspace, /Needs redo/);
  assert.match(reviewWorkspace, /Waiting for replacement/);
  assert.match(reviewWorkspace, /Marked for deletion/);
  assert.match(gallery, /openReviewQueue/);
  assert.match(gallery, /setReviewItems\(scopedItems\)/);
  assert.match(gallery, /attemptViewerRef\.current\?\.showModal\(\)/);
  assert.match(gallery, /\{view === "attempts" \? \(\s*<MobileAttemptViewer/);
  assert.match(gallery, /matchMedia\("\(max-width: 1023px\)"\)/);
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
  assert.match(reviewPanel, /<RedoProcessingSummary/);
  assert.match(redoProcessingSummary, /REDO STATUS/);
  assert.match(redoProcessingSummary, /Replacement generated/);
  assert.match(redoProcessingSummary, /OPEN LATEST REPLACEMENT/);
  assert.match(redoProcessingSummary, /Replacement review/);
  assert.match(reviewPanel, /<FavoriteControl/);
  assert.match(favoriteControl, /ADD TO FAVORITES/);
  assert.match(favoriteControl, /separate from rating/);
  assert.match(gallery, /favoriteIds=\{favoriteIds\}/);
  assert.match(gallery, /onToggleFavorite=\{toggleFavorite\}/);
  assert.match(gallery, /matchesGeneratedTimeFilter/);
  assert.match(gallery, /matchesTimestampFilter/);
  assert.match(gallery, /generatedTime=\{filters\.generatedTime\}/);
  assert.match(gallery, /reviewedTime=\{filters\.reviewedTime\}/);
  assert.match(toolbar, /<SavedTimeFilter/);
  assert.match(savedTimeFilter, /SAVED_TIME_PRESETS/);
  assert.match(savedTimeFilter, /type="datetime-local"/);
  assert.match(renderTile, /Generated \{formatSavedTimestampCompact/);
  assert.match(reviewPanel, /<RenderGateControl/);
  assert.match(candidateInspector, /<RenderGateControl/);
  assert.match(renderGateControl, /QUALITY CHECK/);
  assert.match(renderGateControl, /Same character and identity/);
  assert.match(renderGateControl, /CHECK ALL 5/);
  assert.match(renderGateControl, /ALL_RENDER_GATE_ATTESTATIONS/);
  assert.match(renderGatePresentation, /RUN QUALITY CHECK/);
  assert.match(renderGatePresentation, /RETRY CONNECTION/);
  assert.match(renderGatePresentation, /renderGateFailureSummary/);
  assert.match(renderGateControl, /Promotion unlocked/);
  assert.match(catalogOutcome, /renderGateState !== "passed"/);
  assert.match(catalogOutcome, /Keep both and Keep new unlock/);
  assert.match(catalogOutcome, /SEND BACK FOR REDO/);
  assert.match(catalogOutcome, /Delete candidate/);
  assert.match(reviewDesk, /correctedRenderReviews/);
  assert.match(reviewDesk, /applyReview\(comparisonItem/);
  assert.match(reviewDesk, /REDO QUEUED/);
  assert.match(reviewDesk, /onDiscardCandidate/);
  assert.match(reviewDesk, /CANDIDATE DELETED/);
  assert.match(gallery, /onDiscardCandidate=\{discardCandidate\}/);

  const keyboardHandler = reviewDesk.slice(
    reviewDesk.indexOf("const onKeyDown"),
  );
  const comparisonShortcuts = keyboardHandler.indexOf("catalogComparison");
  const noteShortcut = keyboardHandler.indexOf(
    'event.key.toLowerCase() === "n"',
  );
  assert.ok(
    comparisonShortcuts >= 0 && comparisonShortcuts < noteShortcut,
    "comparison outcome shortcuts must take priority over the general notes shortcut",
  );
});
