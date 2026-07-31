import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(testDir, "..");
const repositoryDir = siteDir;

async function walkFiles(directory, predicate) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(absolute, predicate)));
    } else if (entry.isFile() && predicate(absolute)) {
      files.push(absolute);
    }
  }
  return files;
}

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: {
        accept: "text/html",
        host: "localhost",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the archive shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>The Ashen Archive<\/title>/i);
  assert.match(html, /THE ASHEN ARCHIVE/);
  assert.match(html, /PRIVATE RENDER INDEX/);
  assert.match(html, /CONTACT SHEET/);
  assert.match(html, /Search renders/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);

  const renderedTiles = html.match(/data-render-index=/g) ?? [];
  assert.equal(
    renderedTiles.length,
    24,
    "The server should render only the hydration contact sheet",
  );
  assert.doesNotMatch(
    html,
    /<img[^>]+src="\/art\//i,
    "Grid and inspector images must use responsive transforms",
  );
  assert.match(html, /\/_vinext\/image\?/);
  assert.doesNotMatch(html, /"assetHash":|"suggestedTags":/);
  assert.ok(
    Buffer.byteLength(html) < 650_000,
    `Initial HTML is too large: ${Buffer.byteLength(html)} bytes`,
  );
});

test("catalog contains real responsive render data", async () => {
  const index = JSON.parse(
    await readFile(new URL("../app/art-index.json", import.meta.url), "utf8"),
  );
  const canonicalRenders = await walkFiles(
    path.join(siteDir, "public", "art"),
    (file) => file.toLowerCase().endsWith(".png"),
  );

  assert.ok(index.length >= 250, `Expected a populated catalog, found ${index.length}`);
  assert.equal(index.length, canonicalRenders.length);
  assert.ok(index.some((item) => item.category === "enemies"));
  assert.ok(index.some((item) => item.category === "angels"));
  assert.ok(index.some((item) => item.category === "npcs"));
  assert.ok(index.some((item) => item.category === "protagonist"));
  assert.ok(
    index.some((item) =>
      item.id.includes("holy-knight-helmet-orders-v03"),
    ),
  );
  assert.ok(index.every((item) => item.url.startsWith("/art/")));
  assert.ok(index.every((item) => item.width > 0 && item.height > 0));
  assert.ok(index.every((item) => item.id.split("/").length >= 3));
  assert.ok(
    index.every(
      (item) => !["drafts", "rejected"].includes(item.id.split("/")[1]),
    ),
  );
  assert.ok(
    index
      .filter((item) =>
        /(lantern-faced-novice|starless-astrologer|blind-standard-bearer)/.test(
          item.id,
        ),
      )
      .every((item) => item.category === "enemies"),
  );
  assert.ok(
    index
      .filter((item) => item.id.includes("/rejected/first-pass/"))
      .every(
        (item) =>
          item.collection === "Ghouls Haunts Curses Batch 12 · Rejected",
      ),
  );
  assert.ok(
    index
      .filter((item) => item.id.includes("/rejected/effects-first-pass/"))
      .every(
        (item) =>
          item.collection ===
          "Spanish Colonial Corruption Batch 09 · Rejected",
      ),
  );
  assert.ok(
    index
      .filter((item) => item.id.includes("rejected/effects-first-pass"))
      .every((item) => item.status === "rejected"),
  );
  assert.ok(
    index
      .filter((item) => item.id.includes("rejected/first-pass"))
      .every((item) => item.status === "rejected"),
  );

  for (const item of index) {
    await access(path.join(siteDir, "public", "art", item.id));
    await assert.rejects(access(path.join(repositoryDir, item.id)));
  }
});

test("working assets use collection-first paths without render duplicates", async () => {
  const formerAssetRoots = [
    "angels",
    "bosses",
    "enemies",
    "environments",
    "npcs",
    "protagonist",
  ];

  for (const rootName of formerAssetRoots) {
    await assert.rejects(
      access(path.join(repositoryDir, rootName)),
      `Legacy root category still exists: ${rootName}`,
    );
  }

  const collectionPngs = await walkFiles(
    path.join(repositoryDir, "collections"),
    (file) => file.toLowerCase().endsWith(".png"),
  );
  assert.deepEqual(collectionPngs, [], "Collection records must remain text-only");

  const workingPngs = (
    await Promise.all(
      [
        path.join("archive", "legacy-art"),
        path.join("art-catalog", "review-sheets"),
        "samples",
      ].map((rootName) =>
        walkFiles(
          path.join(repositoryDir, rootName),
          (file) => file.toLowerCase().endsWith(".png"),
        ),
      ),
    )
  ).flat();
  const websitePngs = await walkFiles(
    path.join(siteDir, "public", "art"),
    (file) => file.toLowerCase().endsWith(".png"),
  );

  const workingHashes = new Map();
  for (const file of workingPngs) {
    const hash = createHash("sha256")
      .update(await readFile(file))
      .digest("hex");
    workingHashes.set(hash, file);
  }

  for (const file of websitePngs) {
    const hash = createHash("sha256")
      .update(await readFile(file))
      .digest("hex");
    assert.equal(
      workingHashes.has(hash),
      false,
      `Website render duplicates ${workingHashes.get(hash)}: ${file}`,
    );
  }

  for (const file of workingPngs.filter((item) =>
    item.endsWith("-source.png"),
  )) {
    assert.ok(
      file.startsWith(path.join(repositoryDir, "archive", "legacy-art")) ||
        file.startsWith(path.join(repositoryDir, "samples")),
      `Source exists outside quarantine or intentional samples: ${file}`,
    );
  }
});

test("collection manifests point to the single canonical render copy", async () => {
  const manifests = await walkFiles(
    path.join(repositoryDir, "collections"),
    (file) => file.endsWith("-manifest.json"),
  );

  assert.ok(manifests.length >= 10);
  let canonicalEntries = 0;

  for (const manifest of manifests) {
    const data = JSON.parse(await readFile(manifest, "utf8"));
    const assets = Array.isArray(data)
      ? data
      : (data.assets ?? data.entries ?? []);

    for (const asset of assets) {
      const render = asset.render;
      if (!render) continue;

      canonicalEntries += 1;
      assert.ok(
        render.startsWith("public/art/"),
        `Render is outside public/art in ${manifest}: ${render}`,
      );
      await access(path.join(repositoryDir, render));
      assert.equal(
        "source" in asset || "reference_256" in asset || "reference" in asset,
        false,
        `Canonical manifest entry keeps a duplicate render field in ${manifest}`,
      );
    }
  }

  assert.ok(canonicalEntries > 0, "No canonical manifest render entries found");
});
