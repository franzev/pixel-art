# Render gate receipts

This directory contains machine-written, content-hash-keyed QA receipts for
renders checked with the local QA tools.

Create a temporary inspection sheet first:

```bash
npm run render:qa -- \
  --image work/<render>.png \
  --plan work/<render>-qa.json
```

After inspecting the sheet and recording every visual attestation, run:

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
Regenerate or correct the candidate and run the gate again.
