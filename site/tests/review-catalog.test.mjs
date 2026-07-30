import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const indexUrl = new URL("../app/art-index.json", import.meta.url);

test("renders have stable content identities and optimistic tags", async () => {
  const items = JSON.parse(await readFile(indexUrl, "utf8"));
  assert.ok(items.length >= 400);

  const renderIds = new Set();
  for (const item of items) {
    assert.match(item.renderId, /^rnd_[0-9a-f]{24}$/);
    assert.match(item.assetHash, /^[0-9a-f]{64}$/);
    assert.equal(item.path, item.id);
    assert.ok(Array.isArray(item.suggestedTags));
    assert.ok(item.suggestedTags.length >= 3);
    assert.ok(
      item.suggestedTags.every(
        (tag) =>
          typeof tag.key === "string" &&
          typeof tag.label === "string" &&
          typeof tag.group === "string" &&
          ["path", "filename", "document", "visual"].includes(tag.source) &&
          tag.confidence >= 0 &&
          tag.confidence <= 1,
      ),
    );
    renderIds.add(item.renderId);
  }

  assert.equal(renderIds.size, items.length);
});

test("local review persistence and exports are configured", async () => {
  const hosting = JSON.parse(
    await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  );
  assert.equal(hosting.d1, "DB");

  const migration = await readFile(
    new URL("../drizzle/0000_optimal_jackal.sql", import.meta.url),
    "utf8",
  );
  for (const table of [
    "renders",
    "reviews",
    "review_tags",
    "review_defects",
    "review_events",
  ]) {
    assert.match(migration, new RegExp(`CREATE TABLE \\\`${table}\\\``));
  }
});
