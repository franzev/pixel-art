import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const indexUrl = new URL("../app/art-index.json", import.meta.url);

test("renders have stable content identities and optimistic tags", async () => {
  const items = JSON.parse(await readFile(indexUrl, "utf8"));
  assert.ok(items.length >= 250);

  const renderIdentities = new Map();
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
    const existingHash = renderIdentities.get(item.renderId);
    if (existingHash) assert.equal(existingHash, item.assetHash);
    renderIdentities.set(item.renderId, item.assetHash);
  }

  assert.ok(renderIdentities.size > 0);
});

test("race and gender tags follow authored character concepts", async () => {
  const items = JSON.parse(await readFile(indexUrl, "utf8"));
  const byFilename = (collection, filename) => {
    const item = items.find(
      (entry) =>
        entry.path.includes(`/${collection}/`) && entry.filename === filename,
    );
    assert.ok(item, `Missing ${collection}/${filename}`);
    return item;
  };
  const tagValue = (item, group) =>
    item.suggestedTags.find((tag) => tag.group === group)?.key;

  for (const item of items) {
    if (item.category === "environments") continue;
    assert.equal(
      item.suggestedTags.filter((tag) => tag.group === "race").length,
      1,
      `${item.path} must have exactly one race tag`,
    );
  }

  const aswang = byFilename(
    "aswang-knights-batch-37",
    "01-night-marrow-lance-warden.png",
  );
  assert.equal(tagValue(aswang, "race"), "race:aswang");
  assert.equal(
    tagValue(aswang, "gender-presentation"),
    "gender-presentation:masculine",
  );

  const banshee = byFilename(
    "banshees-batch-33",
    "03-comb-reclaiming-widow.png",
  );
  assert.equal(tagValue(banshee, "race"), "race:ghost");
  assert.equal(
    tagValue(banshee, "gender-presentation"),
    "gender-presentation:feminine",
  );

  const priestess = byFilename(
    "blood-priestesses-batch-39",
    "10-pale-grave-hammer-canoness.png",
  );
  assert.equal(tagValue(priestess, "race"), "race:human");

  const forestElf = byFilename(
    "forest-elf-sword-knights-batch-35",
    "01-moss-sash-sword-warden.png",
  );
  assert.equal(tagValue(forestElf, "race"), "race:elf");
  assert.equal(
    tagValue(forestElf, "gender-presentation"),
    "gender-presentation:feminine",
  );

  const maleThornKnight = byFilename(
    "crown-of-thorns-knights-batch-40",
    "01-ash-briar-falchion-reeve.png",
  );
  const femaleThornKnight = byFilename(
    "crown-of-thorns-knights-batch-40",
    "02-thorn-peak-lucerne-warden.png",
  );
  assert.equal(
    tagValue(maleThornKnight, "gender-presentation"),
    "gender-presentation:masculine",
  );
  assert.equal(
    tagValue(femaleThornKnight, "gender-presentation"),
    "gender-presentation:feminine",
  );

  const vampire = byFilename(
    "maria-clara-corruptions-batch-41",
    "02-capiz-mirror-heiress.png",
  );
  const zombie = byFilename(
    "maria-clara-corruptions-batch-41",
    "05-grave-sickle-harvest-widow.png",
  );
  assert.equal(tagValue(vampire, "race"), "race:vampire");
  assert.equal(tagValue(zombie, "race"), "race:zombie");

  const vampireMinionExpectations = [
    ["01-grave-step-usher.png", "masculine"],
    ["02-veil-neck-handmaid.png", "feminine"],
    ["04-tapis-hem-stalker.png", "feminine"],
  ];
  for (const [filename, gender] of vampireMinionExpectations) {
    const minion = byFilename(
      "creepy-vampire-minions-batch-05",
      filename,
    );
    assert.equal(tagValue(minion, "race"), "race:vampire");
    assert.equal(
      tagValue(minion, "gender-presentation"),
      `gender-presentation:${gender}`,
    );
  }

  for (const [collection, filename] of [
    ["murderous-courtesans-batch-47", "01-oxblood-bolo-hostess.png"],
    ["short-haired-inquisitors-batch-48", "01-copper-bob-castellan.png"],
  ]) {
    const item = byFilename(collection, filename);
    assert.equal(tagValue(item, "race"), "race:human");
    assert.equal(
      tagValue(item, "gender-presentation"),
      "gender-presentation:feminine",
    );
  }

  const witchHunterExpectations = [
    ["01-ash-road-bolo-pursuer.png", "masculine"],
    ["02-capiz-lens-crossbow-examiner.png", "feminine"],
    ["03-palm-fiber-arquebus-tracker.png", "masculine"],
    ["04-black-veil-estoc-confessor.png", "feminine"],
    ["05-iron-seal-lucerne-hunter.png", "masculine"],
  ];
  for (const [filename, gender] of witchHunterExpectations) {
    const hunter = byFilename("witch-hunters-batch-47", filename);
    assert.equal(tagValue(hunter, "race"), "race:human");
    assert.equal(
      tagValue(hunter, "gender-presentation"),
      `gender-presentation:${gender}`,
    );
  }
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

  const catalogMigration = await readFile(
    new URL("../drizzle/0001_careful_boomerang.sql", import.meta.url),
    "utf8",
  );
  assert.match(catalogMigration, /CREATE TABLE `catalog_state`/);
});

test("review desk snapshots the contact sheet's filtered render scope", async () => {
  const gallerySource = await readFile(
    new URL("../app/_features/archive/archive-gallery.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    gallerySource,
    /setReviewItems\(filteredItems\)/,
    "Opening Review must snapshot the filtered contact sheet",
  );
  assert.match(
    gallerySource,
    /<ReviewDesk\s+items=\{reviewItems\}/,
    "Opening Review from a filtered contact sheet must not fall back to the full catalog",
  );
});

test("review loading leaves catalog synchronization on the server", async () => {
  const storeSource = await readFile(
    new URL("../app/_features/review/use-review-store.ts", import.meta.url),
    "utf8",
  );
  const reviewRouteSource = await readFile(
    new URL("../app/api/reviews/route.ts", import.meta.url),
    "utf8",
  );
  const catalogRouteSource = await readFile(
    new URL("../app/api/catalog/route.ts", import.meta.url),
    "utf8",
  );
  const syncSource = await readFile(
    new URL("../db/catalog-sync.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(storeSource, /fetch\("\/api\/catalog"/);
  assert.match(storeSource, /fetch\("\/api\/reviews"/);
  assert.match(storeSource, /renderId:\s*item\.renderId/);
  assert.doesNotMatch(catalogRouteSource, /export async function POST/);
  assert.match(reviewRouteSource, /ensureCatalogSynced\(catalogItems\)/);
  assert.match(reviewRouteSource, /catalogByRenderId\.get\(payload\.renderId\)/);
  assert.match(syncSource, /SELECT version FROM catalog_state/);
  assert.match(syncSource, /current\?\.version === version/);
});

test("gallery transport removes server-only render metadata", async () => {
  const source = await readFile(
    new URL("../app/gallery-catalog.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /tagDefinitionIds/);
  assert.match(source, /tagDefinitions/);
  assert.doesNotMatch(source, /assetHash:\s*item\.assetHash/);
  assert.doesNotMatch(source, /path:\s*item\.path/);
});
