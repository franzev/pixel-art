# Project Organization

The public catalog keeps exactly **one active image per item**: the
full-quality render. There are no catalog reference copies, downscales, or
mirrored duplicates. Distinct raw generator attempts are preserved outside the
catalog as non-canonical history.

## Canvas requirement

Every future original full-quality generated render is a square `1:1` PNG,
regardless of category. Every generation prompt must state `square 1:1 canvas;
output width must equal output height`, and the returned PNG must be checked for
exact pixel equality (`width == height`) before it enters `public/art/`.

Reject and regenerate a non-square output. Do not crop, stretch, squash, or pad
it into compliance. This rule is future-facing; historical files remain
unchanged.

Native production sprites, animation sheets, environment plates, UI
composites, and review sheets may use explicitly named target dimensions. They
are derived production or review artifacts, not exceptions to the square
source-render requirement.

## Facing requirement

Every future directional subject uses a mostly frontal, shallow **front**
three-quarter view turned slightly toward screen-right from the viewer's
perspective.
`Right-facing` is a subtle directional bias, not a complete side profile. The
gaze, leading torso action, locomotion, attack, and equipment use favor the
right edge, but the camera-facing facial plane remains readable. For an
unobscured face, both eyes, nose, mouth, chin, and expression remain visible.
Do not use a 90-degree profile, rear three-quarter view, back-of-head view,
ear-only view, far-cheek sliver, or edge-on torso unless explicitly requested.
The wording alone is not sufficient: the forward knee and leading foot,
weight transfer, weapon head or active end, and attack line must visibly favor
screen-right, while the rear leg and loose cloth may trail screen-left. Reject
a result when any dominant locomotion or equipment cue still leads left. Never
mirror the result to fix direction; regenerate it while locking every
asymmetric garment, scar, handed prop, and ornament to its original screen
side.
This requirement
supersedes older collection and canonical screen-left or full-profile
directions. Record `screen-right` in the executable QA plan and treat that
value as this slight three-quarter bias when verifying the 256-pixel inspection
sheet before saving.

A genuinely non-directional prop, empty environment, or abstract composition
may use `not-applicable` only when its QA plan explains why it contains no
directional subject or action.

## One asset location

All renders live in the website catalog:

```text
public/art/<category>/<collection>/
├── <NN>-<slug>.png
├── drafts/  # legacy existing renders only; never add new generations here
└── rejected/
```

Collection records live under one repository root and contain text only:

```text
collections/<category>/<collection>/
├── GENERATION-PROMPTS.md  # active collections only
├── STATUS.md
├── POSITIVE-REFERENCE-NOTES.md
├── REJECTION-NOTES.md
└── <collection>-manifest.json
```

Every render must include both a category and a collection in its path.
Collection folders never contain render files, review sheets, or a `drafts/`
image folder.

For example:

```text
public/art/enemies/tiktik-variations-batch-07/
└── 01-alimokon-omen.png
```

Never keep a second catalog or reference copy of an active render—no `-source`
pairs and no `-reference-256` downscales. Raw generator attempts are the sole
intentional archival exception and remain outside the catalog.

Generation inputs that are not part of the website catalog live by family:

```text
samples/<reference-family>/
```

Generated review sheets and comparison images live under:

```text
art-catalog/review-sheets/<category>/<collection>/
```

Legacy images awaiting classification live under `archive/legacy-art/`. They
are not active renders, positive references, or approved assets. Move an image
out of quarantine only after confirming its intended lifecycle:

- Active or retained render → `public/art/`
- Intentional visual reference → `samples/`
- Review or comparison artifact → `art-catalog/review-sheets/`
- Confirmed obsolete or deleted work → remove through the review workflow

## Raw attempt preservation

Save every returned generator PNG before inspecting, rejecting, retrying, or
selecting it:

```bash
npm run render:save-attempt -- \
  --source <generator-output.png> \
  --series <category>/<collection>/<NN>-<slug>
```

The command stores attempts in generation order without overwriting:

```text
archive/render-attempts/<category>/<collection>/<NN>-<slug>/
├── attempt-01.png
├── attempt-02.png
├── attempt-03.png
└── attempt-log.jsonl
```

Keep every attempt, including internally rejected results. Attempt history is
outside `public/art/`, so it creates no duplicate review items and carries no
approval, retention, lore, canonical, or positive-reference status. Copy only
the selected attempt into the normal candidate workflow; never hand-repaint,
resize, crop, mirror, or overwrite an archived attempt.

## Naming

Use lowercase kebab-case for folders and image files.

- Render: `<NN>-<slug>.png`
- Revised render: `<NN>-<slug>-v<NN>.png`
- Native sprite: `<NN>-<slug>-native-<width>x<height>.png`
- Environment preview: `<NN>-<slug>-preview-<width>x<height>.png`
- Animation sheet: `<slug>-<state>-v<NN>-sheet.png`

Use two digits wherever collections, batches, versions, or assets are numbered.
Do not use spaces, random generation IDs, `final`, `new`, or `final-final`.

## Lifecycle

- Active catalog renders live at the collection root, including newly saved
  renders awaiting review.
- Root placement means “available in the website,” not approved, retained,
  canonical, or production-ready.
