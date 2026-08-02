import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("feedback and next-attempt notes share one lossless editor", async () => {
  const editor = await readFile(
    new URL("../app/_features/review/feedback-editor.tsx", import.meta.url),
    "utf8",
  );
  const model = await readFile(
    new URL("../app/_features/review/review-model.ts", import.meta.url),
    "utf8",
  );
  const desk = await readFile(
    new URL("../app/_features/review/review-desk.tsx", import.meta.url),
    "utf8",
  );

  assert.match(editor, /REVIEW NOTES/);
  assert.equal((editor.match(/<textarea/g) ?? []).length, 1);
  assert.doesNotMatch(editor, /NEXT ATTEMPT/);
  assert.match(model, /combinedFeedback/);
  assert.match(model, /Next: \$\{nextAttempt\}/);
  assert.match(desk, /combinedFeedback\(review\?\.note, review\?\.correctionNote\)/);
});
