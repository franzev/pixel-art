import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";

import {
  completeRenderGate,
  getRenderGateStatus,
} from "../scripts/render-gate-service.mjs";

const background = "#171311";

async function writeFixture(
  file,
  { width = 128, height = 128, backgroundColor = background } = {},
) {
  await mkdir(path.dirname(file), { recursive: true });
  await sharp({
    create: { width, height, channels: 4, background: backgroundColor },
  })
    .composite([
      {
        input: {
          create: {
            width: Math.round(width * 0.6),
            height: Math.round(height * 0.7),
            channels: 4,
            background: "#8c6b58",
          },
        },
        left: Math.round(width * 0.2),
        top: Math.round(height * 0.15),
      },
    ])
    .png()
    .toFile(file);
  const bytes = await readFile(file);
  return createHash("sha256").update(bytes).digest("hex");
}

async function fixture({ candidateSize } = {}) {
  const siteDir = await mkdtemp(path.join(os.tmpdir(), "render-gate-service-"));
  const sourcePath = "enemies/fixture/01-source.png";
  const candidatePath = "work/redo-staging/enemies/fixture/01-source-v02.png";
  const sourceHash = await writeFixture(
    path.join(siteDir, "public/art", sourcePath),
  );
  await writeFixture(path.join(siteDir, candidatePath), candidateSize);
  return {
    siteDir,
    request: {
      candidatePath,
      sourcePath,
      sourceRenderId: `rnd_${sourceHash.slice(0, 24)}`,
      authorizedChanges: ["Correct the recorded review defects"],
      humanoid: true,
      attestations: {
        sameCharacter: true,
        intendedChangesOnly: true,
        anatomyAndEquipmentComplete: true,
        cleanPresentation: true,
        rightFacing: true,
      },
    },
  };
}

test("quality gate does not block promotion for a different background color", async () => {
  const { siteDir, request } = await fixture({
    candidateSize: { backgroundColor: "#100d0c" },
  });

  assert.deepEqual(await getRenderGateStatus(request, { siteDir }), {
    state: "not_checked",
    errors: [],
  });

  const completed = await completeRenderGate(request, { siteDir });
  assert.equal(completed.state, "passed");
  assert.match(completed.receiptPath, /art-catalog\/render-gates\/.+\.json$/);

  const status = await getRenderGateStatus(request, { siteDir });
  assert.equal(status.state, "passed");
  assert.equal(typeof status.passedAt, "string");
});

test("quality gate reports objective failures without writing a receipt", async () => {
  const { siteDir, request } = await fixture({
    candidateSize: { width: 128, height: 192 },
  });

  const completed = await completeRenderGate(request, { siteDir });
  assert.equal(completed.state, "failed");
  assert.match(completed.errors.join(" "), /square/i);
  assert.deepEqual(completed.diagnostics.dimensions, {
    width: 128,
    height: 192,
  });
  assert.deepEqual(Object.keys(completed.diagnostics), ["dimensions"]);

  assert.deepEqual(await getRenderGateStatus(request, { siteDir }), {
    state: "not_checked",
    errors: [],
  });
});

test("quality gate requires every explicit visual confirmation", async () => {
  const { siteDir, request } = await fixture();
  request.attestations.sameCharacter = false;

  await assert.rejects(
    completeRenderGate(request, { siteDir }),
    /Confirm every visual quality check/,
  );
});
