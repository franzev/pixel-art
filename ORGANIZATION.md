# Project Organization

The repository keeps exactly **one image per item**: the full-quality render.
There are no reference copies, downscales, or mirrored duplicates.

## One asset location

All renders live in the website catalog:

```text
public/art/<category>/<collection>/
├── <NN>-<slug>.png
├── drafts/
└── rejected/
```

Category collection folders at the repository root hold only text documents and
non-catalog working material:

```text
<category>/<collection>/
├── GENERATION-PROMPTS.md  # active collections only
├── STATUS.md
├── <collection>-manifest.json
└── <collection>-review-sheet.png
```

Every render must include both a category and a collection in its path.
Category roots may contain shared text documents, but never loose image assets
or a top-level `drafts/` folder.

For example:

```text
public/art/enemies/tiktik-variations-batch-07/drafts/
└── 01-alimokon-omen.png
```

Never keep a second copy of a render anywhere — no `-source` pairs, no
`-reference-256` downscales. The catalog file is the source.

Generation inputs that are not part of the website catalog live by family:

```text
samples/<reference-family>/
```

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

- Retained renders live at the collection root.
- Draft renders include `/drafts/`.
- Rejected renders include `/rejected/`.

The first folder after the category is always the collection. The website uses
that folder for its collection label and uses `drafts` or `rejected` only for
lifecycle status.

## Prompt retention

- Keep `RENDER-PROMPT.md` as the project-wide generation contract.
- Keep one `GENERATION-PROMPTS.md` record for each collection that still has a
  retained render or an active draft.
- Append revisions and later waves to that collection record instead of creating
  standalone continuation, retry, or rejected prompt files.
- Do not keep prompt files inside `rejected/` folders.
- Remove a collection's prompt record when it has no retained or active draft
  renders. Git history is the archive for removed prompt records.
- `STATUS.md`, positive-reference notes, rejection notes, and exported review
  feedback carry forward decisions; they are not substitutes for obsolete
  prompt archives.

## Generation workflow

1. Save the full generated render directly under its
   `public/art/<category>/<collection>/` path — at full quality, once.
2. Append its exact generation prompt to the active collection's single prompt
   record.
3. Keep `STATUS.md` and the collection manifest current.

Paths written in manifests are relative to the repository root.

While the website is running locally, adding or replacing a PNG under
`public/art/` refreshes the catalog automatically. `npm run sync:art`
from the repository root performs the same refresh manually.
