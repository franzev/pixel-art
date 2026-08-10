import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Review New candidates is backed by latest successful candidates", async () => {
  const matching = await readFile(
    new URL("../app/_features/archive/candidate-matching.ts", import.meta.url),
    "utf8",
  );
  const gallery = await readFile(
    new URL("../app/_features/archive/archive-gallery.tsx", import.meta.url),
    "utf8",
  );
  const reviewDesk = await readFile(
    new URL("../app/_features/review/review-desk.tsx", import.meta.url),
    "utf8",
  );
  const reviewStage = await readFile(
    new URL("../app/_features/review/review-stage.tsx", import.meta.url),
    "utf8",
  );
  const reviewWorkspace = await readFile(
    new URL("../app/_features/archive/review-workspace.tsx", import.meta.url),
    "utf8",
  );

  assert.match(matching, /latestSuccessfulCandidates/);
  assert.match(matching, /sourceKind !== "redo-staging"/);
  assert.match(matching, /matchingCatalogItem/);
  assert.match(matching, /matchingAttemptHistory/);
  assert.match(gallery, /latestSuccessfulCandidates/);
  assert.match(gallery, /openNewCandidates/);
  assert.match(gallery, /<ReviewWorkspace/);
  assert.match(reviewWorkspace, /New candidates/);
  assert.match(gallery, /candidateOriginals/);
  assert.match(gallery, /comparisonItemsByRenderId=\{candidateOriginals\}/);
  assert.match(reviewDesk, /comparisonItemsByRenderId/);
  assert.match(reviewDesk, /onPromoteCandidate/);
  assert.match(reviewDesk, /chooseCatalogOutcome/);
  assert.match(reviewStage, /ORIGINAL CATALOG/);
  assert.match(reviewStage, /NEW CANDIDATE/);
  assert.match(reviewStage, /<kbd>B<\/kbd> BOTH/);
  assert.match(reviewStage, /<kbd>N<\/kbd> NEW/);
  assert.match(gallery, /mode: placement/);
  const inspector = await readFile(
    new URL(
      "../app/_features/archive/candidate-inspector.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(inspector, /ADD AS VARIANT/);
  assert.match(inspector, /REPLACE ORIGINAL/);
  assert.match(inspector, /onPromote\(placement\)/);
  assert.match(inspector, /READY TO FILE/);
  const outcomeControl = await readFile(
    new URL(
      "../app/_features/review/catalog-outcome-control.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(outcomeControl, /Delete candidate/);
  assert.match(outcomeControl, /Remove candidate; keep original/);
  assert.match(outcomeControl, /Keep both/);
  assert.match(outcomeControl, /Keep new/);

  const archiveStyles = await readFile(
    new URL("../app/_styles/archive.css", import.meta.url),
    "utf8",
  );
  assert.match(
    archiveStyles,
    /\.candidate-comparison-art\s*\{[^}]*position:\s*relative;/s,
  );
  assert.match(
    archiveStyles,
    /\.candidate-action-note,\s*\.candidate-action-error\s*\{[^}]*margin:\s*-0\.35rem var\(--space-md\) 0;/s,
  );
});
