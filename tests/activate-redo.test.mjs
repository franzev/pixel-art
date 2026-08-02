import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalFilename,
  stagedCandidateTarget,
  validateRedoReceiptBinding,
  variantFilename,
} from "../scripts/activate-redo.mjs";

test("redo activation maps a versioned candidate to one canonical slot", () => {
  assert.equal(
    canonicalFilename("01-blood-needle-duelist-v03.png"),
    "01-blood-needle-duelist.png",
  );
  assert.equal(
    canonicalFilename("13-oxblood-greatsword-pursuer-v104.png"),
    "13-oxblood-greatsword-pursuer.png",
  );
});

test("staged redo paths map directly to canonical catalog targets", () => {
  assert.match(
    stagedCandidateTarget(
      "enemies/blood-priestesses-batch-39/drafts/04-oxblood-quarrel-canoness-v02.png",
    ),
    /public\/art\/enemies\/blood-priestesses-batch-39\/04-oxblood-quarrel-canoness\.png$/,
  );
});

test("variant activation chooses a distinct non-versioned Catalog filename", () => {
  assert.equal(
    variantFilename(
      [
        "03-mirrorless-marquesa.png",
        "03-mirrorless-marquesa-variant-01.png",
        "03-mirrorless-marquesa-variant-03.png",
      ],
      "03-mirrorless-marquesa",
    ),
    "03-mirrorless-marquesa-variant-04.png",
  );
});

test("redo activation rejects non-versioned or malformed candidates", () => {
  assert.throws(
    () => canonicalFilename("01-blood-needle-duelist.png"),
    /must end in -vNN/,
  );
  assert.throws(
    () => canonicalFilename("01-blood-needle-duelist-final.png"),
    /must end in -vNN/,
  );
});

test("redo activation receipt must match the exact source and minimum-delta review", () => {
  const sourceRenderId = "rnd_0123456789abcdef01234567";
  const sourcePath = "enemies/banshees/01-widow.png";
  const receipt = {
    plan: {
      redo: {
        isRedo: true,
        sourceRenderId,
        sourcePath,
        sourceCandidateCompared: true,
        minimalDeltaVerified: true,
      },
    },
  };
  assert.equal(
    validateRedoReceiptBinding(receipt, {
      sourceRenderId,
      sourcePath,
    }).pass,
    true,
  );
  assert.equal(
    validateRedoReceiptBinding(receipt, {
      sourceRenderId: "rnd_abcdef0123456789abcdef01",
      sourcePath,
    }).pass,
    false,
  );
});
