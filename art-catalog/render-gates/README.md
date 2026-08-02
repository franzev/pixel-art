# Render gate receipts

This directory contains machine-written, content-hash-keyed QA receipts for
renders checked with the local QA tools.

Create a temporary inspection sheet first:

```bash
npm run render:qa -- \
  --image work/<render>.png \
  --plan work/<render>-qa.json
```

After inspecting the sheet, confirm that every directional subject uses a
mostly frontal, shallow front-three-quarter view with a slight screen-right
bias. The camera-facing facial plane must remain readable; when unobscured,
both eyes, nose, mouth, chin, and expression must be visible. Gaze, leading
torso action, locomotion, attack, and equipment may favor screen-right without
turning the face away. Reject rear-three-quarter, back-of-head, ear-only,
far-cheek, complete side-profile, and edge-on views unless explicitly
requested. Then record every visual attestation and run:

For a redo, regeneration, correction, or reference-based revision, also compare
the source and candidate side by side at the same scale. Confirm that the
candidate is the same character—not a recast—and preserves visible skin tone
and undertone, facial structure, hair texture, age, and culturally or
ethnically specific appearance. Reject incidental lightening, darkening, racial
or ethnic recasting, or an invented identity where the source was covered or
ambiguous.

```bash
npm run render:check -- \
  --image work/<render>.png \
  --plan work/<render>-qa.json \
  --destination public/art/<category>/<collection>/<NN>-<slug>.png
```

The receipt is bound to both the PNG's SHA-256 content hash and its intended
catalog destination. Keep it as durable evidence of the checks completed
before the render entered the catalog.

Do not hand-author a receipt or change one to turn a failed check into a pass.
Do not mirror a left-facing render as a repair. Regenerate the candidate in a
mostly frontal, shallow front-three-quarter view with its complete
camera-facing facial plane visible and a slight screen-right bias, then run the
gate again.
