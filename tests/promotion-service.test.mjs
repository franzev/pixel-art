import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  discardCandidateFile,
  isAllowedLocalOrigin,
  validateDiscardRequest,
  validatePromotionRequest,
} from "../scripts/promotion-service.mjs";
import { readFile } from "node:fs/promises";

test("promotion accepts only staged PNG candidates", () => {
  assert.deepEqual(
    validatePromotionRequest({
      candidatePath: "work/redo-staging/enemies/banshees/01-widow-v02.png",
      sourcePath: "enemies/banshees/01-widow.png",
      sourceRenderId: "rnd_0123456789abcdef01234567",
      mode: "variant",
    }),
    {
      candidatePath: "work/redo-staging/enemies/banshees/01-widow-v02.png",
      sourcePath: "enemies/banshees/01-widow.png",
      sourceRenderId: "rnd_0123456789abcdef01234567",
      mode: "variant",
    },
  );
  assert.throws(() =>
    validatePromotionRequest({
      candidatePath: "public/art/enemies/banshees/01-widow.png",
    }),
  );
  assert.throws(() =>
    validatePromotionRequest({
      candidatePath: "work/redo-staging/../../private.png",
    }),
  );
});

test("promotion rejects unsafe Catalog identity fields", () => {
  const candidatePath = "work/redo-staging/enemies/banshees/01-widow-v02.png";
  assert.throws(() =>
    validatePromotionRequest({
      candidatePath,
      sourcePath: "../outside.png",
    }),
  );
  assert.throws(() =>
    validatePromotionRequest({
      candidatePath,
      sourceRenderId: "att_not-a-review-identity",
    }),
  );
  assert.throws(() =>
    validatePromotionRequest({
      candidatePath,
      mode: "keep-everything",
    }),
  );
  assert.throws(() =>
    validatePromotionRequest({
      candidatePath,
      mode: "replace",
    }),
  );
});

test("candidate deletion is limited to redo staging", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "discard-candidate-"));
  const candidatePath =
    "work/redo-staging/enemies/fixture/01-candidate-v02.png";
  const absolute = path.join(root, candidatePath);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, "fixture");

  assert.deepEqual(validateDiscardRequest({ candidatePath }), {
    candidatePath,
  });
  assert.throws(() =>
    validateDiscardRequest({ candidatePath: "public/art/enemies/source.png" }),
  );

  assert.equal(
    await discardCandidateFile({ candidatePath }, { root }),
    "deleted",
  );
  await assert.rejects(access(absolute));
  assert.equal(
    await discardCandidateFile({ candidatePath }, { root }),
    "already_deleted",
  );
});

test("local promotion service does not allow arbitrary web origins", async () => {
  const source = await readFile(
    new URL("../scripts/promotion-service.mjs", import.meta.url),
    "utf8",
  );
  assert.match(source, /allowedOrigins/);
  assert.match(source, /\/render-gate\/status/);
  assert.match(source, /\/render-gate\/complete/);
  assert.match(source, /\/discard/);
  assert.doesNotMatch(source, /Access-Control-Allow-Origin": "\*"/);
});

test("local quality checks work from any loopback development port", () => {
  assert.equal(isAllowedLocalOrigin("http://localhost:3000"), true);
  assert.equal(isAllowedLocalOrigin("http://localhost:3001"), true);
  assert.equal(isAllowedLocalOrigin("http://127.0.0.1:4173"), true);
  assert.equal(isAllowedLocalOrigin("http://[::1]:3000"), true);
  assert.equal(isAllowedLocalOrigin("https://example.com"), false);
  assert.equal(
    isAllowedLocalOrigin("http://localhost.example.com:3000"),
    false,
  );
  assert.equal(isAllowedLocalOrigin("null"), false);
});
