import assert from "node:assert/strict";
import test from "node:test";
import { groupAttemptSeries } from "../app/_features/archive/archive-workspaces.ts";
import type { AttemptItem } from "../app/review-types.ts";

function attempt(
  id: string,
  series: string,
  number: number,
  generatedAt: string,
  sourceKind: AttemptItem["sourceKind"] = "archive",
): AttemptItem {
  return {
    id,
    renderId: `rnd_${id.padEnd(24, "0")}`,
    assetHash: id.padEnd(64, "0"),
    path: id,
    url: `/${id}.png`,
    name: id,
    filename: `${id}.png`,
    category: "enemies",
    collection: "Test Collection",
    status: "unreviewed",
    width: 1024,
    height: 1024,
    suggestedTags: [],
    attempt: number,
    concept: id.replace(/-\d+$/, ""),
    series,
    sourceKind,
    sourcePath: `archive/${id}.png`,
    generatedAt,
  };
}

test("attempt history is grouped by series with the newest output first", () => {
  const groups = groupAttemptSeries([
    attempt("alpha-1", "enemies/test/alpha", 1, "2026-08-01T10:00:00Z"),
    attempt(
      "alpha-2",
      "enemies/test/alpha",
      2,
      "2026-08-01T11:00:00Z",
      "redo-staging",
    ),
    attempt("beta-1", "enemies/test/beta", 1, "2026-08-02T10:00:00Z"),
  ]);

  assert.equal(groups.length, 2);
  assert.equal(groups[0].series, "enemies/test/beta");
  assert.equal(groups[1].latest.id, "alpha-2");
  assert.equal(groups[1].attempts.length, 2);
  assert.equal(groups[1].candidateCount, 1);
});
