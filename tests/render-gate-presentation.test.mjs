import assert from "node:assert/strict";
import test from "node:test";

import {
  renderGateAction,
  renderGateFailureSummary,
} from "../app/_features/review/render-gate-presentation.ts";

test("an unavailable quality check offers a connection retry", () => {
  assert.deepEqual(renderGateAction("unavailable", false), {
    kind: "retry",
    label: "RETRY CONNECTION",
    disabled: false,
  });
});

test("a structural file failure routes directly to correction", () => {
  assert.deepEqual(renderGateAction("failed", true), {
    kind: "none",
    label: "",
    disabled: true,
  });
  assert.equal(
    renderGateFailureSummary(["Image must be exactly square."]),
    "The generated image is not square.",
  );
});
