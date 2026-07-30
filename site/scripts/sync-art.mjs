import {
  link,
  mkdir,
  readFile,
  readdir,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
export const siteDir = path.resolve(scriptDir, "..");
const repositoryDir = path.resolve(siteDir, "..");
export const artDir = path.join(siteDir, "public", "art");
const sourceMirrorDir = path.join(siteDir, "public", "art-source");
const outputIndex = path.join(siteDir, "app", "art-index.json");
const categoryLabels = new Set([
  "enemies",
  "bosses",
  "angels",
  "protagonist",
  "environments",
]);

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

function shouldInclude(relativePath) {
  const normalized = relativePath.split(path.sep).join("/");
  if (!normalized.toLowerCase().endsWith(".png")) return false;
  if (normalized.includes("/rejected/") && normalized.includes("-source")) {
    return false;
  }

  return (
    normalized.endsWith("-reference-256.png") ||
    (normalized.startsWith("environments/") &&
      /-preview-\d+x\d+\.png$/i.test(normalized))
  );
}

function humanize(value) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/-reference-256$/, "")
    .replace(/-preview-\d+x\d+$/, "")
    .replace(/^\d{1,3}-/, "")
    .replace(/-v\d+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function validateArtPath(parts, normalizedPath) {
  if (parts.length < 3) {
    throw new Error(
      `Art must use category/collection/asset paths: ${normalizedPath}`,
    );
  }

  const collection = parts[1];
  if (collection === "drafts" || collection === "rejected") {
    throw new Error(
      `Art must include a collection before lifecycle folders: ${normalizedPath}`,
    );
  }
}

function collectionName(parts) {
  const label = humanize(parts[1]);
  return parts.includes("rejected") ? `${label} · Rejected` : label;
}

function deriveStatus(normalizedPath) {
  if (normalizedPath.includes("/rejected/")) return "rejected";
  if (normalizedPath.includes("/drafts/")) return "draft";
  return "retained";
}

async function mirrorSource(sourceFile, relativeParts) {
  const mirrorPath = path.join(sourceMirrorDir, ...relativeParts);
  const sourceStat = await stat(sourceFile);

  try {
    const mirrorStat = await stat(mirrorPath);
    if (mirrorStat.ino === sourceStat.ino) return;
    await unlink(mirrorPath);
  } catch {
    await mkdir(path.dirname(mirrorPath), { recursive: true });
  }

  try {
    await link(sourceFile, mirrorPath);
  } catch {
    await writeFile(mirrorPath, await readFile(sourceFile));
  }
}

async function pngMetadata(file) {
  const buffer = await readFile(file);
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    return { width: 0, height: 0, assetHash: "" };
  }

  const hasCompleteTrailer =
    buffer.length >= 12 &&
    buffer.subarray(buffer.length - 8).toString("hex") === "49454e44ae426082";

  if (!hasCompleteTrailer) {
    throw new Error(`PNG is still being written: ${file}`);
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    assetHash: createHash("sha256").update(buffer).digest("hex"),
  };
}

const TAG_DICTIONARIES = {
  "body-plan": [
    ["skeleton", "Skeleton", ["skeleton", "bone", "skull", "ossuary", "marrow"]],
    ["ghost", "Ghost", ["ghost", "specter", "wraith", "fog", "hollow"]],
    ["angel", "Angel", ["angel", "angels", "seraph", "seraphs", "dominion", "cherub"]],
    ["demon", "Demon", ["demon", "demons", "infernal", "imp", "devil", "devils"]],
    ["vampire", "Vampire", ["vampire", "fang", "leech"]],
    ["filipino-mythic", "Filipino mythic", ["aswang", "manananggal", "wakwak", "tiyanak", "tikbalang", "kapre", "duwende", "engkanto", "diwata"]],
    ["beast", "Beast", ["animal", "predator", "beast", "hound", "wolf", "goat", "ram", "boar"]],
    ["serpentine", "Serpentine", ["serpent", "snake", "naga", "bakunawa"]],
    ["undead", "Undead", ["undead", "corpse", "ghoul", "grave", "crypt", "catacomb"]],
    ["human", "Human", ["human", "knight", "knights", "priest", "priests", "priestess", "priestesses", "nun", "nuns", "monk", "monks", "friar", "friars", "abbot", "abbess", "bishop", "cardinal", "inquisitor", "witch", "witches", "hunter", "huntress", "soldier", "soldiers", "cultist", "cultists", "lady", "ladies", "widow", "widows", "bride", "brides", "sister", "sisters", "matron", "matrons", "maiden", "maidens", "queen", "king", "prince", "princess", "duchess", "baroness", "countess"]],
  ],
  weapon: [
    ["sword", "Sword", ["sword", "blade", "fencer", "duelist", "sabre"]],
    ["spear", "Spear or lance", ["spear", "lance", "lancer", "pike"]],
    ["axe", "Axe", ["axe", "axeman", "hatchet"]],
    ["ranged", "Ranged weapon", ["bow", "archer", "gunner", "musket", "rifle"]],
    ["staff", "Staff or focus", ["staff", "rod", "wand", "caster"]],
    ["hammer", "Hammer or maul", ["hammer", "maul", "mason"]],
    ["net", "Net", ["netter", "net"]],
  ],
  effect: [
    ["fire", "Fire or ember", ["fire", "flame", "ember", "cinder", "furnace", "ash"]],
    ["frost", "Frost", ["frost", "rime", "ice"]],
    ["storm", "Storm", ["storm", "gale", "typhoon", "lightning", "thunder"]],
    ["celestial", "Celestial", ["moon", "eclipse", "star", "sun"]],
    ["blood", "Blood", ["blood", "sanguine", "crimson"]],
    ["spectral", "Spectral", ["ghost", "fog", "smoke", "specter"]],
  ],
  "gender-presentation": [
    ["feminine", "Feminine presentation", ["lady", "ladies", "widow", "widows", "mother", "matron", "matrons", "priestess", "priestesses", "queen", "queens", "sister", "sisters", "nun", "nuns", "bride", "brides", "abbess", "duchess", "baroness", "countess", "huntress", "maiden", "maidens", "witch", "witches", "princess", "princesses", "crone", "hag", "dame", "sorceress"]],
    ["masculine", "Masculine presentation", ["king", "kings", "prince", "princes", "abbot", "abbots", "monk", "monks", "friar", "friars", "brother", "brothers", "priest", "priests", "lord", "lords", "bishop", "cardinal", "patriarch"]],
  ],
};

