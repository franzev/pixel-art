import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("contact sheet uses bounded row virtualization", async () => {
  const gallery = await readFile(
    new URL("../app/ArchiveGallery.tsx", import.meta.url),
    "utf8",
  );

  assert.match(gallery, /useVirtualizer\(\{/);
  assert.match(gallery, /overscan:\s*3/);
  assert.match(gallery, /INITIAL_RENDER_COUNT = 24/);
  assert.match(gallery, /items\.slice\(0, INITIAL_RENDER_COUNT\)/);
  assert.match(gallery, /items\.slice\(rowStart, rowStart \+ columnCount\)/);
  assert.match(gallery, /scrollToIndex/);
  assert.match(gallery, /scrollToOffset\(0\)/);
});

test("previews are responsive while review keeps the source PNG", async () => {
  const gallery = await readFile(
    new URL("../app/ArchiveGallery.tsx", import.meta.url),
    "utf8",
  );
  const reviewDesk = await readFile(
    new URL("../app/ReviewDesk.tsx", import.meta.url),
    "utf8",
  );
  const imageConfig = await readFile(
    new URL("../next.config.ts", import.meta.url),
    "utf8",
  );

  assert.match(gallery, /quality=\{82\}/);
  assert.match(gallery, /GRID_PREVIEW_SIZES/);
  assert.match(reviewDesk, /className="review-canvas-preview"/);
  assert.match(reviewDesk, /className="review-canvas-original"/);
  assert.match(reviewDesk, /src=\{item\.url\}/);
  assert.match(imageConfig, /"image\/avif", "image\/webp"/);
  assert.match(imageConfig, /qualities:\s*\[82\]/);
});
