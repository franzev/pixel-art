# The Ashen Archive

A responsive personal contact sheet for the pixel-art repository.

## What it does

- Indexes the canonical 256px renders and environment previews stored in
  `public/art/`.
- Filters by collection and review decision. Collection filtering uses compact
  autocomplete results with removable selection chips. All lifecycle states
  are reviewed together.
- Searches names, filenames, and collection metadata.
- Provides a large inspection view with keyboard navigation.
- Provides a one-by-one review desk with ratings, decisions, defects,
  correction notes, duplicate links, and safe deletion marking.
- Saves reviews optimistically to a local database while navigation remains
  instant.
- Exports confirmed feedback to `../art-catalog/` for future generation
  sessions.
- Adapts the filter panel, gallery, and inspector for desktop, tablet, and phone.

## Adding renders

Save a website-ready PNG under
`public/art/<category>/<collection>/<lifecycle>/`. The collection folder must
come before `drafts/` or `rejected/`. While the local website is running, the
catalog refreshes automatically when PNGs are added, changed, moved, or
removed.

Character and creature renders use `<NN>-<slug>.png` at full quality.
Environment previews use `<NN>-<slug>-preview-<width>x<height>.png`.

Each render exists exactly once, here. There are no separate `-source`
originals or `-reference-256` downscales anywhere in the repository.

## Local use

```bash
npm install
npm run dev
```

The catalog refreshes automatically during development and before production
builds.

```bash
npm run sync:art
npm run build
```

## Reviewing renders

Open the local gallery and choose **Review**. The default queue contains
unreviewed renders and updates as new images are added.

- `1`–`5`: rate the current render
- `K`: keep and advance
- `C`: correct the current render
- `R`: rerender the same concept
- `G`: redesign the concept
- `U`: mark as a possible duplicate
- `X`: reject the concept
- `D`: mark for deletion, save, and advance immediately (no rating required)
- `N`: focus the feedback field
- `←` / `→`: previous or next
- `Space`: zoom
- `Cmd/Ctrl+Z`: undo the latest review change

Keepers take two keys: a rating followed by `K`. Decisions that need an
explanation open the defect panel; select the relevant defects and press
`Enter` to save and advance. Deletion is the exception: `D` records the
deletion mark and advances without capturing rating or feedback drafts.

Suggested tags are searchable but remain unconfirmed until reviewed. Clicking a
tag cycles through confirmed, rejected, and suggested states.

While the local gallery is running, confirmed review memory is refreshed in:

- `../art-catalog/RENDER-FEEDBACK.md`
- `../art-catalog/render-feedback.jsonl`
