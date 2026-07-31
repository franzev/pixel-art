# Render Workflow Contract

This file guides the agent's process. Do not paste it into an image-generation
prompt.

## Preflight

Silently inspect the routed contracts, current review learnings, and relevant
collection notes. Then give the user a compact preflight stating:

- Interpreted asset category.
- Requested quantity and current review-wave size.
- Positive reference or closest accepted direction.
- Traits being preserved.
- How the concepts will differ.
- Relevant hard prohibitions.
- The mandatory square `1:1` canvas for every generated render.
- The canonical `#171311` background when the request is an isolated asset
  concept or opaque preview.

This confirms interpretation; it is not a request for the user to redesign the
brief.

Before selecting any existing render as an image reference, distinguish its
review decision from its reference status. A `keep` rating does not
automatically make a render a reusable positive anchor. Check current review
learnings, category feedback, and collection notes for retirement or fatigue
locks. Never use a reference-retired full-body render as an image input.
Whenever possible, use a design-neutral pixel-treatment crop or style sample
instead of conditioning a new character on a complete existing costume.

For a wave containing two or more knights or armored humanoids, preflight must
also include the armor structural matrix required by `KNIGHTS.md`. Compare the
planned concepts with one another and with the ten most recent comparable
renders. Record at least four structural differences per comparison; weapon,
weapon angle, palette, insignia, weathering, and name do not count.

For a wave containing two or more comparable characters, preflight must include
the palette matrix required by `CORE.md`. Record dominant material and color
family, secondary garment hue and value, metal finish and temperature, leather
or wood hue, accent role and coverage, and lighting direction and temperature.
Require at least three differences between every pair and against each of the
ten most recent comparable renders. Small shifts within the same
black-grey-brown family do not count.

For a wave containing two or more female characters, preflight must include a
female identity matrix. Assign each concept distinct face shape, jaw and chin,
eyes and brows, nose, mouth, cheek structure, age cues, hairline, and hairstyle.
At least four structural facial axes must differ between every pair; hairstyle
does not count toward those four. Keep every woman within the approximately
21–35 apparent-age direction, record how each remains attractive without
reusing a standardized beauty template, and keep every concept unmistakably
adult and distinctly feminine. Reject a strongly masculine-coded combination
of brow, jaw, chin, facial planes, and neck while preserving varied
brief-appropriate features without imposing one ethnicity. Record a simple
battle-ready hairstyle for each woman and how it remains clear of her eyes,
armor, hands, and equipment; do not use hairstyle complexity to manufacture
batch variety.

When a concept includes a weapon, shield, or weapon-like tool, preflight must
also establish:

- Completion of `EQUIPMENT-RESEARCH.md`.
- At least one authoritative measured object record.
- A full-profile reference and a separate handle, socket, trigger, or
  shield-back view.
- The exact real-world equipment type.
- A realistic total length and component proportions.
- The handler-relative scale used to translate that measurement into the
  render.
- The intended grip, handle or shaft axis, shield attachment, and load path.
- For an oversized sword, the measured usable grip length, proof that both
  hands fit between guard and pommel, and a pose exposing the complete
  guard–hands–grip–pommel relationship.
- For a crossbow, the support hand, firing hand, trigger finger, and string
  clearance.

If these facts cannot be established, stop that equipment direction before
generation and choose a better-documented conventional weapon. Do not guess.

Record the equipment-research note and source links before the exact prompt in
the active collection's `GENERATION-PROMPTS.md`. Use only the extracted visual
facts—not URLs or workflow prose—in the image-generation prompt.

## Quantity and Generation

- Default to one when quantity is omitted.
- Generate one distinct asset per image and use one generation call per concept.
- Treat the requested quantity as the total desired count.
- Work in review waves of no more than five.
- Never substitute a large contact sheet for separate source images.
- Stop immediately when the user says stop, even if the total is incomplete.
- Run the routed quality gates before presenting or saving a result as viable.
- Set the generator to `1:1` when an aspect-ratio control is available, and
  include `square 1:1 canvas; output width must equal output height` in every
  generation prompt.
- Inspect the returned file metadata and require exact pixel equality
  (`width == height`). Reject and regenerate any non-square result before
  presentation or saving; never crop, stretch, squash, or pad it into
  compliance.
- For an isolated concept or opaque preview, verify that sampled background
  pixels—including every corner and canvas edge—are uniformly `#171311`.
  Reject a result with any alternate near-black, tint, gradient, vignette,
  floor, shadow, glow, texture, scenery, or atmospheric variation.
