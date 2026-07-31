import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryDir = path.resolve(scriptDir, "..");
const artDir = path.join(repositoryDir, "public", "art");
const categories = (await readdir(artDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
  .map((entry) => entry.name)
  .sort();
const scanRoots = categories.map((category) => path.join(artDir, category));

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    if (entry.isFile()) files.push(absolute);
  }

  return files;
}

const byHash = new Map();
let scanned = 0;

for (const root of scanRoots) {
  let files;
  try {
    files = await walk(root);
  } catch {
    continue;
  }

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".png")) continue;
    scanned += 1;
    const hash = createHash("sha256")
      .update(await readFile(file))
      .digest("hex");
    const relative = path.relative(repositoryDir, file);
    byHash.set(hash, [...(byHash.get(hash) ?? []), relative]);
  }
}

const groups = Array.from(byHash.values())
  .filter((paths) => paths.length > 1)
  .sort((a, b) => a[0].localeCompare(b[0]));

console.log(`Scanned ${scanned} PNGs across ${categories.join(", ")}.`);

if (!groups.length) {
  console.log("No byte-identical duplicates found.");
  process.exit(0);
}

console.log(`Found ${groups.length} duplicate group(s):\n`);
for (const paths of groups) {
  for (const [index, file] of paths.entries()) {
    console.log(index === 0 ? `• ${file}` : `  = ${file}`);
  }
  console.log("");
}
process.exit(1);
