import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  attemptFilename,
  nextAttemptNumber,
  normalizeSeries,
  saveRenderAttempt,
} from "../scripts/save-render-attempt.mjs";

test("attempt series stays inside a lowercase category/collection/concept path", () => {
  assert.equal(
    normalizeSeries(
      "enemies/blood-demon-knights-batch-37/13-oxblood-greatsword-pursuer",
    ),
    "enemies/blood-demon-knights-batch-37/13-oxblood-greatsword-pursuer",
  );
  assert.throws(() => normalizeSeries("../outside/concept"), /kebab-case/);
  assert.throws(() => normalizeSeries("enemies/Two Words/concept"), /kebab-case/);
});

test("attempt numbering is ordered and never reuses an existing slot", () => {
  assert.equal(attemptFilename(1), "attempt-01.png");
  assert.equal(
    nextAttemptNumber(["attempt-01.png", "attempt-03.png", "notes.txt"]),
    4,
  );
});

test("saving attempts preserves every output and refuses overwrites", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "render-attempt-"));
  const archiveRoot = path.join(temporary, "archive");
  const source = path.join(temporary, "generated.png");
  await writeFile(source, Buffer.from("generated render bytes"));

  const first = await saveRenderAttempt({
    source,
    series: "enemies/test-collection/01-test-concept",
    archiveRoot,
  });
  const second = await saveRenderAttempt({
    source,
    series: "enemies/test-collection/01-test-concept",
    archiveRoot,
  });

  assert.equal(first.file, "attempt-01.png");
  assert.equal(second.file, "attempt-02.png");
  assert.deepEqual(
    await readFile(path.join(archiveRoot, first.series, first.file)),
    Buffer.from("generated render bytes"),
  );
  await assert.rejects(
    saveRenderAttempt({
      source,
      series: first.series,
      attempt: 1,
      archiveRoot,
    }),
    /never overwritten/,
  );
});
