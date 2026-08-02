import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateRedoSourceFile,
  validateRenderImage,
  validateRenderPlan,
  writeRenderGateReceipt,
} from "./render-validation.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, "..");

function parseOptions(argv) {
  const options = {
    image: "",
    plan: "",
    destination: "",
    receipt: true,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (["--image", "--plan", "--destination"].includes(value)) {
      options[value.slice(2)] = argv[++index] ?? "";
    } else if (value === "--no-receipt") {
      options.receipt = false;
    } else {
      throw new Error(`Unknown render-check argument: ${value}`);
    }
  }
  if (!options.image || !options.plan) {
    throw new Error(
      "Usage: npm run render:check -- --image work/<render>.png --plan work/<render>-qa.json --destination public/art/<category>/<collection>/<NN>-<slug>.png",
    );
  }
  if (options.receipt && !options.destination) {
    throw new Error("--destination is required when writing a QA receipt.");
  }
  return options;
}
function printChecks(title, result) {
  console.log(title);
  for (const item of result.checks) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.key}: ${item.detail}`);
  }
}

const options = parseOptions(process.argv.slice(2));
const imagePath = path.resolve(siteDir, options.image);
const planPath = path.resolve(siteDir, options.plan);
const plan = JSON.parse(await readFile(planPath, "utf8"));
const mode = plan?.asset?.mode;
const imageValidation = await validateRenderImage(imagePath, { mode });
const planValidation = validateRenderPlan(plan, { mode });
const redoSourceValidation = await validateRedoSourceFile(plan, { siteDir });

printChecks("Objective image checks", imageValidation);
printChecks("Recorded visual QA checks", planValidation);
if (plan?.redo?.isRedo === true) {
  printChecks("Redo source binding checks", redoSourceValidation);
}

if (
  !imageValidation.pass ||
  !planValidation.pass ||
  !redoSourceValidation.pass
) {
  process.exitCode = 1;
} else if (options.receipt) {
  const { receiptPath } = await writeRenderGateReceipt({
    imagePath,
    destination: options.destination,
    siteDir,
    plan,
    imageValidation,
    planValidation,
    redoSourceValidation,
  });
  console.log(
    `PASS render gate receipt: ${path.relative(siteDir, receiptPath)}`,
  );
} else {
  console.log("PASS render gate (receipt disabled).");
}
