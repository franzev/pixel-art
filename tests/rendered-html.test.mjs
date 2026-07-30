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
});

test("catalog contains real responsive render data", async () => {
  const index = JSON.parse(
    await readFile(new URL("../app/art-index.json", import.meta.url), "utf8"),
  );
  const canonicalRenders = await walkFiles(
    path.join(siteDir, "public", "art"),
    (file) => file.toLowerCase().endsWith(".png"),
  );

  assert.ok(index.length >= 340, `Expected at least 340 renders, found ${index.length}`);
  assert.equal(index.length, canonicalRenders.length);
  assert.ok(index.some((item) => item.category === "enemies"));
  assert.ok(index.some((item) => item.category === "bosses"));
  assert.ok(index.some((item) => item.category === "environments"));
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
    index.every(
      (item) => item.category === "environments" || item.sourceAvailable,
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
  const assetRoots = [
    "angels",
    "bosses",
    "enemies",
    "environments",
    "protagonist",
  ];

  for (const rootName of [...assetRoots, "samples"]) {
    const entries = await readdir(path.join(repositoryDir, rootName), {
      withFileTypes: true,
    });
    const loosePngs = entries
      .filter(
        (entry) =>
          entry.isFile() && entry.name.toLowerCase().endsWith(".png"),
      )
      .map((entry) => entry.name);
    assert.deepEqual(
      loosePngs,
      [],
      `Loose PNGs found in ${rootName}: ${loosePngs.join(", ")}`,
    );
  }

  const workingPngs = (
    await Promise.all(
      assetRoots.map((rootName) =>
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

  const sourceName =
    /^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*(?:-v\d{2})?-source\.png$/;
  for (const file of workingPngs.filter((item) =>
    item.endsWith("-source.png"),
  )) {
    assert.match(path.basename(file), sourceName);
    const relative = path.relative(repositoryDir, file).split(path.sep);
    assert.ok(
      relative.length >= 3,
      `Source is missing its collection folder: ${file}`,
    );
  }
});

test("collection manifests point to the single canonical render copy", async () => {
  const categoryDirectories = [
    "angels",
    "bosses",
    "enemies",
    "environments",
    "protagonist",
  ];
  const manifests = (
    await Promise.all(
      categoryDirectories.map((category) =>
        walkFiles(
          path.join(repositoryDir, category),
          (file) => file.endsWith("-manifest.json"),
        ),
      ),
    )
  ).flat();

  assert.ok(manifests.length >= 10);

  for (const manifest of manifests) {
    const data = JSON.parse(await readFile(manifest, "utf8"));
    const assets = Array.isArray(data)
      ? data
      : (data.assets ?? data.entries ?? []);

    for (const asset of assets) {
      assert.ok(asset.source, `Missing source path in ${manifest}`);
      await access(path.join(repositoryDir, asset.source));

      const render = asset.reference_256 ?? asset.reference;
      assert.ok(render, `Missing render path in ${manifest}`);
      assert.ok(
        render.startsWith("public/art/"),
        `Render is outside public/art in ${manifest}: ${render}`,
      );
      await access(path.join(repositoryDir, render));
    }
  }
});
