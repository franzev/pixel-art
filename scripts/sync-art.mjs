import { readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
export const siteDir = path.resolve(scriptDir, "..");
export const artDir = path.join(siteDir, "public", "art");
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
  return normalized.toLowerCase().endsWith(".png");
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

const CLASSIFICATION_LABELS = {
  race: {
    angel: "Angel",
    aswang: "Aswang",
    demon: "Demon",
    elf: "Elf",
    ghost: "Ghost",
    ghoul: "Ghoul",
    human: "Human",
    "nature-spirit": "Nature spirit",
    skeleton: "Skeleton",
    spirit: "Spirit",
    undead: "Undead",
    vampire: "Vampire",
    zombie: "Zombie",
  },
  "gender-presentation": {
    androgynous: "Androgynous presentation",
    feminine: "Feminine presentation",
    masculine: "Masculine presentation",
  },
};

// These classifications describe the intended character concepts, not words
// that happen to occur in a filename. Keep collection-wide facts here and put
// mixed-roster exceptions in classificationForAsset below.
const COLLECTION_CLASSIFICATIONS = {
  "aswang-knights-batch-37": { race: "aswang" },
  "balete-forest-court-batch-16": { race: "nature-spirit" },
  "banshees-batch-33": {
    race: "ghost",
    "gender-presentation": "feminine",
  },
  "blood-cult-sadists-batch-39": { race: "human" },
  "blood-demon-knights-batch-37": { race: "demon" },
  "blood-priestesses-batch-39": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "bone-knights-batch-39": { race: "skeleton" },
  "catholic-evil-white-priests-batch-41": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "catholic-knights-batch-41": { race: "human" },
  "coastal-shipwreck-horrors-batch-15": { race: "undead" },
  "combat-magic-batch-04": { race: "human" },
  "convent-horrors-batch-37": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "convent-tormentors-batch-30": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "core-enemies": { race: "human" },
  "crown-of-thorns-female-knights-batch-37": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "crown-of-thorns-female-knights-batch-38": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "crown-of-thorns-knights-batch-40": { race: "human" },
  "crowned-thorn-mistresses-batch-46": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "crowned-thorn-priestesses-batch-45": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "cultists-demons-batch-02": { race: "demon" },
  "demonic-astrologers-batch-41": { race: "demon" },
  "dragon-knights-batch-38": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "elf-knights-batch-29": {
    race: "elf",
    "gender-presentation": "masculine",
  },
  "evil-catholic-knights-batch-43": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "forest-elf-sword-knights-batch-35": {
    race: "elf",
    "gender-presentation": "feminine",
  },
  "ghouls-haunts-curses-batch-12": { race: "demon" },
  "horrifying-knights-batch-37": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "horse-knights-batch-27": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "infernal-demons-batch-13": { race: "demon" },
  "iron-maidens-batch-34": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "ivory-vigil-soldiers-batch-27": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "kamatayan-batch-45": { race: "spirit" },
  "maria-clara-corruptions-batch-41": {
    race: "vampire",
    "gender-presentation": "feminine",
  },
  "murderous-wives-batch-41": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "penitent-knights-batch-37": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "porcelain-knights-batch-42": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "reapers-batch-40": { race: "spirit" },
  "sadistic-knights-batch-37": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "sadistic-nuns-batch-35": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "satanic-cult-knights-batch-39": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "satanic-priests-batch-39": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "shadow-knights-batch-44": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "spanish-colonial-corruption-batch-09": { race: "human" },
  "spanish-colonial-forces-batch-08": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "spanish-knight-orders-batch-38": {
    race: "human",
    "gender-presentation": "masculine",
  },
  "vampire-brides-batch-35": {
    race: "vampire",
    "gender-presentation": "feminine",
  },
  "vampire-horse-knights-batch-31": { race: "vampire" },
  "vampire-knights-batch-37": {
    race: "vampire",
    "gender-presentation": "feminine",
  },
  "veiled-ember-coven-batch-24": { race: "demon" },
  "veiled-warrior-nuns-batch-35": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "veiled-warrior-nuns-batch-36": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "veiled-warrior-nuns-batch-37": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "warrior-nuns-batch-32": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "warrior-nuns-batch-34": {
    race: "human",
    "gender-presentation": "feminine",
  },
  "warrior-white-ladies-batch-33": {
    race: "ghost",
    "gender-presentation": "feminine",
  },
  "wealthy-demonic-vampires-batch-38": {
    race: "vampire",
    "gender-presentation": "feminine",
  },
  "wealthy-spanish-vampire-wives-batch-46": {
    race: "vampire",
    "gender-presentation": "feminine",
  },
  "white-lady-variations-batch-05": {
    race: "ghost",
    "gender-presentation": "feminine",
  },
};

function conceptNumber(filename) {
  const match = filename.match(/^(\d{1,3})-/);
  return match ? Number(match[1]) : undefined;
}

function classificationForAsset({
  category,
  collectionKey,
  filename,
  normalizedPath,
}) {
  const classification = {
    ...(COLLECTION_CLASSIFICATIONS[collectionKey] ?? {}),
  };
  const number = conceptNumber(filename);

  if (category === "angels") classification.race = "angel";
  if (category === "protagonist") classification.race = "human";

  if (collectionKey === "aswang-knights-batch-37") {
    classification["gender-presentation"] =
      number === 3 ? "feminine" : "masculine";
  }

  if (collectionKey === "blood-cult-sadists-batch-39") {
    classification["gender-presentation"] =
      number === 3
        ? "feminine"
        : number === 5
          ? "androgynous"
          : "masculine";
  }

  if (collectionKey === "blood-demon-knights-batch-37") {
    classification["gender-presentation"] =
      number !== undefined && number >= 11 ? "feminine" : "masculine";
  }

  if (collectionKey === "catholic-knights-batch-41") {
    classification["gender-presentation"] =
      number !== undefined && number >= 6 ? "feminine" : "masculine";
  }

  if (collectionKey === "coastal-shipwreck-horrors-batch-15") {
    if (number === 3) classification.race = "ghost";
  }

  if (collectionKey === "convent-horrors-batch-37") {
    if (filename.includes("vampire")) classification.race = "vampire";
  }

  if (collectionKey === "core-enemies") {
    if (number === 15) classification.race = "ghoul";
    if (number === 7) classification["gender-presentation"] = "masculine";
  }

  if (collectionKey === "crown-of-thorns-knights-batch-40") {
    classification["gender-presentation"] =
      number !== undefined && number % 2 === 0 ? "feminine" : "masculine";
  }

  if (collectionKey === "ghouls-haunts-curses-batch-12" && number === 2) {
    classification.race = "ghoul";
  }

  if (collectionKey === "kamatayan-batch-45") {
    classification["gender-presentation"] =
      number === 2 ? "feminine" : undefined;
  }

  if (collectionKey === "maria-clara-corruptions-batch-41" && number === 5) {
    classification.race = "zombie";
  }

  if (collectionKey === "spanish-colonial-corruption-batch-09") {
    classification["gender-presentation"] = filename.includes("veterana")
      ? "feminine"
      : "masculine";
    if (filename.includes("aswang")) classification.race = "aswang";
    if (filename.includes("vampire")) classification.race = "vampire";
    if (filename.includes("zombified")) classification.race = "zombie";
    if (filename.includes("drowned")) classification.race = "undead";
  }

  if (collectionKey === "vampire-horse-knights-batch-31") {
    classification["gender-presentation"] =
      number === 12 || number === 14 ? "feminine" : "masculine";
  }

  // Lifecycle folders sometimes carry useful authored intent (for example,
  // "female-wave-v01") that is absent from the final filename.
  if (normalizedPath.includes("/female-wave")) {
    classification["gender-presentation"] = "feminine";
  }

  return classification;
}

function slugify(value) {
  return value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function suggestedTags({
  category,
  collection,
  collectionKey,
  status,
  filename,
  normalizedPath,
}) {
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

  const classification = classificationForAsset({
    category,
    collectionKey,
    filename,
    normalizedPath,
  });
  for (const [group, value] of Object.entries(classification)) {
    if (!value) continue;
    tags.push({
      key: `${group}:${value}`,
      label: CLASSIFICATION_LABELS[group][value],
      group,
      source: "document",
      confidence: 0.98,
    });
  }

  for (const [group, definitions] of Object.entries(TAG_DICTIONARIES)) {
    if (tags.some((tag) => tag.group === group)) continue;
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
      suggestedTags: suggestedTags({
        category,
        collection,
        collectionKey: parts[1],
        status,
        filename,
        normalizedPath: normalized,
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
