import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { CANONICAL_BACKGROUND } from "./render-validation.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, "..");
const tileWidth = 320;
const imageHeight = 320;
const labelHeight = 40;
const tileHeight = imageHeight + labelHeight;

function parseOptions(argv) {
  const options = { image: "", plan: "", output: "" };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (["--image", "--plan", "--output"].includes(value)) {
      options[value.slice(2)] = argv[++index] ?? "";
    } else {
      throw new Error(`Unknown QA-sheet argument: ${value}`);
    }
  }
  if (!options.image || !options.plan) {
    throw new Error(
      "Usage: npm run render:qa -- --image work/<render>.png --plan work/<render>-qa.json [--output work/render-qa/<render>-qa.png]",
    );
  }
  return options;
}
function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function labeledTile(input, label, { grayscale = false } = {}) {
  let content = sharp(input).resize(tileWidth, imageHeight, {
    fit: "contain",
    background: CANONICAL_BACKGROUND,
    kernel: "nearest",
  });
  if (grayscale) content = content.grayscale();
  const rendered = await content.png().toBuffer();
  const labelSvg = Buffer.from(
    `<svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0d0b0a"/>
      <text x="14" y="26" fill="#e5ddd7" font-family="sans-serif" font-size="16">${escapeXml(label)}</text>
    </svg>`,
  );
  return sharp({
    create: {
      width: tileWidth,
      height: tileHeight,
      channels: 3,
      background: "#0d0b0a",
    },
  })
    .composite([
      { input: labelSvg, left: 0, top: 0 },
      { input: rendered, left: 0, top: labelHeight },
    ])
    .png()
    .toBuffer();
}

function cropPixels(crop, width, height) {
  const left = Math.max(0, Math.floor(crop.left * width));
  const top = Math.max(0, Math.floor(crop.top * height));
  const right = Math.min(width, Math.ceil((crop.left + crop.width) * width));
  const bottom = Math.min(height, Math.ceil((crop.top + crop.height) * height));
  return {
    left,
    top,
    width: Math.max(1, right - left),
    height: Math.max(1, bottom - top),
  };
}

export async function buildRenderQaSheet({
  imagePath,
  plan,
  outputPath,
}) {
  const metadata = await sharp(imagePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Could not read QA image dimensions.");
  }
  const source = await readFile(imagePath);
  const tiles = [
    await labeledTile(source, "Full color at 256"),
    await labeledTile(source, "Grayscale silhouette", { grayscale: true }),
  ];
  const cropGroups = ["face", "hands", "equipmentJoins", "feet"];
  for (const group of cropGroups) {
    for (const crop of plan?.crops?.[group] ?? []) {
      const extracted = await sharp(source)
        .extract(cropPixels(crop, metadata.width, metadata.height))
        .png()
        .toBuffer();
      tiles.push(await labeledTile(extracted, `${group}: ${crop.label}`));
    }
  }

  const columns = 3;
  const rows = Math.ceil(tiles.length / columns);
  const output = outputPath
    ? path.resolve(siteDir, outputPath)
    : path.join(
        siteDir,
        "work",
        "render-qa",
        `${path.basename(imagePath, path.extname(imagePath))}-qa.png`,
      );
  await mkdir(path.dirname(output), { recursive: true });
  await sharp({
    create: {
      width: columns * tileWidth,
      height: rows * tileHeight,
      channels: 3,
      background: "#171311",
    },
  })
    .composite(
      tiles.map((input, index) => ({
        input,
        left: (index % columns) * tileWidth,
        top: Math.floor(index / columns) * tileHeight,
      })),
    )
    .png()
    .toFile(output);
  return output;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  const options = parseOptions(process.argv.slice(2));
  const plan = JSON.parse(
    await readFile(path.resolve(siteDir, options.plan), "utf8"),
  );
  const output = await buildRenderQaSheet({
    imagePath: path.resolve(siteDir, options.image),
    plan,
    outputPath: options.output,
  });
  console.log(`QA inspection sheet: ${path.relative(siteDir, output)}`);
}
