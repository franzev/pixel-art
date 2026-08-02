import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const galleryUrl = new URL(
  "../app/_features/archive/archive-gallery.tsx",
  import.meta.url,
);

test("favorites persist by stable render identity", async () => {
  const config = await readFile(
    new URL("../app/_features/archive/archive-config.ts", import.meta.url),
    "utf8",
  );
  const preferences = await readFile(
    new URL(
      "../app/_features/archive/hooks/use-gallery-preferences.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const gallery = await readFile(galleryUrl, "utf8");

  assert.match(config, /const FAVORITES_STORAGE_KEY = "[^"]+"/);
  assert.match(preferences, /currentRenderIds\.has\(value\)/);
  assert.match(gallery, /toggleFavorite\(selected\.renderId\)/);
});

test("favorites can be toggled with F and filtered", async () => {
  const gallery = await readFile(galleryUrl, "utf8");
  const archiveFilters = await readFile(
    new URL("../app/_features/archive/archive-filters.ts", import.meta.url),
    "utf8",
  );
  const filterDrawer = await readFile(
    new URL(
      "../app/_features/archive/filters/filter-drawer.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(gallery, /event\.key\.toLocaleLowerCase\(\) === "f"/);
  assert.match(gallery, /!reviewOpen && view === "catalog" && selected/);
  assert.match(archiveFilters, /filters\.favorite === "favorite"/);
  assert.match(filterDrawer, /label="Favorites"/);
});
