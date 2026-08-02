import assert from "node:assert/strict";
import test from "node:test";
import { validatePromotionRequest } from "../scripts/promotion-service.mjs";
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
  assert.throws(() => validatePromotionRequest({
    candidatePath: "public/art/enemies/banshees/01-widow.png",
  }));
  assert.throws(() => validatePromotionRequest({
    candidatePath: "work/redo-staging/../../private.png",
  }));
});

test("promotion rejects unsafe Catalog identity fields", () => {
  const candidatePath = "work/redo-staging/enemies/banshees/01-widow-v02.png";
  assert.throws(() => validatePromotionRequest({
    candidatePath,
    sourcePath: "../outside.png",
  }));
  assert.throws(() => validatePromotionRequest({
    candidatePath,
    sourceRenderId: "att_not-a-review-identity",
  }));
  assert.throws(() => validatePromotionRequest({
    candidatePath,
    mode: "keep-everything",
  }));
  assert.throws(() =>
    validatePromotionRequest({
      candidatePath,
      mode: "replace",
    }),
  );
});

test("local promotion service does not allow arbitrary web origins", async () => {
  const source = await readFile(
    new URL("../scripts/promotion-service.mjs", import.meta.url),
    "utf8",
  );
  assert.match(source, /allowedOrigins/);
  assert.doesNotMatch(source, /Access-Control-Allow-Origin": "\*"/);
});
