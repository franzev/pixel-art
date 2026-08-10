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
- The mandatory mostly frontal, shallow front-three-quarter pose with a
  visible camera-facing facial plane and slight screen-right bias for every
  directional subject.
- The mandatory square `1:1` canvas for every generated render.
- The canonical `#171311` background when the request is an isolated asset
  concept or opaque preview.

This confirms interpretation; it is not a request for the user to redesign the
brief.

For every redo, regeneration, correction, or reference-based revision,
preflight must also record the source character's visible identity invariants:
skin tone and undertone, facial structure, hair texture, age, gender
presentation, and any culturally or ethnically specific appearance. State that
the result is the same character, not a recast, and list only the traits or
defects authorized to change. If an identity trait is covered or ambiguous,
record that the candidate must preserve the covering or ambiguity.

The redo preflight must also produce a complete visual inventory of the source:
face covering and visibility, body build, pose, silhouette, every garment
layer and opening, local palette and materials, accessories, footwear or bare
feet, equipment construction and grip, framing, lighting, background, and
pixel treatment. Put those visual facts into the generation prompt. A category
name or short character description is not an adequate reconstruction prompt.
List the named defect as the only authorized change and list every other source
trait as locked.

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
- Enforce the default retry budget:
  - at most two generator outputs for one concept: the initial output plus one
    targeted correction;
  - at most two correction calls across the complete review wave;
  - every returned generator output counts, including immediate failures and
    near-duplicates;
  - additional retries require new explicit user approval for that named
    concept.
- Immediately after every generation call returns, archive the untouched PNG
  before visual inspection, QA, retrying, or selection:

  ```bash
  npm run render:save-attempt -- \
    --source <generator-output.png> \
    --series <category>/<collection>/<NN>-<slug>
  ```

  The command assigns the next ordered `attempt-NN.png` filename and refuses
  overwrites. Preserve first, second, third, and all later attempts, including
  obvious failures. Never delete an archived attempt merely because a later
  try currently appears stronger; the user may prefer an earlier image.
- **Immediate web-gallery gate:** the archived attempt must be indexed and
  available in the gallery's **History** view before any visual inspection,
  QA decision, retry, or next generation call. Do not wait until the wave is
  complete. Confirm the exact new attempt path is present in
  `app/attempt-index.json` and accessible through the running gallery.
- `npm run render:save-attempt` normally refreshes the attempt index. If the
  new attempt is not visible, run `npm run sync:attempts`. If the gallery is
  not running, start `npm run dev`, wait for the attempt index to load, and
  verify the History item before continuing. Indexing failure is a blocking
  workflow failure, not a reason to keep generating offline.
- Keep **Catalog** and **History** distinct: every raw generator output appears
  in History immediately, including failed attempts; only a selected render
  that passes the executable render gate enters Catalog. Web availability does
  not imply approval, viability, retention, or canon.
- **Armed-concept serial gate:** after archiving an armed result, do not start
  the next distinct concept in the wave until the current result's complete
  weapon geometry, handle, joins, and hand contacts have been inspected at
  full resolution and 256 pixels. Prompt wording such as `straight shaft` or
  `continuous centerline` is not evidence that the output obeyed it. A visible
  bow, kink, offset, broken join, shortened proportion, hidden contact, or
  incorrect grip rejects that attempt immediately and requires a new attempt
  of the same concept before the wave may advance.
- The armed-concept serial gate never creates unlimited retries. If its one
  allowed correction also fails, record the concept as failed/abandoned for
  the wave and advance to the next distinct planned concept. Never accept the
  malformed equipment, and never spend a third call without the user's new
  explicit approval.
- For every intended straight blade, shaft, haft, barrel, or handle, create a
  temporary QA view with a straight reference line connecting the documented
  endpoints. Inspect the midpoint and every component join against that line.
  The overlay is review evidence only and must never alter the source PNG.
- A failed raw attempt remains saved and indexed in History because attempt
  preservation is mandatory. Record it as a failed attempt; never describe it
  as viable, selected, or catalog-ready. The presence of a raw attempt in
  History is not permission to skip the serial gate.
- Treat the requested quantity as the total desired count.
- Treat distinct concepts and retries separately. Five requested characters
  means five planned concept slots; archived retries do not count toward the
  requested quantity.
- Work in review waves of no more than five.
- Never substitute a large contact sheet for separate source images.
- Stop immediately when the user says stop, even if the total is incomplete.
- Run the routed quality gates before presenting or saving a result as viable.
- Redos are fresh whole-image generations. Never mirror, composite, recolor,
  replace the background, inpaint with a local script, or otherwise manipulate
  the returned pixels to force compliance. Correct failures through a revised
  full-description prompt and another generation call.
- Keep every new or changed candidate under `work/` until it passes the
  executable render gate. Copy `render-contracts/RENDER-QA-TEMPLATE.json` to a
  task-specific JSON file under `work/`, fill its construction, palette,
  diversity, crop, and visual-review fields, and never mark an attestation true
  without inspecting the corresponding evidence.
- Set the generator to `1:1` when an aspect-ratio control is available, and
  include `square 1:1 canvas; output width must equal output height` in every
  generation prompt.
- Inspect the returned file metadata and require exact pixel equality
  (`width == height`). Reject and regenerate any non-square result before
  presentation or saving; never crop, stretch, squash, or pad it into
  compliance.
