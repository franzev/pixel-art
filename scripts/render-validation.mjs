import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const RENDER_GATE_VERSION = 1;
export const RENDER_PLAN_SCHEMA_VERSION = 1;
export const CANONICAL_BACKGROUND = "#171311";
const CANONICAL_BACKGROUND_RGB = { r: 0x17, g: 0x13, b: 0x11 };
const GENERIC_EQUIPMENT_NAMES = new Set([
  "axe",
  "crossbow",
  "gun",
  "hammer",
  "knife",
  "mace",
  "shield",
  "spear",
  "sword",
  "weapon",
]);

function check(key, pass, detail) {
  return { key, pass: Boolean(pass), detail };
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isNormalizedCrop(crop) {
  if (!crop || typeof crop !== "object") return false;
  if (!isNonEmptyString(crop.label)) return false;
  const values = [crop.left, crop.top, crop.width, crop.height];
  if (!values.every((value) => typeof value === "number")) return false;
  if (crop.left < 0 || crop.top < 0 || crop.width <= 0 || crop.height <= 0) {
    return false;
  }
  return crop.left + crop.width <= 1 && crop.top + crop.height <= 1;
}

function allTrue(record, keys) {
  return keys.every((key) => record?.[key] === true);
}

function requiredCropCount(crops, key) {
  return Array.isArray(crops?.[key])
    ? crops[key].filter(isNormalizedCrop).length
    : 0;
}

function addPlanCheck(checks, key, pass, detail) {
  checks.push(check(`plan.${key}`, pass, detail));
}

export function validateRenderPlan(plan, { mode } = {}) {
  const checks = [];
  const planMode = plan?.asset?.mode;

  addPlanCheck(
    checks,
    "schemaVersion",
    plan?.schemaVersion === RENDER_PLAN_SCHEMA_VERSION,
    `Expected schemaVersion ${RENDER_PLAN_SCHEMA_VERSION}.`,
  );
  addPlanCheck(
    checks,
    "asset",
    isNonEmptyString(plan?.asset?.category) &&
      isNonEmptyString(plan?.asset?.collection) &&
      isNonEmptyString(plan?.asset?.slug) &&
      ["isolated", "composition"].includes(planMode),
    "Asset category, collection, slug, and mode are required.",
  );
  addPlanCheck(
    checks,
    "mode",
    !mode || planMode === mode,
    `Plan mode ${planMode ?? "(missing)"} must match requested mode ${mode ?? planMode}.`,
  );

  const hardGates = plan?.hardGates;
  const requiredHardGates = [
    "squareCanvas",
    "noVisibleEffects",
    "neutralColorBalance",
    "completeSilhouette",
    "safePadding",
  ];
  if (planMode === "isolated") requiredHardGates.push("uniformBackground");
  addPlanCheck(
    checks,
    "hardGates",
    allTrue(hardGates, requiredHardGates),
    `Required true gates: ${requiredHardGates.join(", ")}.`,
  );

  const visualReview = plan?.visualReview;
  const requiredVisualReview = [
    "completeAnatomy",
    "handsAndFeetVerified",
    "noVisibleEffects",
    "neutralColorBalance",
    "readableAt256",
    "noCropping",
    "distinctFromComparables",
  ];
  addPlanCheck(
    checks,
    "visualReview",
    allTrue(visualReview, requiredVisualReview),
    `Required true visual review attestations: ${requiredVisualReview.join(", ")}.`,
  );

  const palette = plan?.palette;
  const paletteFields = [
    "dominantMaterial",
    "secondaryGarment",
    "metalFinish",
    "leatherOrWood",
    "accentRole",
    "lighting",
  ];
  addPlanCheck(
    checks,
    "palette",
    paletteFields.every((key) => isNonEmptyString(palette?.[key])) &&
      Array.isArray(palette?.localColorRamps) &&
      palette.localColorRamps.length >= 2 &&
      palette.localColorRamps.every(isNonEmptyString),
    `Record ${paletteFields.join(", ")} and at least two local color ramps.`,
  );

  const diversity = plan?.diversity;
  const hasComparableEvidence =
    (Array.isArray(diversity?.recentComparables) &&
      diversity.recentComparables.length > 0 &&
      diversity.recentComparables.every(isNonEmptyString)) ||
    isNonEmptyString(diversity?.noComparableReason);
  addPlanCheck(
    checks,
    "diversity.comparables",
    hasComparableEvidence,
    "List recent comparable render paths or explain why none exist.",
  );
  if (diversity?.armoredHumanoid === true) {
    addPlanCheck(
      checks,
      "diversity.armor",
      Array.isArray(diversity.structuralDifferences) &&
        diversity.structuralDifferences.length >= 4 &&
        diversity.structuralDifferences.every(isNonEmptyString) &&
        diversity.bodyOnlySilhouetteDistinct === true,
      "Armored humanoids require four structural differences and a distinct body-only silhouette.",
    );
  }
  if (diversity?.comparableWave === true) {
    addPlanCheck(
      checks,
      "diversity.palette",
      Array.isArray(diversity.paletteDifferences) &&
        diversity.paletteDifferences.length >= 3 &&
        diversity.paletteDifferences.every(isNonEmptyString) &&
        diversity.paletteAndLightingDistinct === true,
      "Comparable waves require three palette-axis differences and a distinct palette/lighting script.",
    );
  }

  const humanoid = plan?.asset?.humanoid === true;
  if (humanoid) {
    addPlanCheck(
      checks,
      "crops.humanoid",
      requiredCropCount(plan?.crops, "face") >= 1 &&
        requiredCropCount(plan?.crops, "hands") >= 1 &&
        requiredCropCount(plan?.crops, "feet") >= 1,
      "Humanoids require normalized face, hand, and feet inspection crops.",
    );
  }

  const equipment = plan?.equipment;
  if (equipment !== null && equipment !== undefined) {
    const exactType = equipment?.exactType?.trim().toLocaleLowerCase();
    addPlanCheck(
      checks,
      "equipment.identity",
      isNonEmptyString(exactType) &&
        !GENERIC_EQUIPMENT_NAMES.has(exactType) &&
        ["weapon", "shield", "crossbow", "tool"].includes(equipment?.kind),
      "Name an exact equipment subtype and classify it as weapon, shield, crossbow, or tool.",
    );
    addPlanCheck(
      checks,
      "equipment.sources",
      Array.isArray(equipment?.authoritativeSources) &&
        equipment.authoritativeSources.length >= 1 &&
        equipment.authoritativeSources.every(isNonEmptyString) &&
        isNonEmptyString(equipment?.profileReference) &&
        isNonEmptyString(equipment?.constructionReference),
      "Record an authoritative measured source, a profile view, and a construction view.",
    );
    const calculatedRatio =
      equipment?.overallLengthCm / equipment?.handlerHeightCm;
    addPlanCheck(
      checks,
      "equipment.dimensions",
      isPositiveNumber(equipment?.overallLengthCm) &&
        isPositiveNumber(equipment?.handlerHeightCm) &&
        isPositiveNumber(equipment?.handlerRelativeRatio) &&
        Math.abs(calculatedRatio - equipment.handlerRelativeRatio) <= 0.02 &&
        Array.isArray(equipment?.componentDimensions) &&
        equipment.componentDimensions.length >= 2 &&
        equipment.componentDimensions.every(
          (component) =>
            isNonEmptyString(component?.name) &&
            isPositiveNumber(component?.lengthCm),
        ),
      "Record overall length, handler height, matching ratio, and at least two component dimensions.",
    );
    addPlanCheck(
      checks,
      "equipment.handling",
      [1, 2].includes(equipment?.handCount) &&
        Array.isArray(equipment?.contactPoints) &&
        equipment.contactPoints.length >= equipment.handCount &&
        equipment.contactPoints.every(isNonEmptyString) &&
        isNonEmptyString(equipment?.loadPath) &&
        allTrue(equipment?.review, [
          "contactsVisible",
          "joinsVisible",
          "handlerAppropriate",
          "allRequiredHandsOnHandle",
        ]),
      "Record hand count, contact points, load path, and verified visible handle contacts and joins.",
    );
    if (equipment?.straightPartsExpected === true) {
      addPlanCheck(
        checks,
        "equipment.centerline",
        equipment?.review?.straightCenterlineVerified === true,
        "Straight blades, shafts, barrels, and handles require a verified continuous centerline.",
      );
    }
    if (equipment?.kind === "shield") {
      addPlanCheck(
        checks,
        "equipment.shield",
        allTrue(equipment?.review, [
          "interiorAttachmentVerified",
          "centerOfMassSupported",
        ]),
        "Shields require a verified interior attachment and supported center of mass.",
      );
    }
    if (equipment?.kind === "crossbow") {
      addPlanCheck(
        checks,
        "equipment.crossbow",
        allTrue(equipment?.review, [
          "supportHandClear",
          "triggerFingerCorrect",
          "stringPathClear",
        ]),
        "Crossbows require verified support hand, trigger finger, and string clearance.",
      );
    }
    addPlanCheck(
      checks,
      "crops.equipment",
      requiredCropCount(plan?.crops, "hands") >= 1 &&
        requiredCropCount(plan?.crops, "equipmentJoins") >= 1,
      "Equipped characters require normalized hand and equipment-join crops.",
    );
  }

  const allCrops = Object.values(plan?.crops ?? {}).flatMap((value) =>
    Array.isArray(value) ? value : [],
  );
  addPlanCheck(
    checks,
    "crops.bounds",
    allCrops.length > 0 && allCrops.every(isNormalizedCrop),
    "Every crop must use normalized 0–1 coordinates and remain inside the image.",
  );

  return {
    pass: checks.every((item) => item.pass),
    checks,
    errors: checks.filter((item) => !item.pass).map((item) => item.detail),
  };
}

function exactBackgroundPixel(data, index) {
  return (
    data[index] === CANONICAL_BACKGROUND_RGB.r &&
    data[index + 1] === CANONICAL_BACKGROUND_RGB.g &&
    data[index + 2] === CANONICAL_BACKGROUND_RGB.b &&
    data[index + 3] === 255
  );
}

export async function sha256File(file) {
  const buffer = await readFile(file);
  return createHash("sha256").update(buffer).digest("hex");
}

export async function validateRenderImage(
  imagePath,
  { mode = "isolated", minimumPaddingRatio = 0.01 } = {},
) {
  if (!["isolated", "composition"].includes(mode)) {
    throw new Error(`Unknown render mode: ${mode}`);
  }

  let metadata;
  let raw;
  try {
    const image = sharp(imagePath, { failOn: "error" });
    metadata = await image.metadata();
    raw = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
  } catch (error) {
    return {
      pass: false,
      checks: [check("image.readable", false, `Unreadable image: ${error.message}`)],
      errors: [`Unreadable image: ${error.message}`],
      metrics: {},
    };
  }

  const { width, height, channels } = raw.info;
  const checks = [
    check("image.png", metadata.format === "png", "Image must be a PNG."),
    check(
      "image.square",
      width === height,
      `Image must be exactly square; received ${width} × ${height}.`,
    ),
  ];
  const metrics = { width, height, mode };

  if (mode === "isolated") {
    let opaquePixels = 0;
    let backgroundPixels = 0;
    let borderPixels = 0;
    let exactBorderPixels = 0;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    const band = Math.max(1, Math.round(Math.min(width, height) * 0.01));

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * width + x) * channels;
        if (raw.data[index + 3] === 255) opaquePixels += 1;
        const isBackground = exactBackgroundPixel(raw.data, index);
        if (isBackground) {
          backgroundPixels += 1;
        } else {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
        const isBorder =
          x < band || y < band || x >= width - band || y >= height - band;
        if (isBorder) {
          borderPixels += 1;
          if (isBackground) exactBorderPixels += 1;
        }
      }
    }

    const totalPixels = width * height;
    const hasSubject = maxX >= minX && maxY >= minY;
    const padding = hasSubject
      ? {
          left: minX / width,
          right: (width - 1 - maxX) / width,
          top: minY / height,
          bottom: (height - 1 - maxY) / height,
        }
      : { left: 0, right: 0, top: 0, bottom: 0 };
    const minimumPadding = Math.min(...Object.values(padding));

    Object.assign(metrics, {
      opaqueRatio: opaquePixels / totalPixels,
      exactBackgroundRatio: backgroundPixels / totalPixels,
      exactBorderRatio: exactBorderPixels / borderPixels,
      subjectBounds: hasSubject
        ? { left: minX, top: minY, right: maxX, bottom: maxY }
        : null,
      padding,
      minimumPadding,
    });
    checks.push(
      check(
        "image.opaque",
        opaquePixels === totalPixels,
        "Isolated catalog renders must be fully opaque.",
      ),
      check(
        "image.background-border",
        exactBorderPixels === borderPixels,
        `The outer ${band}-pixel band must be exactly ${CANONICAL_BACKGROUND}.`,
      ),
      check(
        "image.subject",
        hasSubject,
        "The image contains only the background and no detectable subject.",
      ),
      check(
        "image.padding",
        hasSubject && minimumPadding >= minimumPaddingRatio,
        `Subject or non-background pixels must retain at least ${(minimumPaddingRatio * 100).toFixed(1)}% padding on every side.`,
      ),
    );
  }

  return {
    pass: checks.every((item) => item.pass),
    checks,
    errors: checks.filter((item) => !item.pass).map((item) => item.detail),
    metrics,
  };
}

