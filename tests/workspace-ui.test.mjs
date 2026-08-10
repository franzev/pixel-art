import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the archive shell separates library, review, and attempts", async () => {
  const [header, toolbar] = await Promise.all([
    readFile(
      new URL("../app/_features/archive/archive-header.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/_features/archive/library-toolbar.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(header, />LIBRARY</);
  assert.match(header, />REVIEW</);
  assert.match(header, />ATTEMPTS</);
  assert.match(toolbar, /\bALL\b/);
  assert.match(toolbar, /FAVORITES/);
  assert.match(toolbar, /5★/);
  assert.doesNotMatch(toolbar, /UNREVIEWED|REDO ORIGINALS|AWAITING GENERATION/);
});

test("review rating and catalog comparison remain explicit", async () => {
  const desk = await readFile(
    new URL("../app/_features/review/review-desk.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(desk, /autoKeep/);
  assert.match(
    desk,
    /currentCandidate\?\.sourceKind === "redo-staging" && comparisonItem/,
  );
  assert.match(desk, /compareWithCatalog=\{catalogComparison\}/);
  assert.match(desk, /comparisonMode=\{catalogComparison\}/);
});

test("secondary archive data loads after the Library shell", async () => {
  const [page, archiveRoute, gallery] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/archive/route.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../app/_features/archive/archive-gallery.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(page, /items:\s*\[\]/);
  assert.match(page, /redoCompletions=\{\[\]\}/);
  assert.match(archiveRoute, /attemptCatalog/);
  assert.match(archiveRoute, /redoCompletions/);
  assert.match(gallery, /fetch\("\/api\/archive"/);
});

test("every interactive control exposes the expected pointer cursor", async () => {
  const foundation = await readFile(
    new URL("../app/_styles/foundation.css", import.meta.url),
    "utf8",
  );

  for (const selector of [
    "a[href]",
    "button:not(:disabled)",
    "select:not(:disabled)",
    "summary",
    'input[type="checkbox"]:not(:disabled)',
    'input[type="radio"]:not(:disabled)',
    '[role="button"]:not([aria-disabled="true"])',
    '[role="checkbox"]:not([aria-disabled="true"])',
    '[role="radio"]:not([aria-disabled="true"])',
    '[role="tab"]:not([aria-disabled="true"])',
  ]) {
    assert.ok(
      foundation.includes(selector),
      `missing pointer cursor contract for ${selector}`,
    );
  }
  assert.match(foundation, /cursor: pointer/);
  assert.match(foundation, /button:disabled[\s\S]*cursor: not-allowed/);
});
