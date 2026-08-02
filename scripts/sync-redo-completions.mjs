import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
export const siteDir = path.resolve(scriptDir, "..");
export const inspectionDir = path.join(
  siteDir,
  "work",
  "redo-staging",
  "_inspection",
);
export const stagingDir = path.join(siteDir, "work", "redo-staging");
const defaultOutputIndex = path.join(
  siteDir,
  "app",
  "redo-completion-index.json",
);

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
    if (entry.isDirectory() && entry.name !== "_inspection") {
      files.push(...(await walk(absolute)));
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
      files.push(absolute);
    }
  }
  return files;
}

function normalizedRelative(root, absolute) {
  return path.relative(root, absolute).split(path.sep).join("/");
}

function canonicalSlot(relativePath) {
  return relativePath
    .split(path.sep)
    .join("/")
    .replace(/\.png$/i, "")
    .replace(/-v\d+$/i, "");
}

function selectionRows(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.selections)) return value.selections;
  return [];
}

export async function syncRedoCompletions({
  selectionsRoot = inspectionDir,
  stagingRoot = stagingDir,
  outputIndex = defaultOutputIndex,
} = {}) {
  const selectionNames = (await readdir(selectionsRoot, {
    withFileTypes: true,
  }))
    .filter(
      (entry) =>
        entry.isFile() && /^selection(?:-\d+)?\.json$/i.test(entry.name),
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const candidatesBySlot = new Map();
  for (const absolute of await walk(stagingRoot)) {
    const relative = normalizedRelative(stagingRoot, absolute);
    if (!/-v\d+\.png$/i.test(relative)) continue;
    const slot = canonicalSlot(relative);
    const candidates = candidatesBySlot.get(slot) ?? [];
    candidates.push(relative);
    candidatesBySlot.set(slot, candidates);
  }

  const completions = new Map();
  for (const selectionFile of selectionNames) {
    const value = JSON.parse(
      await readFile(path.join(selectionsRoot, selectionFile), "utf8"),
    );
    for (const row of selectionRows(value)) {
      if (
        typeof row?.renderId !== "string" ||
        !/^rnd_[0-9a-f]{24}$/i.test(row.renderId) ||
        typeof row.path !== "string"
      ) {
        continue;
      }

      const candidates = candidatesBySlot.get(canonicalSlot(row.path)) ?? [];
      // A selection is planning data. It becomes a completed redo only after
      // at least one corresponding candidate actually exists in staging.
      if (!candidates.length) continue;

      const existing = completions.get(row.renderId);
      completions.set(row.renderId, {
        sourceRenderId: row.renderId,
        sourcePath: row.path,
        candidatePaths: Array.from(
          new Set([...(existing?.candidatePaths ?? []), ...candidates]),
        ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
        selectionFiles: Array.from(
          new Set([...(existing?.selectionFiles ?? []), selectionFile]),
        ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
      });
    }
  }

  const result = Array.from(completions.values()).sort((a, b) =>
    a.sourcePath.localeCompare(b.sourcePath, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
  await writeFile(outputIndex, `${JSON.stringify(result, null, 2)}\n`);
  console.log(
    `Indexed ${result.length} completed redo sources from ${selectionNames.length} selection files.`,
  );
  return result;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  await stat(stagingDir);
  await syncRedoCompletions();
}
