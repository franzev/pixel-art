import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  sha256File,
  validateRedoSourceFile,
  validateRenderGateReceipt,
  validateRenderImage,
  validateRenderPlan,
  writeRenderGateReceipt,
} from "./render-validation.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSiteDir = path.resolve(scriptDir, "..");
const stagingPrefix = "work/redo-staging/";
const attestationKeys = [
  "sameCharacter",
  "intendedChangesOnly",
  "anatomyAndEquipmentComplete",
  "cleanPresentation",
  "rightFacing",
];

export function renderGateDiagnostics(metrics = {}) {
  return {
    dimensions: {
      width: Number(metrics.width ?? 0),
      height: Number(metrics.height ?? 0),
    },
  };
}

function safeRelativePng(value, { prefix = "" } = {}) {
  const normalized = String(value ?? "").replaceAll("\\", "/");
  if (
    !normalized ||
    path.posix.isAbsolute(normalized) ||
    normalized.split("/").includes("..") ||
    !normalized.toLowerCase().endsWith(".png") ||
    (prefix && !normalized.startsWith(prefix))
  ) {
    throw new Error("The quality-check image path is invalid.");
  }
  return normalized;
}

export function validateRenderGateRequest(value, { complete = false } = {}) {
  if (!value || typeof value !== "object") {
    throw new Error("Quality-check request is missing.");
  }
  const candidatePath = safeRelativePng(value.candidatePath, {
    prefix: stagingPrefix,
  });
  const sourcePath = safeRelativePng(value.sourcePath);
  const sourceRenderId = String(value.sourceRenderId ?? "");
  if (!/^rnd_[0-9a-f]{24}$/.test(sourceRenderId)) {
    throw new Error("The quality-check source identity is invalid.");
  }

  const authorizedChanges = Array.isArray(value.authorizedChanges)
    ? value.authorizedChanges
        .filter((item) => typeof item === "string" && item.trim())
        .map((item) => item.trim())
    : [];
  const attestations = value.attestations ?? {};
  if (complete && !attestationKeys.every((key) => attestations[key] === true)) {
    throw new Error("Confirm every visual quality check before continuing.");
  }

  return {
    candidatePath,
    sourcePath,
    sourceRenderId,
    authorizedChanges:
      authorizedChanges.length > 0
        ? authorizedChanges
        : ["Address the saved review feedback"],
    humanoid: value.humanoid !== false,
    attestations,
  };
}

function inspectionCrop(label, left, top, width, height) {
  return { label, left, top, width, height };
}

function buildReviewDeskPlan(request) {
  const sourceParts = request.sourcePath.split("/");
  const filename = sourceParts.at(-1) ?? "render.png";
  const clean = request.attestations.cleanPresentation === true;
  const complete = request.attestations.anatomyAndEquipmentComplete === true;
  const rightFacing = request.attestations.rightFacing === true;
  const preserved =
    request.attestations.sameCharacter === true &&
    request.attestations.intendedChangesOnly === true;

  return {
    schemaVersion: 2,
    reviewSource: "review-desk-v1",
    asset: {
      category: sourceParts[0] ?? "catalog",
      collection: sourceParts[1] ?? "unclassified",
      slug: filename.replace(/\.png$/i, ""),
      mode: "isolated",
      humanoid: request.humanoid,
      directionalSubject: true,
      facingDirection: "screen-right",
      nonDirectionalReason: "",
    },
    redo: {
      isRedo: true,
      sourcePath: request.sourcePath,
      sourceRenderId: request.sourceRenderId,
      authorizedChanges: request.authorizedChanges,
      sourceCandidateCompared: preserved,
      minimalDeltaVerified: preserved,
      unauthorizedChanges: [],
      preserved: {
        identity: preserved,
        faceVisibilityOrCovering: preserved,
        bodyProportions: preserved,
        silhouette: preserved,
        clothingConstruction: preserved,
        paletteAndMaterials: preserved,
        equipmentTypeAndConstruction: preserved,
        unaffectedPose: preserved,
      },
    },
    hardGates: {
      squareCanvas: true,
      uniformBackground: clean,
      noVisibleEffects: clean,
      neutralColorBalance: clean,
      completeSilhouette: complete,
      safePadding: complete,
      rightFacing,
    },
    palette: {
      dominantMaterial: "Confirmed in the side-by-side Review Desk inspection",
      secondaryGarment: "Confirmed in the side-by-side Review Desk inspection",
      metalFinish: "Confirmed in the side-by-side Review Desk inspection",
      leatherOrWood: "Confirmed in the side-by-side Review Desk inspection",
      accentRole: "Confirmed in the side-by-side Review Desk inspection",
      lighting: "Neutral lighting confirmed in Review Desk",
      localColorRamps: [
        "Primary local colors preserved",
        "Secondary local colors preserved",
      ],
    },
    equipment: null,
    diversity: {
      armoredHumanoid: false,
      comparableWave: false,
      recentComparables: [],
      noComparableReason:
        "Candidate was compared directly with its authorized source in Review Desk",
      structuralDifferences: [],
      bodyOnlySilhouetteDistinct: true,
      paletteDifferences: [],
      paletteAndLightingDistinct: true,
    },
    crops: {
      face: request.humanoid
        ? [inspectionCrop("Face", 0.3, 0.04, 0.4, 0.3)]
        : [],
      hands: request.humanoid
        ? [inspectionCrop("Hands and equipment", 0.08, 0.25, 0.84, 0.45)]
        : [],
      equipmentJoins: [],
      feet: request.humanoid
        ? [inspectionCrop("Feet", 0.2, 0.68, 0.6, 0.3)]
        : [],
    },
    visualReview: {
      completeAnatomy: complete,
      handsAndFeetVerified: complete,
      noVisibleEffects: clean,
      neutralColorBalance: clean,
      readableAt256: complete,
      noCropping: complete,
      distinctFromComparables:
        request.attestations.intendedChangesOnly === true,
      rightFacingVerified: rightFacing,
    },
  };
}

