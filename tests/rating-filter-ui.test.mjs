import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("rating filters support exact multi-select and comparisons", async () => {
  const filterSource = await readFile(
    new URL("../app/_features/archive/archive-filters.ts", import.meta.url),
    "utf8",
  );
  const ratingSource = await readFile(
    new URL("../app/_features/archive/filters/rating-filter.tsx", import.meta.url),
    "utf8",
  );
  const drawerSource = await readFile(
    new URL("../app/_features/archive/filters/filter-drawer.tsx", import.meta.url),
    "utf8",
  );

  assert.match(filterSource, /parseRatingFilter/);
  assert.match(filterSource, /serializeRatingFilter/);
  assert.match(filterSource, /mode === "greater"/);
  assert.match(filterSource, /mode: "greater" \| "less"/);
  assert.match(ratingSource, /Exact ratings/);
  assert.match(ratingSource, /Greater than/);
  assert.match(ratingSource, /Less than/);
  assert.match(ratingSource, /type="checkbox"/);
  assert.match(drawerSource, /<RatingFilter/);
});