- Verify at full resolution and 256 pixels that every directional subject is
  mostly frontal in a shallow front-three-quarter view with a slight
  screen-right bias. The camera-facing facial plane must be readable; when
  unobscured, both eyes, nose, mouth, chin, and expression must be visible.
  Face, gaze, leading torso action, locomotion, attack, and equipment use favor
  the right edge without turning the face away. Inspect the concrete cues:
  forward knee and leading foot, weight transfer, weapon head or active end,
  and attack line must lead screen-right, while the rear leg and loose cloth
  may trail left. Reject and regenerate a
  left-facing, 90-degree-profile, rear-three-quarter, back-of-head, ear-only,
  far-cheek-sliver, or edge-on result unless explicitly requested; do not
  mirror it as a repair. For a redo, also verify that asymmetric shoulders,
  scars, sleeves, shawls, handed props, and ornaments remain on their original
  screen sides.
- For an isolated concept or opaque preview, verify that sampled background
  pixels—including every corner and canvas edge—are uniformly `#171311`.
  Reject a result with any alternate near-black, tint, gradient, vignette,
  floor, shadow, glow, texture, scenery, or atmospheric variation.
- For armed characters, inspect focused crops of every hand-to-handle contact,
  blade/head-to-handle join, shield attachment, and crossbow release mechanism.
  Reject before candidate saving when any construction detail cannot be
  verified. This inspection must happen before generating the next distinct
  armed concept, not after completing the full wave.
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

### Mandatory executable render gate

Before any new or changed PNG enters `public/art/`:

1. Build the temporary evidence sheet while the candidate remains under
   `work/`:

   ```bash
   npm run render:qa -- \
     --image work/<render>.png \
     --plan work/<render>-qa.json
   ```

2. Inspect the full-color and grayscale 256-pixel views and every face, hand,
   equipment-join, and feet crop. Confirm a mostly frontal, shallow
   front-three-quarter pose with the complete camera-facing facial plane
  readable and the gaze, leading torso action, locomotion, attack, and
  equipment biased slightly toward screen-right. Confirm that the subject has
  not turned away, exposed mainly the rear or far cheek, or collapsed into a
  full side profile. Confirm that the forward knee and leading foot, weight
  transfer, weapon head or active end, and attack line actually lead right;
  reject a result when dominant cues still lead left. Record only confirmed
  pass attestations in the QA plan.
  For a redo or source-based revision, compare source and candidate side by
  side at the same scale. Confirm that visible skin tone and undertone, facial
   structure, hair texture, age, and culturally or ethnically specific
   appearance remain the same. Reject an incidental lightening, darkening,
  racial or ethnic recast, or newly invented identity where the source was
  covered or ambiguous. Also confirm that face covering, body build,
  proportions, unaffected pose, silhouette, garment topology, palette,
  materials, accessories, footwear state, and unaffected equipment
  construction remain unchanged. The candidate fails when it fixes the named
  defect by redesigning any unrelated trait.
3. Run the blocking validator and bind the passing receipt to the intended
   catalog destination:

   ```bash
   npm run render:check -- \
     --image work/<render>.png \
     --plan work/<render>-qa.json \
     --destination public/art/<category>/<collection>/<NN>-<slug>.png
   ```

4. Save or activate the candidate only after the validator prints `PASS`.

`npm run sync:art` independently enforces the content-hash receipt. A new
render, pixel-changing replacement, or redo cannot enter the review catalog
without a receipt whose image checks, visual QA plan, content hash, and
destination all match. Unchanged historical entries are grandfathered; do not
create receipts that pretend they passed the new policy.

## Saving and Prompt Retention

- Save one original full-quality render directly under
   `public/art/<category>/<collection>/` as `<NN>-<slug>.png`.
- Save only after the executable render gate passes and writes the matching
  content-hash receipt. Prompt compliance or a self-assigned quality score is
  never sufficient.
- Never create catalog `-source` or `-reference-256` duplicate files. Ordered
  raw generator attempts in `archive/render-attempts/` are the intentional
  non-catalog exception.
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
- Record which archived attempt was selected as the candidate. Non-selected
  attempts remain non-catalog comparison history and are never treated as
  approved, retained, canonical, or positive references by default.
- Do not create prompt files under `rejected/`.
- Remove the prompt record when a collection has no active catalog renders.

## Approval

- Never mark work canonical, retained, approved, or production-ready without
  explicit user approval.
- Do not update lore, canonical counts, retained galleries, or approval
  manifests before approval.
- Silence is not approval.
- “This is enough” means stop generating, not approve the renders.
- If generation finishes after the user says stop, preserve the raw result in
  attempt history but do not select, present, or promote it unless the user
  later requests it.
- When the user rejects a complete batch and requests deletion, use a
  recoverable method when practical and remove it from active presentation.

## Response After a Wave

- Show each render.
- Confirm that every raw attempt was available in the web gallery's History
  view immediately after generation, and identify any selected renders that
  separately entered Catalog after passing the render gate.
- Give it a short functional name and one-line gameplay identity.
- Label every newly saved item `Unreviewed`.
- State that the render is saved and ready for review in the website; chat
  approval is not required before saving.
- Mention internally rejected attempts only when they materially affected the
  result.
- When a concept required multiple attempts, state that all attempts were
  preserved and provide the attempt-history location so the user can compare
  them.
- Invite approval, rejection, or adjustment either in the website or in chat.

Do not write lore essays or promote unreviewed renders while awaiting visual
approval.