export function normalizeCatalogDestination(destination, siteDir) {
  const artDir = path.join(path.resolve(siteDir), "public", "art");
  const absolute = path.resolve(siteDir, destination);
  const relative = path.relative(artDir, absolute);
  if (
    !relative ||
    relative.startsWith("..") ||
    path.isAbsolute(relative) ||
    !relative.toLocaleLowerCase().endsWith(".png")
  ) {
    throw new Error(
      "Destination must be a PNG below public/art/<category>/<collection>/.",
    );
  }
  return relative.split(path.sep).join("/");
}

export async function writeRenderGateReceipt({
  imagePath,
  destination,
  siteDir,
  plan,
  imageValidation,
  planValidation,
}) {
  if (!imageValidation?.pass || !planValidation?.pass) {
    throw new Error("Cannot write a render-gate receipt for a failed render.");
  }
  const assetHash = await sha256File(imagePath);
  const normalizedDestination = normalizeCatalogDestination(destination, siteDir);
  const receipt = {
    schemaVersion: 1,
    renderGateVersion: RENDER_GATE_VERSION,
    assetHash,
    destination: normalizedDestination,
    passedAt: new Date().toISOString(),
    mode: plan.asset.mode,
    imageChecks: imageValidation.checks,
    imageMetrics: imageValidation.metrics,
    plan,
  };
  const receiptDir = path.join(siteDir, "art-catalog", "render-gates");
  const receiptPath = path.join(receiptDir, `${assetHash}.json`);
  await mkdir(receiptDir, { recursive: true });
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, {
    flag: "wx",
  }).catch(async (error) => {
    if (error?.code !== "EEXIST") throw error;
    const existing = JSON.parse(await readFile(receiptPath, "utf8"));
    const validation = validateRenderGateReceipt(existing, {
      assetHash,
      destination: normalizedDestination,
    });
    if (!validation.pass) {
      throw new Error(
        `Existing receipt conflicts with this render: ${validation.errors.join(" ")}`,
      );
    }
  });
  return { receipt, receiptPath };
}

