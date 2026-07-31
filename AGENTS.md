# Pixel-Art Repository Instructions

Before generating, editing, renaming, resizing, animating, or documenting
pixel-art:

1. Read `README.md`.
2. Start with `RENDER-PROMPT.md` and follow its category routing. Load only the
   shared and category contracts relevant to the current request.
3. Read only applicable sections of canonical specifications:
   - `ASSET-SPEC.md` for the Crimson Knight.
   - `ENEMY-ASSET-SPEC.md` and
     `collections/enemies/ENEMY-ART-DIRECTION-FEEDBACK.md` for enemies and folklore
     creatures.
4. Read the target collection's `STATUS.md`, `POSITIVE-REFERENCE-NOTES.md`,
   `REJECTION-NOTES.md`, and `GENERATION-PROMPTS.md` when present and relevant.
5. Read `art-catalog/REVIEW-LEARNINGS.md` before writing any generation prompt.
6. Consult `art-catalog/RENDER-FEEDBACK.md` only when the distilled learnings or
   collection notes are insufficient. Treat confirmed ratings, decisions, tags,
   defects, and corrections as direct evidence; do not treat unconfirmed
   suggestions as approved art direction.
7. Follow `ORGANIZATION.md`. Save each original full-quality render once under
   `public/art/<category>/<collection>/`; never create `-source` or
   `-reference-256` duplicates.
8. Do not use a `drafts/` folder for new generations. After the normal
   viability checks, save each generated full-quality render directly at the
   collection root so it appears in the review website. Root placement means
   “available for review,” not approved, retained, canonical, or
   production-ready.

Only visual and category instructions belong in an image-generation prompt.
Workflow, saving, approval, and response instructions guide the agent but must
not be pasted into the generation prompt.

Never hand-edit the review app exports:

- `art-catalog/RENDER-FEEDBACK.md`
- `art-catalog/render-feedback.jsonl`

Do not treat a newly saved or incompletely reviewed batch as canonical. Do not
add rejected or unapproved assets to lore, approval manifests, or canonical
counts.
