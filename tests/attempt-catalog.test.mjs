import assert from "node:assert/strict";
import { mkdir, readFile, readlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { mkdtemp } from "node:fs/promises";

import { syncAttempts } from "../scripts/sync-attempts.mjs";

function png(width, height, marker = 0) {
  const bytes = Buffer.alloc(32);
  Buffer.from("89504e470d0a1a0a", "hex").copy(bytes, 0);
  bytes[8] = marker;
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  Buffer.from("49454e44ae426082", "hex").copy(bytes, 24);
  return bytes;
}

test("attempt index exposes every archived and staged output outside the catalog", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "attempt-catalog-"));
  const archiveRoot = path.join(temporary, "archive", "render-attempts");
  const stagingRoot = path.join(temporary, "work", "redo-staging");
  const series = path.join(
    archiveRoot,
    "enemies",
    "blood-demon-knights-batch-37",
    "13-oxblood-greatsword-pursuer",
  );
  const outputIndex = path.join(temporary, "app", "attempt-index.json");
  const publicLink = path.join(temporary, "public", "attempts");
  const stagingPublicLink = path.join(temporary, "public", "staged-attempts");
  const stagedSeries = path.join(
    stagingRoot,
    "protagonist",
    "holy-knight-realism-pass-v05",
    "drafts",
  );
  const duplicateStagedSeries = path.join(
    stagingRoot,
    "enemies",
    "blood-demon-knights-batch-37",
    "rejected",
  );

  await mkdir(series, { recursive: true });
  await mkdir(stagedSeries, { recursive: true });
  await mkdir(duplicateStagedSeries, { recursive: true });
  await mkdir(path.dirname(outputIndex), { recursive: true });
  await mkdir(path.dirname(publicLink), { recursive: true });
  await writeFile(path.join(series, "attempt-02.png"), png(1254, 1254));
  await writeFile(path.join(series, "attempt-01.png"), png(1024, 1024));
  await writeFile(
    path.join(stagedSeries, "04-pierced-visor-templar-v02.png"),
    png(1254, 1254, 1),
  );
  await writeFile(
    path.join(
      duplicateStagedSeries,
      "13-oxblood-greatsword-pursuer-v02.png",
    ),
    png(1254, 1254),
  );

  const attempts = await syncAttempts({
    archiveRoot,
    stagingRoot,
    outputIndex,
    publicLink,
    stagingPublicLink,
  });

  assert.equal(attempts.length, 4);
  const archivedFirst = attempts.find((item) => item.filename === "attempt-01.png");
  const stagedTemplar = attempts.find(
    (item) => item.filename === "04-pierced-visor-templar-v02.png",
  );
  assert.equal(archivedFirst.concept, "Oxblood Greatsword Pursuer");
  assert.equal(archivedFirst.collection, "Blood Demon Knights Batch 37");
  assert.equal(archivedFirst.url, "/attempts/enemies/blood-demon-knights-batch-37/13-oxblood-greatsword-pursuer/attempt-01.png");
  assert.equal(archivedFirst.width, 1024);
  assert.match(archivedFirst.renderId, /^rnd_[0-9a-f]{24}$/);
  assert.match(archivedFirst.generatedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(archivedFirst.status, "unreviewed");
  assert.equal(stagedTemplar.concept, "Pierced Visor Templar");
  assert.equal(stagedTemplar.sourceKind, "redo-staging");
  assert.equal(
    stagedTemplar.url,
    "/staged-attempts/protagonist/holy-knight-realism-pass-v05/drafts/04-pierced-visor-templar-v02.png",
  );

  const written = JSON.parse(await readFile(outputIndex, "utf8"));
  assert.deepEqual(written, attempts);
  assert.equal(
    path.resolve(path.dirname(publicLink), await readlink(publicLink)),
    archiveRoot,
  );
  assert.equal(
    path.resolve(
      stagingPublicLink,
      await readlink(path.join(stagingPublicLink, "protagonist")),
    ),
    path.join(stagingRoot, "protagonist"),
  );
});

test("the Courtesans display label preserves the historical collection key", async () => {
  const artSync = await readFile(
    new URL("../scripts/sync-art.mjs", import.meta.url),
    "utf8",
  );
  const attemptSync = await readFile(
    new URL("../scripts/sync-attempts.mjs", import.meta.url),
    "utf8",
  );
  assert.match(artSync, /"sex-workers-v01": "Courtesans"/);
  assert.match(artSync, /collectionKey\.replace\(\/-v\\d\+\$\/i, ""\)/);
  assert.match(attemptSync, /"sex-workers-v01": "Courtesans"/);
});
