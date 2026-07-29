# Project Organization

The repository keeps one permanent copy of each file.

## Two asset locations

Full generated sources and working files stay in their category collections:

```text
<category>/<collection>/
├── <NN>-<slug>-source.png
├── drafts/
├── GENERATION-PROMPTS.md
├── STATUS.md
├── <collection>-manifest.json
└── <collection>-review-sheet.png
```

Every generated image must include both a category and a collection. Category
roots may contain shared text documents, but never loose image assets or a
top-level `drafts/` folder.

Website-ready renders live only under the matching path in:

```text
site/public/art/<category>/<collection>/
```

For example:

```text
enemies/tiktik-variations-batch-07/drafts/
└── 01-alimokon-omen-source.png

site/public/art/enemies/tiktik-variations-batch-07/drafts/
└── 01-alimokon-omen-reference-256.png
```

Do not keep another copy of a website-ready render beside its source.

Generation inputs that are not part of the website catalog live by family:

```text
samples/<reference-family>/
```

## Naming

Use lowercase kebab-case for folders and image files.

- Source: `<NN>-<slug>-source.png`
- Website render: `<NN>-<slug>-reference-256.png`
- Revised source: `<NN>-<slug>-v<NN>-source.png`
- Revised website render: `<NN>-<slug>-v<NN>-reference-256.png`
- Native sprite: `<NN>-<slug>-native-<width>x<height>.png`
- Environment preview: `<NN>-<slug>-preview-<width>x<height>.png`
- Animation sheet: `<slug>-<state>-v<NN>-sheet.png`

Use two digits wherever collections, batches, versions, or assets are numbered.
Do not use spaces, random generation IDs, `final`, `new`, or `final-final`.

## Lifecycle

The relative path below the category must match between the source and website
render.

- Retained sources live at the collection root.
- Draft sources and renders include `/drafts/`.
- Rejected sources and renders include `/rejected/`.

The first folder after the category is always the collection. The website uses
that folder for its collection label and uses `drafts` or `rejected` only for
lifecycle status.

## Generation workflow

1. Save the full generated source in its category collection.
2. Create the 256 × 256 nearest-neighbor render.
3. Save that render under the matching `site/public/art/` path.
4. Keep `STATUS.md` and the collection manifest current.

Paths written in manifests are relative to the repository root.

While the website is running locally, adding or replacing a PNG under
`site/public/art/` refreshes the catalog automatically. `npm run sync:art`
inside `site/` performs the same refresh manually.
