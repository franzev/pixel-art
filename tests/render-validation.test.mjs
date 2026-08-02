import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { buildRenderQaSheet } from "../scripts/build-render-qa.mjs";
import {
  requireRenderGateReceipt,
  validateRedoSourceFile,
  validateRenderImage,
  validateRenderPlan,
  writeRenderGateReceipt,
} from "../scripts/render-validation.mjs";
import { shouldRequireRenderGate } from "../scripts/sync-art.mjs";

function validPlan(overrides = {}) {
  return {
    schemaVersion: 2,
    asset: {
      category: "enemies",
      collection: "gate-test",
      slug: "01-gate-test",
      mode: "isolated",
      humanoid: true,
      directionalSubject: true,
      facingDirection: "screen-right",
      nonDirectionalReason: "",
    },
    hardGates: {
      squareCanvas: true,
      uniformBackground: true,
      noVisibleEffects: true,
      neutralColorBalance: true,
      completeSilhouette: true,
      safePadding: true,
      rightFacing: true,
    },
    palette: {
      dominantMaterial: "cool iron",
      secondaryGarment: "clear blue cloth",
      metalFinish: "neutral brushed steel",
      leatherOrWood: "reddish leather",
      accentRole: "small silver fasteners",
      lighting: "neutral overhead light",
      localColorRamps: ["cool iron", "blue cloth", "reddish leather"],
    },
    equipment: null,
    diversity: {
      armoredHumanoid: false,
      comparableWave: false,
      recentComparables: [],
      noComparableReason: "Synthetic test fixture has no catalog comparables.",
      structuralDifferences: [],
      bodyOnlySilhouetteDistinct: false,
      paletteDifferences: [],
      paletteAndLightingDistinct: false,
    },
    crops: {
      face: [
        { label: "face", left: 0.4, top: 0.2, width: 0.2, height: 0.2 },
      ],
      hands: [
        { label: "hands", left: 0.25, top: 0.4, width: 0.5, height: 0.25 },
      ],
      equipmentJoins: [],
      feet: [
        { label: "feet", left: 0.35, top: 0.7, width: 0.3, height: 0.2 },
      ],
    },
    visualReview: {
      completeAnatomy: true,
      handsAndFeetVerified: true,
      noVisibleEffects: true,
      neutralColorBalance: true,
      readableAt256: true,
      noCropping: true,
      distinctFromComparables: true,
      rightFacingVerified: true,
    },
    ...overrides,
  };
}

function validRedoPlan(sourcePath, sourceRenderId, overrides = {}) {
  return validPlan({
    redo: {
      isRedo: true,
      sourcePath,
      sourceRenderId,
      authorizedChanges: ["Replace only the rejected weapon head."],
      sourceCandidateCompared: true,
      minimalDeltaVerified: true,
      unauthorizedChanges: [],
      preserved: {
        identity: true,
        faceVisibilityOrCovering: true,
        bodyProportions: true,
        silhouette: true,
        clothingConstruction: true,
        paletteAndMaterials: true,
        equipmentTypeAndConstruction: true,
        unaffectedPose: true,
      },
    },
    ...overrides,
  });
}

async function createCandidate(file, { width = 64, height = 64 } = {}) {
  const subjectWidth = Math.max(4, Math.floor(width / 2));
  const subjectHeight = Math.max(4, Math.floor(height / 2));
  const subject = await sharp({
    create: {
      width: subjectWidth,
      height: subjectHeight,
      channels: 4,
      background: "#8f3b44",
    },
  })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: "#171311",
    },
  })
    .composite([
      {
        input: subject,
        left: Math.floor((width - subjectWidth) / 2),
        top: Math.floor((height - subjectHeight) / 2),
      },
    ])
    .png()
    .toFile(file);
}

test("objective render checks accept a square isolated candidate on exact charcoal", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "render-gate-"));
  const image = path.join(temporary, "candidate.png");
  await createCandidate(image);

  const result = await validateRenderImage(image, { mode: "isolated" });
  assert.equal(result.pass, true, result.errors.join("\n"));
  assert.equal(result.metrics.width, 64);
  assert.equal(result.metrics.height, 64);
  assert.equal(result.metrics.exactBorderRatio, 1);
  assert.ok(result.metrics.minimumPadding > 0);
});

test("objective render checks reject non-square output and a contaminated border", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "render-gate-"));
  const nonSquare = path.join(temporary, "non-square.png");
  await createCandidate(nonSquare, { width: 64, height: 48 });
  const nonSquareResult = await validateRenderImage(nonSquare, {
    mode: "isolated",
  });
  assert.equal(nonSquareResult.pass, false);
  assert.ok(
    nonSquareResult.checks.some(
      (item) => item.key === "image.square" && !item.pass,
    ),
  );

  const contaminated = path.join(temporary, "contaminated.png");
  await createCandidate(contaminated);
  const badPixel = await sharp({
    create: {
      width: 1,
      height: 1,
      channels: 4,
      background: "#000000",
    },
  })
    .png()
    .toBuffer();
  await sharp(contaminated)
    .composite([{ input: badPixel, left: 0, top: 0 }])
    .png()
    .toFile(`${contaminated}.next`);
  const contaminatedResult = await validateRenderImage(
    `${contaminated}.next`,
    { mode: "isolated" },
  );
  assert.equal(contaminatedResult.pass, false);
  assert.ok(
    contaminatedResult.checks.some(
      (item) => item.key === "image.background-border" && !item.pass,
    ),
  );
});

