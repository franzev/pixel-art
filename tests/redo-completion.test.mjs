import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { syncRedoCompletions } from "../scripts/sync-redo-completions.mjs";

test("redo completion requires a saved candidate and deduplicates source renders", async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "redo-completion-"));
  const selectionsRoot = path.join(fixture, "_inspection");
  const stagingRoot = path.join(fixture, "staging");
  const outputIndex = path.join(fixture, "redo-completion-index.json");
  await mkdir(selectionsRoot, { recursive: true });
  await mkdir(path.join(stagingRoot, "enemies", "sample", "drafts"), {
    recursive: true,
  });
  await writeFile(
    path.join(selectionsRoot, "selection.json"),
    JSON.stringify([
      {
        renderId: "rnd_111111111111111111111111",
        path: "enemies/sample/drafts/01-completed.png",
      },
      {
        renderId: "rnd_222222222222222222222222",
        path: "enemies/sample/drafts/02-pending.png",
      },
    ]),
  );
  await writeFile(
    path.join(selectionsRoot, "selection-02.json"),
    JSON.stringify([
      {
        renderId: "rnd_111111111111111111111111",
        path: "enemies/sample/drafts/01-completed.png",
      },
    ]),
  );
  await writeFile(
    path.join(
      stagingRoot,
      "enemies",
      "sample",
      "drafts",
      "01-completed-v02.png",
    ),
    "candidate",
  );

  try {
    const completions = await syncRedoCompletions({
      selectionsRoot,
      stagingRoot,
      outputIndex,
    });
    const written = JSON.parse(await readFile(outputIndex, "utf8"));

    assert.equal(completions.length, 1);
    assert.deepEqual(written, completions);
    assert.equal(completions[0].sourceRenderId, "rnd_111111111111111111111111");
    assert.deepEqual(completions[0].selectionFiles, [
      "selection-02.json",
      "selection.json",
    ]);
    assert.deepEqual(completions[0].candidatePaths, [
      "enemies/sample/drafts/01-completed-v02.png",
    ]);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("gallery keeps completed sources visible in the marked-for-redo view", async () => {
  const filters = await readFile(
    new URL("../app/_features/archive/archive-filters.ts", import.meta.url),
    "utf8",
  );
  const gallery = await readFile(
    new URL("../app/_features/archive/archive-gallery.tsx", import.meta.url),
    "utf8",
  );
  const galleryFilters = await readFile(
    new URL(
      "../app/_features/archive/hooks/use-gallery-filters.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const catalogRoute = await readFile(
    new URL("../app/api/catalog/route.ts", import.meta.url),
    "utf8",
  );
  const reviewQueue = await readFile(
    new URL("../app/_features/review/review-queue.ts", import.meta.url),
    "utf8",
  );
  const reviewWorkspace = await readFile(
    new URL("../app/_features/archive/review-workspace.tsx", import.meta.url),
    "utf8",
  );

  assert.match(filters, /filters\.decision === "redo-pending"/);
  assert.match(filters, /isRedoAwaitingGeneration/);
  assert.match(gallery, /openRedoSources/);
  assert.match(gallery, /redoSourcesAvailable/);
  assert.match(gallery, /onOpenRedoSources=\{openRedoSources\}/);
  assert.match(reviewWorkspace, /progress\.queue\.redoSourcesAvailable/);
  assert.doesNotMatch(gallery, /redoRecordedCount/);
  assert.match(
    galleryFilters,
    /\["reject", "redo-pending"\]\.includes\(next\.decision\)/,
  );
  assert.match(gallery, /redoCompletionVersion/);
  assert.match(catalogRoute, /redoCompletionIndex/);
  assert.match(
    reviewQueue,
    /queue === "rejected"\) return review\?\.decision === "reject"/,
  );
  assert.doesNotMatch(reviewQueue, /completedRedoRenderIds/);
});