- Do not save new generations under `/drafts/`. Existing `/drafts/` paths are
  legacy lifecycle records and may remain until separately reviewed or
  migrated.
- Rejected renders include `/rejected/`.

The first folder after the category is always the collection. The website uses
that folder for its collection label and uses `drafts` or `rejected` only for
lifecycle status.

## Prompt retention

- Keep `RENDER-PROMPT.md` as the project-wide render router and keep its focused
  contracts under `render-contracts/`.
- Keep one `GENERATION-PROMPTS.md` record for each collection that still has a
  catalog render under
  `collections/<category>/<collection>/`.
- Append revisions and later waves to that collection record instead of creating
  standalone continuation, retry, or rejected prompt files.
- Do not keep prompt files inside `rejected/` folders.
- Remove a collection's prompt record when it has no active catalog renders.
  Git history is the archive for removed prompt records.
- `STATUS.md`, positive-reference notes, rejection notes, and exported review
  feedback carry forward decisions; they are not substitutes for obsolete
  prompt archives.

## Generation workflow

1. Generate with both the explicit square `1:1` prompt instruction and the
   generator's `1:1` setting when available.
2. Inspect the returned PNG metadata and confirm `width == height`. Reject and
   regenerate any non-square result without cropping, stretching, or padding
   it.
3. While the candidate remains under `work/`, create its temporary QA sheet and
   run the executable gate documented in `render-contracts/WORKFLOW.md`.
   `npm run render:check` must write a content-hash receipt for the exact
   intended catalog destination.
4. Save the full generated render directly under its
   `public/art/<category>/<collection>/` path — at full quality, once.
   Do this only after the gate passes and do not stage new generations in a
   `drafts/` folder.
5. Treat the saved render as unapproved until the user reviews it on the
   website. Do not update lore, approval manifests, canonical counts, or
   production-ready status merely because the file is at the collection root.
6. Append its exact generation prompt to
   `collections/<category>/<collection>/GENERATION-PROMPTS.md`.
7. Keep `STATUS.md` and the collection manifest current.

Paths written in manifests are relative to the repository root.

While the website is running locally, adding or replacing a PNG under
`public/art/` refreshes the catalog automatically. `npm run sync:art`
from the repository root performs the same refresh manually. New or
pixel-changed renders are rejected during synchronization unless their
content-hash QA receipt matches both the PNG and its catalog destination.

## Redo workflow: one active render per concept

A redo must not leave version siblings in `public/art`. The catalog indexes
every PNG there, so keeping `<slug>.png`, `<slug>-v02.png`, and
`<slug>-v03.png` together creates duplicate review items.

The `work/redo-staging/` path below is an internal atomic-replacement safety
mechanism, not a user-facing draft lifecycle. New standalone generations still
go directly to the collection root.

1. Generate redo attempts under a mirrored staging path outside the catalog:

   ```text
   work/redo-staging/<category>/<collection>/drafts/<NN>-<slug>-v<NN>.png
   ```

2. Preserve each raw output first under `archive/render-attempts/`, then run
   full-size, 256-pixel, focused-crop, anatomy, equipment, and defect checks
   while the candidate remains in staging. Keep internal failures in the
   attempt archive so an earlier version can be reconsidered later.
   Compare every redo beside its source at the same scale and confirm it is the
   same character: visible skin tone and undertone, facial structure, hair
   texture, age, and culturally or ethnically specific appearance remain
   unchanged. Reject incidental lightening, darkening, racial or ethnic
   recasting, or invented identity where the source was covered or ambiguous.
   Before generation, write a self-contained reconstruction prompt describing
   the source's face visibility or covering, body, pose, silhouette, garment
   topology, palette, materials, accessories, footwear state, equipment,
   framing, lighting, background, and pixel treatment. Name the confirmed
   defect as the only authorized change. Do not use mirroring, compositing,
   recoloring, background replacement, scripted inpainting, or any other pixel
   manipulation; a failed redo is regenerated from a revised prompt.
3. Do not copy the candidate into `public/art`; that creates a watcher window
   in which both versions can be indexed.
4. Activate the staged file directly:

   ```bash
   npm run redo:activate -- \
     --candidate work/redo-staging/<category>/<collection>/drafts/<NN>-<slug>-v<NN>.png \
     --source-render-id rnd_<24-hex> \
     --source-path <category>/<collection>/<source.png>
   ```

   The command preflights every path, durably archives older siblings under
   tracked `archive/redo-history/` paths keyed by content-based render ID, and
   swaps the staged candidate into the stable canonical `<NN>-<slug>.png`
   filename using an atomic rename. A running watcher therefore sees the old
   render or the new render, never both.
5. Activation updates a matching collection manifest when present, appends the
   machine-maintained activation log in `art-catalog/REDO-TRACKER.md`, and
   rebuilds `app/art-index.json`. If metadata or catalog synchronization fails,
   it restores the files and metadata and leaves the candidate in staging.
6. Preserve ratings, defects, corrections, and lineage by render ID in the
   review exports and redo tracker. Do not keep superseded bitmaps in the
   catalog merely to preserve review history.

At any moment, one concept slot has exactly one catalog image. Previous
bitmaps remain durably recoverable outside the catalog. `npm run sync:art`
enforces this repository-wide by rejecting any canonical/version sibling group
under `public/art`.
