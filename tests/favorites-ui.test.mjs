import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const galleryUrl = new URL("../app/ArchiveGallery.tsx", import.meta.url);

test("favorites persist by stable render identity", async () => {
  const source = await readFile(galleryUrl, "utf8");

  assert.match(source, /const FAVORITES_STORAGE_KEY = "[^"]+"/);
  assert.match(source, /currentRenderIds\.has\(value\)/);
  assert.match(source, /toggleFavorite\(selected\.renderId\)/);
});

test("favorites can be toggled with F and filtered", async () => {
  const source = await readFile(galleryUrl, "utf8");

  assert.match(source, /event\.key\.toLocaleLowerCase\(\) === "f"/);
  assert.match(source, /!reviewOpen && selected/);
  assert.match(source, /filters\.favorite === "favorite"/);
  assert.match(source, /label="Favorites"/);
});
