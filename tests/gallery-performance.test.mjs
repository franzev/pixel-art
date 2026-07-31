import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("contact sheet uses bounded row virtualization", async () => {
  const archiveConfig = await readFile(
    new URL("../app/_features/archive/archive-config.ts", import.meta.url),
    "utf8",
  );
  const initialGrid = await readFile(
    new URL(
      "../app/_features/archive/grid/initial-render-grid.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const virtualizedGrid = await readFile(
    new URL(
      "../app/_features/archive/grid/virtualized-render-grid.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(virtualizedGrid, /useVirtualizer\(\{/);
  assert.match(virtualizedGrid, /overscan:\s*3/);
  assert.match(archiveConfig, /INITIAL_RENDER_COUNT = 24/);
  assert.match(initialGrid, /items\.slice\(0, INITIAL_RENDER_COUNT\)/);
  assert.match(
    virtualizedGrid,
    /items\.slice\(rowStart, rowStart \+ columnCount\)/,
  );
  assert.match(virtualizedGrid, /scrollToIndex/);
  assert.match(virtualizedGrid, /scrollToOffset\(0\)/);
});

test("previews are responsive while review keeps the source PNG", async () => {
  const previewImage = await readFile(
    new URL(
      "../app/_features/archive/grid/preview-image.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const reviewCanvasImage = await readFile(
    new URL(
      "../app/_features/review/review-canvas-image.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const imageConfig = await readFile(
    new URL("../next.config.ts", import.meta.url),
    "utf8",
  );

  assert.match(previewImage, /quality=\{82\}/);
  assert.match(previewImage, /GRID_PREVIEW_SIZES/);
  assert.match(reviewCanvasImage, /className="review-canvas-preview"/);
  assert.match(reviewCanvasImage, /className="review-canvas-original"/);
  assert.match(reviewCanvasImage, /src=\{item\.url\}/);
  assert.match(imageConfig, /"image\/avif", "image\/webp"/);
  assert.match(imageConfig, /qualities:\s*\[82\]/);
});
