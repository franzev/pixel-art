import assert from "node:assert/strict";
import test from "node:test";
import {
  assertNoVersionSiblings,
  versionSiblingGroups,
} from "../scripts/sync-art.mjs";

test("catalog sync detects canonical/version sibling duplicates", () => {
  const paths = [
    "enemies/example/drafts/01-warden.png",
    "enemies/example/drafts/01-warden-v02.png",
    "enemies/example/drafts/02-scout-v03.png",
  ];
  assert.deepEqual(versionSiblingGroups(paths), [
    {
      canonicalPath: "enemies/example/drafts/01-warden.png",
      siblings: [
        "enemies/example/drafts/01-warden-v02.png",
        "enemies/example/drafts/01-warden.png",
      ],
    },
  ]);
  assert.throws(
    () => assertNoVersionSiblings(paths),
    /duplicate review items/,
  );
  assert.doesNotThrow(() =>
    assertNoVersionSiblings(["enemies/example/drafts/02-scout-v03.png"]),
  );
});
