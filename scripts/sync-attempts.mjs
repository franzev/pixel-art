import { createHash } from "node:crypto";
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  readlink,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
export const siteDir = path.resolve(scriptDir, "..");
export const attemptDir = path.join(siteDir, "archive", "render-attempts");
export const stagingDir = path.join(siteDir, "work", "redo-staging");
const defaultOutputIndex = path.join(siteDir, "app", "attempt-index.json");
const defaultPublicLink = path.join(siteDir, "public", "attempts");
const defaultStagingPublicLink = path.join(siteDir, "public", "staged-attempts");
const collectionLabels = {
  "sex-workers-v01": "Courtesans",
};

async function walk(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }

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

function humanize(value) {
  return value
    .replace(/^\d{1,3}-/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function collectionName(value) {
  return collectionLabels[value] ?? humanize(value);
}

async function pngMetadata(file) {
  const buffer = await readFile(file);
  const stats = await lstat(file);
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`Attempt is not a PNG: ${file}`);
  }
  if (
    buffer.length < 24 ||
    buffer.subarray(buffer.length - 8).toString("hex") !== "49454e44ae426082"
  ) {
    throw new Error(`Attempt PNG is incomplete: ${file}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    assetHash: createHash("sha256").update(buffer).digest("hex"),
    generatedAt: stats.mtime.toISOString(),
  };
}

function parseAttemptPath(relativePath) {
  const normalized = relativePath.split(path.sep).join("/");
  const parts = normalized.split("/");
  const filename = parts.at(-1) ?? "";
  const match = filename.match(/^attempt-(\d{2,})\.png$/i);
  if (parts.length !== 4 || !match) {
    throw new Error(
      `Attempt paths must be <category>/<collection>/<concept>/attempt-NN.png: ${normalized}`,
    );
  }
  return {
    normalized,
    category: parts[0],
    collectionKey: parts[1],
    conceptKey: parts[2],
    filename,
    attempt: Number(match[1]),
  };
}

function parseStagedPath(relativePath) {
  const normalized = relativePath.split(path.sep).join("/");
  const parts = normalized.split("/");
  const filename = parts.at(-1) ?? "";
  const match = filename.match(/^(\d{1,3})-(.+)-v(\d+)\.png$/i);
  if (parts.length < 3 || !match) return null;
  return {
    normalized,
    category: parts[0],
    collectionKey: parts[1],
    conceptKey: match[2],
    filename,
    attempt: Number(match[3]),
  };
}

async function ensurePublicLink(archiveRoot, publicLink) {
  await mkdir(path.dirname(publicLink), { recursive: true });
  const relativeTarget = path.relative(path.dirname(publicLink), archiveRoot);

  try {
    const stats = await lstat(publicLink);
    if (!stats.isSymbolicLink()) {
      throw new Error(
        `Attempt asset path exists and is not a symlink: ${publicLink}`,
      );
    }
    const existingTarget = await readlink(publicLink);
    if (
      path.resolve(path.dirname(publicLink), existingTarget) !==
      path.resolve(archiveRoot)
    ) {
      throw new Error(`Attempt asset symlink points elsewhere: ${publicLink}`);
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    await symlink(relativeTarget, publicLink, "dir");
  }
}

async function ensureStagingPublicLinks(stagingRoot, publicRoot) {
  await mkdir(path.dirname(publicRoot), { recursive: true });
  try {
    const stats = await lstat(publicRoot);
    if (stats.isSymbolicLink()) {
      const existingTarget = await readlink(publicRoot);
      if (
        path.resolve(path.dirname(publicRoot), existingTarget) !==
        path.resolve(stagingRoot)
      ) {
        throw new Error(
          `Staged attempt asset symlink points elsewhere: ${publicRoot}`,
        );
      }
      await unlink(publicRoot);
    } else if (!stats.isDirectory()) {
      throw new Error(
        `Staged attempt asset path is not a directory: ${publicRoot}`,
      );
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  await mkdir(publicRoot, { recursive: true });
  const categories = (await readdir(stagingRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name);

  for (const category of categories) {
    await ensurePublicLink(
      path.join(stagingRoot, category),
      path.join(publicRoot, category),
    );
  }
}

export async function syncAttempts({
  archiveRoot = attemptDir,
  stagingRoot = stagingDir,
  outputIndex = defaultOutputIndex,
  publicLink = defaultPublicLink,
  stagingPublicLink = defaultStagingPublicLink,
} = {}) {
  await mkdir(archiveRoot, { recursive: true });
  await mkdir(stagingRoot, { recursive: true });
  await ensurePublicLink(archiveRoot, publicLink);
  await ensureStagingPublicLinks(stagingRoot, stagingPublicLink);
  const archiveFiles = await walk(archiveRoot);
  const stagingFiles = await walk(stagingRoot);
  const attempts = [];

  for (const absolute of archiveFiles) {
    const parsed = parseAttemptPath(path.relative(archiveRoot, absolute));
    const metadata = await pngMetadata(absolute);

    attempts.push({
      id: `attempts/${parsed.normalized}`,
      renderId: `rnd_${metadata.assetHash.slice(0, 24)}`,
      assetHash: metadata.assetHash,
      path: `archive/render-attempts/${parsed.normalized}`,
      url: `/attempts/${parsed.normalized
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
      name: humanize(parsed.conceptKey),
      filename: parsed.filename,
      category: parsed.category,
      collection: collectionName(parsed.collectionKey),
      status: "unreviewed",
      width: metadata.width,
      height: metadata.height,
      suggestedTags: [],
      attempt: parsed.attempt,
      concept: humanize(parsed.conceptKey),
      series: `${parsed.category}/${parsed.collectionKey}/${parsed.conceptKey}`,
      sourceKind: "archive",
      sourcePath: `archive/render-attempts/${parsed.normalized}`,
      generatedAt: metadata.generatedAt,
    });
  }

  for (const absolute of stagingFiles) {
    const parsed = parseStagedPath(path.relative(stagingRoot, absolute));
    if (!parsed) continue;
    const metadata = await pngMetadata(absolute);

    attempts.push({
      id: `staged-attempts/${parsed.normalized}`,
      renderId: `rnd_${metadata.assetHash.slice(0, 24)}`,
      assetHash: metadata.assetHash,
      path: `work/redo-staging/${parsed.normalized}`,
      url: `/staged-attempts/${parsed.normalized
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
      name: humanize(parsed.conceptKey),
      filename: parsed.filename,
      category: parsed.category,
      collection: collectionName(parsed.collectionKey),
      status: "unreviewed",
      width: metadata.width,
      height: metadata.height,
      suggestedTags: [],
      attempt: parsed.attempt,
      concept: humanize(parsed.conceptKey),
      series: `${parsed.category}/${parsed.collectionKey}/${parsed.conceptKey}`,
      sourceKind: "redo-staging",
      sourcePath: `work/redo-staging/${parsed.normalized}`,
      generatedAt: metadata.generatedAt,
    });
  }

  // Keep one index entry per preserved file. A raw attempt and a staged
  // candidate can intentionally contain the same pixels, but they represent
  // separate workflow records and both must remain visible in the archive.
  attempts.sort(
    (a, b) =>
      b.generatedAt.localeCompare(a.generatedAt) ||
      a.series.localeCompare(b.series, undefined, {
        numeric: true,
        sensitivity: "base",
      }) || a.attempt - b.attempt,
  );

  await mkdir(path.dirname(outputIndex), { recursive: true });
  await writeFile(outputIndex, `${JSON.stringify(attempts, null, 2)}\n`);
  console.log(`Indexed ${attempts.length} preserved output files.`);
  return attempts;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  await syncAttempts();
}
