import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncArt } from "./sync-art.mjs";
import { validateRenderGateReceipt } from "./render-validation.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, "..");
const artDir = path.join(siteDir, "public", "art");
const stagingDir = path.join(siteDir, "work", "redo-staging");
const historyDir = path.join(siteDir, "archive", "redo-history");
const collectionsDir = path.join(siteDir, "collections");
const trackerPath = path.join(siteDir, "art-catalog", "REDO-TRACKER.md");
const activationHistoryPath = path.join(
  historyDir,
  "activation-history.jsonl",
);
const trackerStart = "<!-- REDO-ACTIVATION-LOG:START -->";
const trackerEnd = "<!-- REDO-ACTIVATION-LOG:END -->";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function canonicalFilename(filename) {
  const match = filename.match(/^(.+)-v(\d{2,})\.png$/i);
  if (!match) {
    throw new Error(
      `Redo candidate must end in -vNN.png; received ${filename}`,
    );
  }
  return `${match[1]}.png`;
}

export function variantFilename(existingNames, conceptBase) {
  const pattern = new RegExp(
    `^${escapeRegExp(conceptBase)}-variant-(\\d+)\\.png$`,
    "i",
  );
  const highest = existingNames.reduce((max, name) => {
    const match = name.match(pattern);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${conceptBase}-variant-${String(highest + 1).padStart(2, "0")}.png`;
}

export function stagedCandidateTarget(relativeCandidatePath) {
  const normalized = relativeCandidatePath.split(path.sep).join("/");
  const parts = normalized.split("/").filter(Boolean);
  if (parts.length < 3) {
    throw new Error(
      "Staging path must include <category>/<collection>/<candidate-vNN.png>",
    );
  }
  const [category, collection, ...tail] = parts;
  const filename = tail.at(-1);
  return path.join(
    artDir,
    category,
    collection,
    canonicalFilename(filename),
  );
}

async function sha256(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function writeAtomic(file, content) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = path.join(
    path.dirname(file),
    `.${path.basename(file)}.${process.pid}.${Date.now()}.tmp`,
  );
  await writeFile(temporary, content);
  await rename(temporary, file);
}

async function copyAtomic(source, destination) {
  await mkdir(path.dirname(destination), { recursive: true });
  const temporary = path.join(
    path.dirname(destination),
    `.${path.basename(destination)}.${process.pid}.${Date.now()}.tmp`,
  );
  await copyFile(source, temporary);
  await rename(temporary, destination);
}

function repositoryPath(absolute) {
  return path.relative(siteDir, absolute).split(path.sep).join("/");
}

function parseOptions(argv) {
  const options = {
    candidate: "",
    sourceRenderId: "",
    sourcePath: "",
    mode: "replace",
    reviewStatus: "redo-awaiting-review",
    dryRun: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--dry-run") {
      options.dryRun = true;
    } else if (value === "--candidate") {
      options.candidate = argv[++index] ?? "";
    } else if (value === "--source-render-id") {
      options.sourceRenderId = argv[++index] ?? "";
    } else if (value === "--source-path") {
      options.sourcePath = argv[++index] ?? "";
    } else if (value === "--mode") {
      options.mode = argv[++index] ?? "";
    } else if (value === "--review-status") {
      options.reviewStatus = argv[++index] ?? "";
    } else if (!value.startsWith("--") && !options.candidate) {
      options.candidate = value;
    } else {
      throw new Error(`Unknown redo activation argument: ${value}`);
    }
  }
  if (!options.candidate) {
    throw new Error(
      "Usage: npm run redo:activate -- --candidate work/redo-staging/<category>/<collection>/<name-vNN.png> [--source-render-id rnd_...] [--source-path <catalog-path>]",
    );
  }
  if (
    options.sourceRenderId &&
    !/^rnd_[0-9a-f]{24}$/.test(options.sourceRenderId)
  ) {
    throw new Error("Source render ID must use rnd_ plus 24 hexadecimal digits");
  }
  if (options.mode !== "replace" && options.mode !== "variant") {
    throw new Error("Activation mode must be replace or variant");
  }
  if (!options.sourceRenderId || !options.sourcePath) {
    throw new Error(
      "Redo activation requires both --source-render-id and --source-path so the candidate can be bound to the exact original.",
    );
  }
  return options;
}

export function validateRedoReceiptBinding(
  receipt,
  { sourceRenderId, sourcePath },
) {
  const normalizedSourcePath = String(sourcePath ?? "")
    .replaceAll("\\", "/")
    .replace(/^public\/art\//, "");
  const redo = receipt?.plan?.redo;
  const errors = [];
  if (redo?.isRedo !== true) {
    errors.push("Receipt is not marked as a redo.");
  }
  if (redo?.sourceRenderId !== sourceRenderId) {
    errors.push("Receipt source render ID does not match the selected original.");
  }
  if (
    String(redo?.sourcePath ?? "").replaceAll("\\", "/") !==
    normalizedSourcePath
  ) {
    errors.push("Receipt source path does not match the selected original.");
  }
  if (
    redo?.minimalDeltaVerified !== true ||
    redo?.sourceCandidateCompared !== true
  ) {
    errors.push("Receipt does not attest a same-scale minimum-delta comparison.");
  }
  return { pass: errors.length === 0, errors };
}

async function planActivation(options) {
  const candidate = path.resolve(siteDir, options.candidate);
  const relativeToStaging = path.relative(stagingDir, candidate);
  if (
    relativeToStaging.startsWith("..") ||
    path.isAbsolute(relativeToStaging)
  ) {
    throw new Error(
      `Candidate must stay outside the catalog under work/redo-staging: ${options.candidate}`,
    );
  }
  const candidateStat = await stat(candidate);
  if (!candidateStat.isFile()) {
    throw new Error(`Candidate is not a file: ${options.candidate}`);
  }

  const canonicalActive = stagedCandidateTarget(relativeToStaging);
  const canonicalRelative = path.relative(artDir, canonicalActive);
  const activeParts = canonicalRelative.split(path.sep);
  const [category, collection] = activeParts;
  const conceptBase = path.basename(canonicalActive).replace(/\.png$/i, "");
  const activeDirectory = path.dirname(canonicalActive);
  const directoryNames = (await exists(activeDirectory))
    ? await readdir(activeDirectory)
    : [];
  const active =
    options.mode === "variant"
      ? path.join(activeDirectory, variantFilename(directoryNames, conceptBase))
      : canonicalActive;
  const relativeActive = path.relative(artDir, active);
  const siblingPattern = new RegExp(
    `^${escapeRegExp(conceptBase)}(?:-v\\d+)?\\.png$`,
    "i",
  );
  const siblingNames = (await exists(activeDirectory))
    ? (await readdir(activeDirectory))
        .filter((name) => siblingPattern.test(name))
        .sort()
    : [];
  const siblings = [];
  for (const filename of siblingNames) {
    const source = path.join(activeDirectory, filename);
    const hash = await sha256(source);
    siblings.push({
      source,
      hash,
      renderId: `rnd_${hash.slice(0, 24)}`,
      archive: path.join(
        historyDir,
        category,
        collection,
        conceptBase,
        `rnd_${hash.slice(0, 24)}--${filename}`,
      ),
      isActive: source === active,
    });
  }

  const candidateHash = await sha256(candidate);
  if (options.sourcePath) {
    const explicitSource = path.resolve(artDir, options.sourcePath);
    const relativeSource = path.relative(artDir, explicitSource);
    if (
      relativeSource.startsWith("..") ||
      path.isAbsolute(relativeSource) ||
      !(await exists(explicitSource))
    ) {
      throw new Error(`Catalog source path is invalid: ${options.sourcePath}`);
    }
    if (options.mode === "replace" && !siblings.some((item) => item.source === explicitSource)) {
      const hash = await sha256(explicitSource);
      siblings.push({
        source: explicitSource,
        hash,
        renderId: `rnd_${hash.slice(0, 24)}`,
        archive: path.join(
          historyDir,
          category,
          collection,
          conceptBase,
          `rnd_${hash.slice(0, 24)}--${path.basename(explicitSource)}`,
        ),
        isActive: false,
      });
    }
  }
  const currentActive = siblings.find((sibling) => sibling.isActive);
  const candidateRenderId = `rnd_${candidateHash.slice(0, 24)}`;
  const sourceRenderId =
    options.sourceRenderId ||
    currentActive?.renderId ||
    siblings[0]?.renderId ||
    candidateRenderId;
  if (options.mode === "variant") siblings.length = 0;

  const idMatch = conceptBase.match(/^(\d{1,3})-/);
  return {
    ...options,
    candidate,
    candidateHash,
    candidateRenderId,
    active,
    activeRelative: repositoryPath(active),
    category,
    collection,
    conceptBase,
    conceptId: idMatch ? Number(idMatch[1]) : undefined,
    siblings,
    sourceRenderId,
    sourcePath: String(options.sourcePath).replaceAll("\\", "/"),
  };
}

async function planManifestUpdate(plan) {
  if (plan.mode === "variant") return null;
  const collectionDirectory = path.join(
    collectionsDir,
    plan.category,
    plan.collection,
  );
  if (!(await exists(collectionDirectory))) return null;
  const manifestNames = (await readdir(collectionDirectory)).filter((name) =>
    /manifest\.json$/i.test(name),
  );
  for (const manifestName of manifestNames) {
    const file = path.join(collectionDirectory, manifestName);
    const original = await readFile(file, "utf8");
    const manifest = JSON.parse(original);
    if (!Array.isArray(manifest.assets)) continue;
    const asset = manifest.assets.find((item) => item.id === plan.conceptId);
    if (!asset) continue;
    asset.name =
      typeof asset.name === "string"
        ? asset.name.replace(/ v\d+$/i, "")
        : asset.name;
    asset.status = "unreviewed";
    asset.review_status = plan.reviewStatus;
    asset.sha256 = plan.candidateHash;
    asset.render_id = plan.candidateRenderId;
    asset.render = plan.activeRelative;
    asset.source_feedback_render_id =
      asset.source_feedback_render_id ?? plan.sourceRenderId;
    delete asset.previous_render;
    return {
      file,
      original,
      next: `${JSON.stringify(manifest, null, 2)}\n`,
    };
  }
  return null;
}

async function planTrackerUpdate(plan, activatedAt) {
  const original = await readFile(trackerPath, "utf8");
  let current = original;
  if (!current.includes(trackerStart) || !current.includes(trackerEnd)) {
    current = `${current.trimEnd()}\n\n## Automatic activation log\n\nThis machine-maintained log records every atomic staging-to-catalog swap. It does not replace the user-review status tables above.\n\n${trackerStart}\n| Activated | Source render ID | Active render ID | Active path | Archived render IDs |\n| --- | --- | --- | --- | --- |\n${trackerEnd}\n`;
  }
  const archivedIds = plan.siblings
    .map((item) => `\`${item.renderId}\``)
    .join(", ");
  const row = `| ${activatedAt} | \`${plan.sourceRenderId}\` | \`${plan.candidateRenderId}\` | \`${plan.activeRelative}\` | ${archivedIds || "—"} |\n`;
  return {
    file: trackerPath,
    original,
    next: current.replace(trackerEnd, `${row}${trackerEnd}`),
  };
}

async function planHistoryUpdate(plan, activatedAt) {
  const original = (await exists(activationHistoryPath))
    ? await readFile(activationHistoryPath, "utf8")
    : "";
  const record = {
    schemaVersion: 2,
    activatedAt,
    sourceRenderId: plan.sourceRenderId,
    activePath: plan.activeRelative,
    activeRenderId: plan.candidateRenderId,
    archived: plan.siblings.map((item) => ({
      formerPath: repositoryPath(item.source),
      renderId: item.renderId,
      archivePath: repositoryPath(item.archive),
    })),
  };
  return {
    file: activationHistoryPath,
    original,
    next: `${original}${JSON.stringify(record)}\n`,
    record,
  };
}

async function planReceiptUpdate(plan) {
  const file = path.join(
    siteDir,
    "art-catalog",
    "render-gates",
    `${plan.candidateHash}.json`,
  );
  const original = await readFile(file, "utf8").catch((error) => {
    if (error?.code === "ENOENT") {
      throw new Error(
        "This candidate has no passing render-gate receipt and cannot be promoted.",
      );
    }
    throw error;
  });
  const receipt = JSON.parse(original);
  const nextReceipt = {
    ...receipt,
    destination: plan.activeRelative,
    promotedAt: new Date().toISOString(),
  };
  const validation = validateRenderGateReceipt(nextReceipt, {
    assetHash: plan.candidateHash,
    destination: plan.activeRelative,
  });
  if (!validation.pass) {
    throw new Error(
      `Candidate cannot be promoted:\n${validation.errors.map((item) => `- ${item}`).join("\n")}`,
    );
  }
  const redoBinding = validateRedoReceiptBinding(nextReceipt, {
    sourceRenderId: plan.sourceRenderId,
    sourcePath: plan.sourcePath,
  });
  if (!redoBinding.pass) {
    throw new Error(
      `Candidate cannot be promoted:\n${redoBinding.errors.map((item) => `- ${item}`).join("\n")}`,
    );
  }
  return {
    file,
    original,
    next: `${JSON.stringify(nextReceipt, null, 2)}\n`,
  };
}

async function archiveSiblings(plan) {
  const created = [];
  for (const sibling of plan.siblings) {
    if (await exists(sibling.archive)) {
      const archivedHash = await sha256(sibling.archive);
      if (archivedHash !== sibling.hash) {
        throw new Error(
          `History collision at ${repositoryPath(sibling.archive)}`,
        );
      }
      continue;
    }
    await copyAtomic(sibling.source, sibling.archive);
    created.push(sibling.archive);
  }
  return created;
}

async function restoreFiles(plan) {
  if (await exists(plan.active)) await unlink(plan.active);
  for (const sibling of plan.siblings) {
    await copyAtomic(sibling.archive, sibling.source);
  }
}

async function activate(plan) {
  const activatedAt = new Date().toISOString();
  const manifestUpdate = await planManifestUpdate(plan);
  const trackerUpdate = await planTrackerUpdate(plan, activatedAt);
  const historyUpdate = await planHistoryUpdate(plan, activatedAt);
  const receiptUpdate = await planReceiptUpdate(plan);
  const metadataUpdates = [
    manifestUpdate,
    trackerUpdate,
    historyUpdate,
    receiptUpdate,
  ].filter(Boolean);
  const createdArchives = [];
  let swapped = false;

  try {
    createdArchives.push(...(await archiveSiblings(plan)));

    await mkdir(path.dirname(plan.active), { recursive: true });
    const stagedForSwap = path.join(
      path.dirname(plan.active),
      `.${path.basename(plan.active)}.${process.pid}.${Date.now()}.tmp`,
    );
    await copyFile(plan.candidate, stagedForSwap);
    await rename(stagedForSwap, plan.active);
    swapped = true;

    for (const sibling of plan.siblings.filter((item) => item.source !== plan.active)) {
      if (await exists(sibling.source)) await unlink(sibling.source);
    }

    for (const update of metadataUpdates) {
      await writeAtomic(update.file, update.next);
    }
    await syncArt();
  } catch (error) {
    for (const update of metadataUpdates.reverse()) {
      await writeAtomic(update.file, update.original);
    }
    if (swapped) await restoreFiles(plan);
    for (const archive of createdArchives) {
      if (await exists(archive)) await unlink(archive);
    }
    try {
      await syncArt();
    } catch {
      // Preserve the activation error; the rollback paths remain inspectable.
    }
    throw error;
  }

  try {
    await unlink(plan.candidate);
  } catch {
    console.warn(
      `Activated successfully, but staging cleanup is still needed: ${repositoryPath(plan.candidate)}`,
    );
  }

  return {
    ...historyUpdate.record,
    manifestUpdated: manifestUpdate
      ? repositoryPath(manifestUpdate.file)
      : null,
    trackerUpdated: repositoryPath(trackerPath),
    catalogSynced: true,
  };
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const plan = await planActivation(options);
  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          candidate: repositoryPath(plan.candidate),
          active: plan.activeRelative,
          sourceRenderId: plan.sourceRenderId,
          activeRenderId: plan.candidateRenderId,
          archive: plan.siblings.map((item) => ({
            renderId: item.renderId,
            path: repositoryPath(item.archive),
          })),
        },
        null,
        2,
      ),
    );
    return;
  }
  console.log(JSON.stringify(await activate(plan), null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
