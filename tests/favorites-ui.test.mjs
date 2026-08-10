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
  const toolbar = await readFile(
    new URL("../app/_features/archive/library-toolbar.tsx", import.meta.url),
    "utf8",
  );

  assert.match(gallery, /event\.key\.toLocaleLowerCase\(\) === "f"/);
  assert.match(gallery, /!reviewOpen && view === "catalog" && selected/);
  assert.match(archiveFilters, /filters\.favorite === "favorite"/);
  assert.match(toolbar, /FAVORITES/);
  assert.match(toolbar, /onShowFavorites/);
  assert.match(gallery, /updateQuickFilter\("favorite", "favorite"\)/);
});

test("review favorite action stays visible above overall rating", async () => {
  const reviewPanel = await readFile(
    new URL("../app/_features/review/review-panel.tsx", import.meta.url),
    "utf8",
  );

  const favoritePosition = reviewPanel.indexOf("<FavoriteControl");
  const ratingPosition = reviewPanel.indexOf("<RatingControl");
  const detailsPosition = reviewPanel.indexOf(
    '<details className="review-more-details"',
  );

  assert.notEqual(favoritePosition, -1);
  assert.ok(favoritePosition < ratingPosition);
  assert.ok(ratingPosition < detailsPosition);
});