function validateReceiptBinding(receipt, request) {
  const redo = receipt?.plan?.redo;
  const errors = [];
  if (redo?.isRedo !== true) errors.push("Receipt is not marked as a redo.");
  if (redo?.sourceRenderId !== request.sourceRenderId) {
    errors.push("Receipt source identity does not match this original.");
  }
  if (
    String(redo?.sourcePath ?? "").replaceAll("\\", "/") !== request.sourcePath
  ) {
    errors.push("Receipt source path does not match this original.");
  }
  return errors;
}

async function resolvedCandidate(request, siteDir) {
  const candidate = path.resolve(siteDir, request.candidatePath);
  const stagingDir = path.resolve(siteDir, stagingPrefix);
  const relative = path.relative(stagingDir, candidate);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("The candidate must remain inside redo staging.");
  }
  const assetHash = await sha256File(candidate).catch(() => {
    throw new Error("The generated candidate file is unavailable.");
  });
  return { candidate, assetHash };
}

export async function getRenderGateStatus(
  value,
  { siteDir = defaultSiteDir } = {},
) {
  const request = validateRenderGateRequest(value);
  const { assetHash } = await resolvedCandidate(request, siteDir);
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
    if (error?.code === "ENOENT") return { state: "not_checked", errors: [] };
    return {
      state: "failed",
      errors: ["The saved quality-check receipt is unreadable."],
    };
  }

  const validation = validateRenderGateReceipt(receipt, {
    assetHash,
    destination: request.sourcePath,
  });
  const errors = [
    ...validation.errors,
    ...validateReceiptBinding(receipt, request),
  ];
  return errors.length
    ? {
        state: "failed",
        errors,
        diagnostics: renderGateDiagnostics(receipt.imageMetrics),
      }
    : {
        state: "passed",
        errors: [],
        passedAt: receipt.passedAt,
        diagnostics: renderGateDiagnostics(receipt.imageMetrics),
      };
}

export async function completeRenderGate(
  value,
  { siteDir = defaultSiteDir } = {},
) {
  const request = validateRenderGateRequest(value, { complete: true });
  const { candidate, assetHash } = await resolvedCandidate(request, siteDir);
  const plan = buildReviewDeskPlan(request);
  const imageValidation = await validateRenderImage(candidate, {
    mode: plan.asset.mode,
  });
  const planValidation = validateRenderPlan(plan, { mode: plan.asset.mode });
  const redoSourceValidation = await validateRedoSourceFile(plan, { siteDir });
  const errors = [
    ...imageValidation.errors,
    ...planValidation.errors,
    ...redoSourceValidation.errors,
  ];
  const diagnostics = renderGateDiagnostics(imageValidation.metrics);
  if (errors.length) return { state: "failed", errors, diagnostics };

  const destination = path.join(siteDir, "public", "art", request.sourcePath);
  const { receiptPath, receipt } = await writeRenderGateReceipt({
    imagePath: candidate,
    destination,
    siteDir,
    plan,
    imageValidation,
    planValidation,
    redoSourceValidation,
  });
  return {
    state: "passed",
    errors: [],
    passedAt: receipt.passedAt,
    receiptPath: path.relative(siteDir, receiptPath).split(path.sep).join("/"),
    assetHash,
    diagnostics,
  };
}
