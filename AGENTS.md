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
7. Follow `ORGANIZATION.md`. Immediately archive every raw generator output,
   before judging or retrying it, with `npm run render:save-attempt`. Keep
   ordered first, second, third, and later attempts; never overwrite or delete
   an attempt because a later try initially looks better. Save only the chosen
   viable render under `public/art/<category>/<collection>/`; never create
   `-source` or `-reference-256` duplicates in the catalog.
8. Do not use a `drafts/` folder for new generations. After the normal
   viability checks, save each generated full-quality render directly at the
   collection root so it appears in the review website. Root placement means
   “available for review,” not approved, retained, canonical, or
   production-ready.
9. Interpret `right-facing` as a subtle directional bias, not a complete side
   profile. Keep the subject mostly frontal in a shallow **front**
   three-quarter view, turned slightly toward screen-right. Keep the
   camera-facing facial plane readable: for an unobscured face, show both eyes,
   the nose, mouth, and expression. The gaze, leading action, locomotion, and
   equipment must read rightward, but do not rotate the head or torso into a
   90-degree profile, rear three-quarter view, back-of-head view, or far-cheek
   sliver unless the user explicitly requests one. Do not rely on the label
   `right-facing`: verify that the forward knee and leading foot, weight
   transfer, attack line, and weapon head or active end lead toward
   screen-right while the rear leg and loose cloth may trail screen-left.
   Reject and regenerate a result when any dominant cue still leads left. Do
   not mirror a result to repair direction; lock asymmetric shoulders, scars,
   garments, handed props, and ornaments to their original screen sides.
10. Treat every redo, regeneration, correction, and reference-based revision as
    the same character—not a recast. Preserve the source character's visible
    skin tone and undertone, facial structure, hair texture, age, and
    culturally or ethnically specific appearance unless the user explicitly
    requests a change. Never lighten, darken, or otherwise change racial or
    ethnic appearance as an incidental consequence of regeneration. If those
    traits are covered or ambiguous in the source, preserve that ambiguity
    instead of inventing a new identity.

Only visual and category instructions belong in an image-generation prompt.
Workflow, saving, approval, and response instructions guide the agent but must
not be pasted into the generation prompt.

Never hand-edit the review app exports:

- `art-catalog/RENDER-FEEDBACK.md`
- `art-catalog/render-feedback.jsonl`

Do not treat a newly saved or incompletely reviewed batch as canonical. Do not
add rejected or unapproved assets to lore, approval manifests, or canonical
counts.
