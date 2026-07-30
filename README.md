# The Ashen Archive

This repository is both the pixel-art workspace and its searchable review
gallery. The website runs directly from the repository root.

## Repository layout

- `public/art/` — the only permanent location for full-quality catalog renders.
- `app/`, `db/`, `scripts/`, and `worker/` — the gallery and review application.
- Category folders such as `enemies/`, `protagonist/`, and `environments/` —
  prompts, status files, manifests, review notes, and non-catalog working
  material.
- `samples/` — intentional visual references and generation inputs.
- `art-catalog/` — exported review decisions and distilled generation lessons.
- `ORGANIZATION.md` — canonical folder, filename, and generation workflow.

## Canonical specifications

- `ASSET-SPEC.md` — Crimson Knight proportions, equipment, native scale, facing
  direction, cape, sword, and animation baseline.
- `ENEMY-ASSET-SPEC.md` — Enemy and folklore-creature art direction, palette,
  batch workflow, folder structure, filenames, 256 × 256 references, manifests,
  review sheets, approvals, and lore updates.
- `enemies/ENEMY-LORE-COMPENDIUM.md` — Working world canon and gameplay identity
  for retained enemy designs.
- `enemies/ENEMY-ART-DIRECTION-FEEDBACK.md` — Durable user preferences,
  rejected directions, strongest positive references, and batch workflow
  lessons. Read this before proposing or generating a new enemy batch.
- `RENDER-PROMPT.md` — Master render contract for all new generation requests.
- `art-catalog/REVIEW-LEARNINGS.md` — Distilled, confirmed lessons from the
  user's bulk render review (weapon rules, default-off effects, current
  positive anchors, cleared-out directions). Mandatory reading before writing
  any generation prompt. The adjacent `RENDER-FEEDBACK.md` and
  `render-feedback.jsonl` are machine exports — never hand-edit them.

## Non-negotiable project rules

1. Never use a green background.
2. Generate each distinct asset separately rather than placing multiple concepts
   in one generated image.
3. Save the original full-quality render once under `public/art/`.
4. Do not create separate `-source` or `-reference-256` copies.
5. A catalog render is not automatically a native game sprite.
6. Review anatomy, silhouette, palette, and artifacts at 256 pixels before marking
   an asset retained.
7. Do not add rejected or deleted generations to the lore or canonical counts.
8. Do not copy the Penitent One's costume, pose, proportions, helmet, or
   silhouette. It is a pixel-treatment reference only.
9. Weapons must be straight, full combat length, and gripped correctly by the
   handle — never by the blade, and with both hands for two-handed weapons.
10. No floating spell effects, droplets, or particles unless the brief
    explicitly requests visible magic.

## Continuing work

Read the selected collection's `STATUS.md` and manifest before resuming it.
Collection status files take precedence over older continuation notes elsewhere.
When a collection contains `POSITIVE-REFERENCE-NOTES.md` or
`REJECTION-NOTES.md`, both are mandatory continuation reading. Follow their
visual anchors, guardrails, and approval checkpoints before generating new
assets.

## Using the gallery

Install dependencies and start the local gallery from this directory:

```bash
npm install
npm run dev
```

The catalog refreshes when PNGs are added, changed, moved, or removed under
`public/art/`. It can also be refreshed manually:

```bash
npm run sync:art
npm run build
```

The Review view supports ratings, keep/reject/delete decisions, defects,
correction notes, duplicate links, and keyboard navigation. Confirmed review
memory is exported to:

- `art-catalog/RENDER-FEEDBACK.md`
- `art-catalog/render-feedback.jsonl`
