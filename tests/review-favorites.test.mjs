import assert from "node:assert/strict";
import test from "node:test";

import { queueMatches } from "../app/_features/review/review-queue.ts";

const item = {
  id: "source",
  renderId: "source",
  assetHash: "source-hash",
  url: "/art/source.png",
  name: "Source",
  filename: "source.png",
  category: "enemies",
  collection: "fixture",
  status: "draft",
  width: 256,
  height: 256,
  suggestedTags: [],
};

test("Favorites queue follows the explicit star tag, not a five-star rating", () => {
  const fiveStarReview = { overallRating: 5 };

  assert.equal(
    queueMatches("favorites", item, fiveStarReview, new Set()),
    false,
  );
  assert.equal(
    queueMatches("favorites", item, undefined, new Set([item.renderId])),
    true,
  );
});
