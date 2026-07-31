import { readdir, rename, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { siteDir } from "./sync-art.mjs";

const hostedArtDir = path.join(siteDir, "dist", "client", "art");
const concurrency = 4;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
      files.push(absolute);
    }
  }

  return files;
}

async function optimize(file) {
  const before = (await stat(file)).size;
  const temporary = `${file}.hosted-preview.png`;

  await sharp(file)
    .png({
      compressionLevel: 9,
      palette: true,
      quality: 80,
      colours: 192,
      dither: 0,
    })
    .toFile(temporary);
  await rename(temporary, file);

  return { before, after: (await stat(file)).size };
}

const files = await walk(hostedArtDir);
let cursor = 0;
let before = 0;
let after = 0;

async function worker() {
  while (cursor < files.length) {
    const file = files[cursor];
    cursor += 1;
    const result = await optimize(file);
    before += result.before;
    after += result.after;
  }
}

await Promise.all(
  Array.from({ length: Math.min(concurrency, files.length) }, () => worker()),
);

const megabytes = (bytes) => (bytes / 1024 / 1024).toFixed(1);
console.log(
  `Optimized ${files.length} hosted previews from ${megabytes(before)} MB to ${megabytes(after)} MB.`,
);