function slugify(value) {
  return value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function suggestedTags({ category, collection, status, filename }) {
  const searchable = `${category} ${collection} ${filename}`
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
  const tokens = new Set(searchable.split(/\s+/).filter(Boolean));
  const tags = [
    {
      key: `category:${category}`,
      label: CATEGORY_LABELS[category] ?? humanize(category),
      group: "category",
      source: "path",
      confidence: 1,
    },
    {
      key: `collection:${slugify(collection.replace(/ · Rejected$/, ""))}`,
      label: collection.replace(/ · Rejected$/, ""),
      group: "collection",
      source: "path",
      confidence: 1,
    },
    {
      key: `lifecycle:${status}`,
      label: humanize(status),
      group: "lifecycle",
      source: "path",
      confidence: 1,
    },
  ];

  for (const [group, definitions] of Object.entries(TAG_DICTIONARIES)) {
    for (const [value, label, needles] of definitions) {
      if (needles.some((needle) => tokens.has(needle))) {
        tags.push({
          key: `${group}:${value}`,
          label,
          group,
          source: "filename",
          confidence: group === "gender-presentation" ? 0.72 : 0.82,
        });
        break;
      }
    }
  }

  return tags;
}

const CATEGORY_LABELS = {
  enemies: "Enemy",
  bosses: "Boss",
  angels: "Angel",
  protagonist: "Protagonist",
  environments: "Environment",
};

export async function syncArt() {
  const allFiles = await walk(artDir);
  const selectedFiles = allFiles
    .map((absolute) => ({
      absolute,
      relative: path.relative(artDir, absolute),
    }))
    .filter(({ relative }) => shouldInclude(relative))
    .filter(({ relative }) =>
      categoryLabels.has(relative.split(path.sep)[0]),
    );

  const assets = [];

  for (const { absolute, relative } of selectedFiles) {
    const normalized = relative.split(path.sep).join("/");
    const parts = normalized.split("/");
    const category = parts[0];
    validateArtPath(parts, normalized);
    let metadata;
    try {
      metadata = await pngMetadata(absolute);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("PNG is still being written:")
      ) {
        continue;
      }
      throw error;
    }
    const filename = parts.at(-1);
    const repositoryCandidate = path.join(repositoryDir, ...parts);
    const sourceCandidate = repositoryCandidate.replace(
      /-reference-256\.png$/i,
      "-source.png",
    );
    let sourceAvailable = false;
    if (sourceCandidate !== repositoryCandidate) {
      try {
        sourceAvailable = (await stat(sourceCandidate)).isFile();
      } catch {
        sourceAvailable = false;
      }
    }

    let sourceUrl = null;
    if (sourceAvailable) {
      const sourceParts = [
        ...parts.slice(0, -1),
        filename.replace(/-reference-256\.png$/i, "-source.png"),
      ];
      try {
        await mirrorSource(sourceCandidate, sourceParts);
        sourceUrl = `/art-source/${sourceParts
          .map(encodeURIComponent)
          .join("/")}`;
      } catch {
        sourceUrl = null;
      }
    }

    const collection = collectionName(parts);
    const status = deriveStatus(normalized);

    assets.push({
      id: normalized,
      renderId: `rnd_${metadata.assetHash.slice(0, 24)}`,
      assetHash: metadata.assetHash,
      path: normalized,
      url: `/art/${parts.map(encodeURIComponent).join("/")}`,
      name: humanize(filename),
      filename,
      category,
      collection,
      status,
      width: metadata.width,
      height: metadata.height,
      sourceAvailable,
      sourceUrl,
      suggestedTags: suggestedTags({
        category,
        collection,
        status,
        filename,
      }),
    });
  }

  const categoryOrder = new Map([
    ["enemies", 0],
    ["bosses", 1],
    ["angels", 2],
    ["protagonist", 3],
    ["environments", 4],
  ]);

  assets.sort((a, b) => {
    const categoryDifference =
      (categoryOrder.get(a.category) ?? 99) -
      (categoryOrder.get(b.category) ?? 99);
    if (categoryDifference) return categoryDifference;
    const collectionDifference = a.collection.localeCompare(b.collection);
    if (collectionDifference) return collectionDifference;
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  await writeFile(outputIndex, `${JSON.stringify(assets, null, 2)}\n`);
  console.log(`Indexed ${assets.length} renders from public/art.`);

  return assets;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  await syncArt();
}