- For armed characters, inspect focused crops of every hand-to-handle contact,
  blade/head-to-handle join, shield attachment, and crossbow release mechanism.
  Reject before saving when any construction detail cannot be verified.
- For a longsword, greatsword, zweihänder, or other oversized sword, inspect one
  crop containing the guard, both complete hands, the full usable grip, and the
  pommel. Reject immediately if either hand touches or appears to touch the
  blade, forte, or ricasso; crosses the guard; or cannot fit entirely on the
  grip.
- For a multi-woman wave, compare same-scale portrait crops side by side at full
  resolution and 256 pixels. Reject any same-face pair even when their hair,
  clothing, or colors differ. Also reject a face that is not visibly attractive
  in the intended severe or mournful style, reads older than the active
  young-adult direction, could be mistaken for a minor, or reads as deliberately
  masculine or heavily androgynous rather than distinctly feminine. Reject
  ornate, salon-styled, excessively voluminous, or unsecured hair and any
  strand that blocks vision, armor articulation, a hand contact, shield grip,
  or weapon mechanism.
- For knights and armored humanoids, make temporary body-only silhouette and
  grayscale comparison views at 256 pixels. Ignore or mask the weapon,
  insignia, palette, surface weathering, and small accessories. Compare against
  the current wave and the ten most recent comparable renders. These are
  temporary QA views, not permanent catalog duplicates.
- Reject any knight whose body-only read repeats an existing armor
  architecture, even when its weapon, pose, color, or devotional ornament is
  different. A changed weapon line cannot satisfy armor diversity.
- If two results in one wave fail the same structural-similarity gate, stop the
  remaining wave and rewrite the armor blueprints before generating again.
- For comparable character waves, compare temporary full-color 256-pixel views
  side by side with the current wave and ten most recent comparable renders.
  Verify that metal, cloth, leather, wood, skin, and accents keep distinct local
  color ramps. These are temporary QA views, not permanent catalog duplicates.
- Reject global sepia, brown, bronze, grey-black, desaturated, or uniformly
  warm/cool grading even when the silhouette and equipment pass.
- Reject any soft vignette, edge falloff, warm halo, or background tint. The
  fixed `#171311` field must remain pixel-uniform and separate from the subject.
- If two results in one wave fail the same palette or global-grade gate, stop
  the remaining wave and rewrite the palette-and-lighting scripts before
  generating again.

## Saving and Prompt Retention

- Save one original full-quality render directly under
   `public/art/<category>/<collection>/` as `<NN>-<slug>.png`.
- Save only after its actual pixel dimensions pass the square `1:1` gate.
- Never create `-source` or `-reference-256` duplicate files.
- Follow existing category, collection, numbering, and filename conventions.
- Do not place new generations in a `drafts/` folder. After the normal
  viability checks, save each viable render at the collection root so it
  appears in the review website.
- Treat catalog placement and review state separately. A render at the
  collection root remains unapproved until the user reviews it; saving it does
  not make it retained, canonical, or production-ready.
- Deliberately redraw native production sprites to their target grid; never
  blindly shrink a concept master and call it final.
- Native sprites, animation sheets, environment plates, UI composites, and
  review sheets may use named non-square production dimensions, but they do
  not relax the `1:1` requirement for the original generated render.
- Append the exact prompt, revisions, and waves to the active collection's
  single `GENERATION-PROMPTS.md`.
- Do not create prompt files under `rejected/`.
- Remove the prompt record when a collection has no active catalog renders.

## Approval

- Never mark work canonical, retained, approved, or production-ready without
  explicit user approval.
- Do not update lore, canonical counts, retained galleries, or approval
  manifests before approval.
- Silence is not approval.
- “This is enough” means stop generating, not approve the renders.
- If generation finishes after the user says stop, do not save the result unless
  the user later requests it.
- When the user rejects a complete batch and requests deletion, use a
  recoverable method when practical and remove it from active presentation.

## Response After a Wave

- Show each render.
- Give it a short functional name and one-line gameplay identity.
- Label every newly saved item `Unreviewed`.
- State that the render is saved and ready for review in the website; chat
  approval is not required before saving.
- Mention internally rejected attempts only when they materially affected the
  result.
- Invite approval, rejection, or adjustment either in the website or in chat.

Do not write lore essays or promote unreviewed renders while awaiting visual
approval.