export function validateRenderGateReceipt(
  receipt,
  { assetHash, destination },
) {
  const checks = [
    check(
      "receipt.version",
      receipt?.renderGateVersion === RENDER_GATE_VERSION,
      `Receipt must use render gate version ${RENDER_GATE_VERSION}.`,
    ),
    check(
      "receipt.hash",
      receipt?.assetHash === assetHash,
      "Receipt content hash does not match the catalog render.",
    ),
    check(
      "receipt.destination",
      receipt?.destination === destination,
      "Receipt destination does not match the catalog path.",
    ),
    check(
      "receipt.image",
      Array.isArray(receipt?.imageChecks) &&
        receipt.imageChecks.length > 0 &&
        receipt.imageChecks.every((item) => item?.pass === true),
      "Receipt contains a failed objective image check.",
    ),
    check(
      "receipt.plan",
      validateRenderPlan(receipt?.plan, { mode: receipt?.mode }).pass,
      "Receipt plan no longer satisfies the active render policy.",
    ),
  ];
  return {
    pass: checks.every((item) => item.pass),
    checks,
    errors: checks.filter((item) => !item.pass).map((item) => item.detail),
  };
}

export async function requireRenderGateReceipt({
  siteDir,
  assetHash,
  destination,
}) {
  const receiptPath = path.join(
    siteDir,
    "art-catalog",
    "render-gates",
    `${assetHash}.json`,
  );
  let receipt;
  try {
    receipt = JSON.parse(await readFile(receiptPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(
        `New or changed render is missing its QA receipt: ${destination}\nRun npm run render:qa and npm run render:check before catalog synchronization.`,
      );
    }
    throw error;
  }
  const result = validateRenderGateReceipt(receipt, {
    assetHash,
    destination,
  });
  if (!result.pass) {
    throw new Error(
      `Invalid render QA receipt for ${destination}:\n${result.errors.map((item) => `- ${item}`).join("\n")}`,
    );
  }
  return receipt;
}
