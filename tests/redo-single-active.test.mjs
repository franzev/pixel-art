import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const indexUrl = new URL("../app/art-index.json", import.meta.url);

const activeRedoSlots = [
  ["blood-demon-knights-batch-37", "01-blood-needle-duelist"],
  ["blood-demon-knights-batch-37", "02-vein-hook-arrestor"],
  ["blood-demon-knights-batch-37", "03-clot-sigil-bastion"],
  ["blood-demon-knights-batch-37", "08-sable-greatsword-pursuer"],
  ["blood-demon-knights-batch-37", "13-oxblood-greatsword-pursuer"],
  ["blood-priestesses-batch-39", "04-oxblood-quarrel-canoness"],
  ["blood-priestesses-batch-39", "06-oxblood-processional-mace-votary"],
  ["blood-priestesses-batch-39", "07-ivory-lance-sepulchral-votary"],
];

test("tracked redo slots expose one canonical catalog render", async () => {
  const items = JSON.parse(await readFile(indexUrl, "utf8"));

  for (const [collection, concept] of activeRedoSlots) {
    const siblingPattern = new RegExp(
      `^${concept.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:-v\\d+)?\\.png$`,
      "i",
    );
    const siblings = items.filter(
      (item) =>
        item.path.startsWith(`enemies/${collection}/drafts/`) &&
        siblingPattern.test(item.filename),
    );
    assert.equal(
      siblings.length,
      1,
      `${collection}/${concept} should have one active catalog render`,
    );
    assert.equal(siblings[0].filename, `${concept}.png`);
  }
});