test("visual plan rejects unverified attestations and generic equipment", () => {
  const unverified = validPlan({
    visualReview: {
      ...validPlan().visualReview,
      handsAndFeetVerified: false,
    },
  });
  assert.equal(validateRenderPlan(unverified).pass, false);

  const genericEquipment = validPlan({
    equipment: {
      kind: "weapon",
      exactType: "sword",
    },
  });
  const result = validateRenderPlan(genericEquipment);
  assert.equal(result.pass, false);
  assert.ok(
    result.checks.some(
      (item) => item.key === "plan.equipment.identity" && !item.pass,
    ),
  );
});

test("visual plan rejects every directional subject that does not face screen-right", () => {
  const wrongDirection = validPlan({
    asset: {
      ...validPlan().asset,
      facingDirection: "screen-left",
    },
  });
  const result = validateRenderPlan(wrongDirection);
  assert.equal(result.pass, false);
  assert.ok(
    result.checks.some(
      (item) =>
        item.key === "plan.asset.facingDirection" && item.pass === false,
    ),
  );
});

test("redo plans require a bound source, explicit scope, and minimum-delta preservation", () => {
  const valid = validRedoPlan(
    "enemies/gate-test/source.png",
    "rnd_0123456789abcdef01234567",
  );
  assert.equal(validateRenderPlan(valid).pass, true);

  const redesign = validRedoPlan(
    "enemies/gate-test/source.png",
    "rnd_0123456789abcdef01234567",
    {
      redo: {
        ...valid.redo,
        minimalDeltaVerified: false,
        unauthorizedChanges: ["Changed the dress construction."],
      },
    },
  );
  const result = validateRenderPlan(redesign);
  assert.equal(result.pass, false);
  assert.ok(
    result.checks.some(
      (item) =>
        ["plan.redo.scope", "plan.redo.preservation"].includes(item.key) &&
        item.pass === false,
    ),
  );
});

test("redo source binding verifies the exact Catalog bitmap identity", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "render-gate-"));
  const source = path.join(
    temporary,
    "public",
    "art",
    "enemies",
    "gate-test",
    "source.png",
  );
  await mkdir(path.dirname(source), { recursive: true });
  await createCandidate(source);
  const sourceHash = createHash("sha256")
    .update(await readFile(source))
    .digest("hex");
  const sourceRenderId = `rnd_${sourceHash.slice(0, 24)}`;
  const plan = validRedoPlan("enemies/gate-test/source.png", sourceRenderId);

  const valid = await validateRedoSourceFile(plan, { siteDir: temporary });
  assert.equal(valid.pass, true, valid.errors.join("\n"));
  assert.equal(valid.sourceHash, sourceHash);

  const wrongIdentity = await validateRedoSourceFile(
    validRedoPlan(
      "enemies/gate-test/source.png",
      "rnd_0123456789abcdef01234567",
    ),
    { siteDir: temporary },
  );
  assert.equal(wrongIdentity.pass, false);
});

test("catalog synchronization grandfathers only unchanged legacy entries", () => {
  const assetHash = "a".repeat(64);
  assert.equal(shouldRequireRenderGate(undefined, assetHash), true);
  assert.equal(
    shouldRequireRenderGate({ assetHash: "b".repeat(64) }, assetHash),
    true,
  );
  assert.equal(shouldRequireRenderGate({ assetHash }, assetHash), false);
  assert.equal(
    shouldRequireRenderGate(
      { assetHash, renderGateVersion: 1 },
      assetHash,
    ),
    true,
  );
});

test("QA sheet and content-bound receipt are produced only for a passing plan", async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "render-gate-"));
  const image = path.join(temporary, "candidate.png");
  const qaSheet = path.join(temporary, "qa.png");
  await createCandidate(image);
  const plan = validPlan();

  await buildRenderQaSheet({ imagePath: image, plan, outputPath: qaSheet });
  const qaMetadata = await sharp(qaSheet).metadata();
  assert.equal(qaMetadata.width, 960);
  assert.equal(qaMetadata.height, 720);

  const imageValidation = await validateRenderImage(image, {
    mode: "isolated",
  });
  const planValidation = validateRenderPlan(plan, { mode: "isolated" });
  const destination = "public/art/enemies/gate-test/01-gate-test.png";
  const { receipt, receiptPath } = await writeRenderGateReceipt({
    imagePath: image,
    destination,
    siteDir: temporary,
    plan,
    imageValidation,
    planValidation,
  });
  assert.match(receipt.assetHash, /^[0-9a-f]{64}$/);
  assert.equal(receipt.destination, "enemies/gate-test/01-gate-test.png");
  assert.deepEqual(
    JSON.parse(await readFile(receiptPath, "utf8")),
    receipt,
  );

  const required = await requireRenderGateReceipt({
    siteDir: temporary,
    assetHash: receipt.assetHash,
    destination: receipt.destination,
  });
  assert.equal(required.renderGateVersion, 2);

  await assert.rejects(
    requireRenderGateReceipt({
      siteDir: temporary,
      assetHash: receipt.assetHash,
      destination: "enemies/gate-test/02-wrong-destination.png",
    }),
    /destination does not match/,
  );
});
