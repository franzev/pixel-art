# Enemy Pixel-Art Asset Specification

**Status:** Canonical production baseline  
**Version:** 1.7
**Last updated:** 2026-07-31
**Scope:** Enemies, demons, cultists, ghosts, possessed civilians, folkloric
creatures, and enemy concept batches

## 1. Purpose and precedence

This document is the source of truth for generating and saving enemy assets in a
future session.

Use these precedence rules when instructions conflict:

1. The user's latest explicit instruction.
2. A batch-specific `GENERATION-PROMPTS.md`.
3. This enemy specification.
4. Earlier exploratory prompts or images.

`ASSET-SPEC.md` remains authoritative for the Crimson Knight. Do not apply the
Knight's armor, crimson cape, sword, or heroic silhouette to enemies unless the
user explicitly requests it.

## 2. Session startup checklist

Before creating a new enemy batch:

1. Read `pixel-art/README.md`.
2. Read this entire file.
3. Read the current batch's `STATUS.md` or `GENERATION-PROMPTS.md`, if present.
4. Read only the relevant sections of `collections/enemies/ENEMY-LORE-COMPENDIUM.md`.
5. Inspect one or two approved references from the closest existing batch.
6. Confirm the next batch number from the registry in this document.
7. Generate one separate image per distinct design.
8. Save the full-quality render once under `public/art/`.
9. Inspect the renders at 256 × 256 together on a review sheet without creating
   permanent downscale copies.
10. Mark assets retained only after the batch passes the quality checklist.

## 3. Core art direction

Create original dark-fantasy pixel-art characters for a side-scrolling gothic
Metroidvania. The mood combines ruined sacred spaces, weathered lived-in
materials, restrained supernatural color, and readable in-game silhouettes.

The enemy library is not limited to Filipino, Philippine, 1970s, colonial, or
folklore-derived design. Do not add banig, abaca, capiz, Filipino clothing,
Philippine creature anatomy, or regional craft motifs unless the user's current
brief or active collection explicitly requires them. A themed collection
governs only its own assets. When culture and period are unspecified, use an
original grounded gothic or dark-fantasy direction without culture-specific
decoration.

The desired result is:

- Dark, strange, melancholy, and threatening
- Weird without becoming visually incoherent
- Detailed enough to feel premium but simplified enough to animate
- Readable at small size
- Clearly distinct from the Crimson Knight
- Inspired by the density and discipline of high-quality Metroidvania sprites
  without reproducing an existing game's character, costume, or composition

### Active demon diversity lock

Effective 2026-07-30 and until the user explicitly changes this direction, all
new demon character concepts must follow these project-wide constraints:

- No animal-bodied, animal-headed, or animal-derived demon designs.
- No imps or imp-like designs: avoid small hunched bodies, oversized heads,
  mischievous goblin-like faces, diminutive proportions, and generic imp
  silhouettes.
- No red-dominant demons. Red, scarlet, oxblood, burgundy, flesh-pink, and
  mauve may not be the primary body palette.
- Prefer full-height adult humanoid or clearly person-like infernal characters
  using cool and neutral body palettes.
- Create variety through posture, clothing, tools, bindings, masks, controlled
  effects, facial planes, and hand gestures—not animal anatomy.

This lock governs new work; it does not retroactively approve, reject, delete,
or rewrite existing assets.

### Reference roles

`/Users/franz/Desktop/Penitent_One_Skin_09.webp` is a pixel-treatment reference
only:

- Connected pixel clusters
- Restrained color ramps
- Selective highlights
- Strong weapon and limb separation
- Native-size readability

Never copy its conical helmet, teal-and-rust costume, religious imagery, crouched
proportions, exact stance, or silhouette.

`/Users/franz/Desktop/knight.png` and the
`pixel-art/samples/silver-knight/silver-knight-*` assets define the
protagonist, not the enemy library.

Approved enemy batches are the best style references for new enemies. Choose the
closest thematic batch rather than using every previous image at once.

## 4. Image roles and sizes

Every file role must remain explicit.

### A. Generated render (the one canonical image)

Filename:

`<NN>-<descriptive-slug>.png`

Rules:

- Preserve the full square image returned by the image-generation workflow at
  full quality.
- Save it directly under the matching `public/art/enemies/` path. That is
  its only home — never create a `-source` copy, a `-reference-256` downscale,
  or any other duplicate.
- Do not overwrite, crop, stretch, or upscale it.
- The exact dimensions may vary.
- The render is the concept master, not necessarily a production sprite.
- Used for review, comparisons, documentation, and future prompting.

### B. Native game sprite

Filename:

`<NN>-<descriptive-slug>-native-<width>x<height>.png`

or, when a project-wide native size is already established:

`<NN>-<descriptive-slug>-native.png`

Rules:

- Created deliberately at the chosen native pixel grid.
- Human-sized actors should begin from the Knight's 96 × 96 scale comparison,
  but may use a different frame when the physical silhouette requires it.
- Large creatures, flying wings, and bosses may require wider or taller frames.
- Do not obtain a production native sprite by blindly shrinking concept art.
- Validate outline, anatomy, clusters, baseline, pivot, and collision silhouette
  at 1× before using it in Godot.
- Production backgrounds should be transparent.

### D. Animation sheet

Filename:

`<slug>-<state>-v<NN>-sheet.png`

Examples:

- `crimson-knight-idle-v01-sheet.png`
- `roof-hunter-manananggal-fly-v01-sheet.png`
- `roadside-white-lady-idle-v01-sheet.png`

Rules:

- Use equal-sized native frames in a horizontal strip unless the game project
  establishes another convention.
- Keep the ground baseline or flying pivot stable.
- Record frame size, frame count, pivot, and loop duration beside the asset.
- Use nearest-neighbor scaling for previews.

## 5. Canvas, background, and framing

### Source composition

- Square 1:1 canvas.
- Exactly one primary enemy unless the concept explicitly requires a coordinated
  group, such as the Empty Procession or Santelmo Choir.
- Complete silhouette visible.
- Generous padding around weapons, wings, cloth, hair, tails, and feet.
- Most humanoid concepts should occupy roughly 70–80 percent of canvas height.
- Wide flying creatures may prioritize width while retaining safe padding.
- No cropped hands, feet, wings, weapon tips, or trailing cloth.
- No text, UI, border, logo, watermark, or decorative frame.

### Background

For every future isolated enemy concept and opaque preview, use a perfectly
uniform warm-charcoal background of exactly `#171311`. Older enemy prompts that
use `#120F0E`, `#1A1513`, or an unspecified warm near-black are historical
records and do not control future generations.

Non-negotiable:

- Never use a green background.
- No alternate near-black, tint, texture, glow field, or atmospheric variation.
- No bright chroma-key-looking field unless the user specifically requests
  transparent extraction.
- No scenery, floor plane, cast shadow, gradient vignette, or environment unless
  the request is explicitly for a scene rather than a sprite concept.

## 6. Pixel construction

- Hard square pixels.
- Crisp connected clusters.
- Large readable value shapes before texture.
- One-pixel highlights only where they clarify form.
- Limited, intentional color ramps.
- Strong negative space between limbs, props, wings, cloth, and body.
- Selective broken clusters may imply spectral transparency.
- Judge every asset at 256 and at the intended native size.

Avoid:

- Smooth gradients
- Blur
- Anti-aliasing
- Painterly brushwork
- Downscaled concept-painting noise
- Automatic dark outlines around every internal detail
- Excessive dithering
- Isolated texture pixels
- Too many tiny buckles, scratches, seams, rivets, scales, or feathers

The concept source may contain more detail than the future native sprite, but it
must still read as intentional pixel art rather than a filtered illustration.

## 7. Palette system

### Material palette, not a mandatory shared base

The following are available material families, not a recipe to place in every
enemy:

- Charcoal
- Soot black
- Ash grey
- Weathered brown
- Faded cloth
- Dirty bone
- Aged wood, bamboo, brass, or iron
- Corpse-pale or natural muted skin where appropriate

Do not automatically combine charcoal, soot black, ash grey, weathered brown,
dirty bone, blackened iron, and bronze. Dark fantasy does not require a shared
sepia, black-grey, or brown-metal grade.

Keep metal, cloth, leather, wood, skin, bone, shell, and accents on distinct
local color ramps. Never apply a global sepia, tobacco-brown, bronze, copper,
amber, grey-black, uniformly desaturated, or uniformly warm/cool filter.

For waves of two or more comparable enemies, record dominant material,
secondary garment hue, metal finish, leather or wood hue, accent role, and
lighting temperature. Require at least three differences between every pair
and against each of the ten most recent comparable enemies. Small shifts inside
the same black-grey-brown family do not count.

The combined blackened-steel, soot/charcoal-cloth, dark-brown wood/leather,
dirty-ivory, tiny bronze/copper, and warm-rim-lighting look is fatigue-locked
until the user explicitly requests it again.

Typical color count:

- Quiet humanoid or ghost: 14–18 colors
- Combat or blood enemy: 16–22 colors
- Hard maximum is flexible only for bosses or complex coordinated physical
  designs

### Accent coverage

Color accents must make gameplay readable without swallowing the base design.

- Blood-centered enemy: 15–22 percent
- Do not make the entire sprite one bright neon color.
- Do not let every enemy become a muted brown-grey silhouette.

### Material accent families

These are physical material and palette cues, not permission to render emitted
or floating effects.

| Accent | Preferred colors | Use |
| --- | --- | --- |
| Blood | Burgundy, deep crimson, vivid scarlet | Wounds, rites, and material accents |
| Fire | Ember orange, copper, gold | Scorched materials and brands; no emitted flame |
| Acid | Ochre, sickly yellow, yellow-chartreuse | Corroded materials; no pools or smoke |
| Moon | Indigo, silver, pale ice blue | Salt and celestial material accents |
| Curse | Bruised violet, muted plum | Physical binding and possession cues |
| Water ghost | Slate blue, pale cyan, spectral white | Wet cloth and water-worn materials |
| White Lady | Pearl white, ivory, silver grey, cold blue | Dress and cold material accents |
| Green Host only | Deep emerald through mint | Oath-bound ghosts and physical equipment |

### Green rule

Green is not the default ghost color.

- White Ladies use white, silver, grey, and faint icy cyan.
- Water and domestic ghosts use pale cyan, blue-grey, and white.
- Emerald is reserved for the specifically approved Green Host direction.
- Even Green Host sprites remain on a warm near-black background.

## 8. Silhouette and anatomy

Silhouette comes before internal detail.

### Humanoids

Unless folklore intentionally changes anatomy:

- One head
- Two arms
- Two hands
- Two legs
- Two feet
- Natural attachment points
- Clear hand and foot separation
- No accidental fused bodies or duplicated faces

### Animals and monsters

- State the exact limb, wing, head, tail, or horn count in the prompt.
- Distinguish back-mounted wings from arm-wings.
- Intentional reversed feet, separated torsos, or transformed anatomy must be
  named explicitly.
- Coherent anatomy is required even when the pose is unnatural.

### Automatic rejection issues

- Extra arms, hands, fingers, legs, feet, wings, heads, or faces
- Missing required limb or wing
- Missing fingers or a malformed thumb on a visible hand
- Accidental body fusion
- Props growing out of hands
- Clothing merging with anatomy
- Unreadable silhouette
- Global sepia, brown, bronze, grey-black, desaturated, or uniformly warm/cool
  grading that makes separate materials share one filter
- Soft vignette, edge falloff, warm halo, or any variation in the canonical
  `#171311` background
- Fatigue-locked blackened-steel, soot-cloth, dark-brown, tiny-bronze,
  warm-rim palette bundle
- Oversized head without a concept reason
- Female anatomy that is masculine, excessively muscular, sexualized,
  childlike, or stretched into a nine-head fashion figure
- Female character that does not read as an attractive, unmistakably adult
  young woman approximately 21–35 in apparent age
- Teenager, schoolgirl, childlike, or age-ambiguous facial, anatomical,
  clothing, or posture cues
- Standardized glamour-filter face or a generic “pretty face” reused across the
  batch
- Female face that reads as deliberately masculine or heavily androgynous due
  to a combined pronounced brow ridge, very broad square jaw, oversized blocky
  chin, heavy low brows, coarse angular planes, or thick masculine neck
- Oversized breasts, extreme hourglass anatomy, pinched waist, exaggerated hips
  or buttocks, or a chest-forward pin-up pose
- Cleavage emphasis, molded breast-cup armor, vacuum-sealed garments, or
  fetishized camera framing
- Female face duplicated from another concept, even when hair, clothing,
  makeup, scars, or palette differ
- Female batch differentiated only through hairstyle
- Fancy, salon-styled, excessively voluminous, or unsecured female hair in the
  war-torn setting
- Hair obscuring the eyes, armor articulation, weapon hand, shield grip, or
  crossbow rail, string, trigger, or stock
- Long loose combat hair, elaborate braided crown, decorative braid network,
  towering or sculpted bun, cascading salon curls, ornate hair jewelry,
  flowers, ribbons, excessive pins, ceremonial hair architecture, or dramatic
  windblown volume
- Buzz cut, shaved-side undercut, mohawk, fauxhawk, high-and-tight cut, graphic
  shaved pattern, neon/multicolor fantasy dye, or conflicting contemporary
  statement hairstyle
- Romantic, couple, courtship, or sexual signaling added to an isolated
  character brief
- Tiny or hidden gameplay-defining weapon
- Weapon, shield, or tool generated without a recorded authoritative full
  profile and handle/construction reference
- Handle, hilt, socket, trigger, or shield-back construction guessed from
  memory or invented from an exterior-only view
- Every hand contact or the only head/blade-to-handle join hidden from review
- Bent or crooked blade, haft, shaft, or handle
- Weapon rendered shorter than its real combat length
- Weapon length not measured against a realistic example and converted to the
  handler's depicted height
- Misaligned blade, guard, grip, pommel, head, socket, shaft, or butt
- Bent or kinked wooden stick, staff, tool handle, or pole
- A hand gripping the blade instead of the handle
- A two-handed weapon held with one hand in a ready pose
- Oversized sword with either hand touching the blade, forte, or ricasso;
  crossing the guard; using a half-sword or mordhau pose; or failing to fit both
  hands entirely on the grip between guard and pommel
- A blade resting on the character's shoulder
- Front-face, outer-rim, disconnected, or anatomically misaligned shield handle
- Bow, arrow, quiver, or loose or floating ammunition
- Crossbow with an unsupported stock, malformed firing-hand grip, misplaced
  trigger finger, or fingers intersecting the rail, string path, or mechanism
- Any visible spell or spell-like effect, including floating magic, auras,
  droplets, sigils, runes, orbs, magical projectiles, elemental emissions,
  summoned geometry, smoke wisps, or ambient particles
- Equipment the character could not physically use as depicted
  (e.g. a blindfolded crossbow aimer)
- Cropped effects or body parts
- Enemy accidentally resembling the Crimson Knight

The weapon and no-spell rules above were codified from the 2026-07-30 bulk
review of 996 renders and the user's subsequent 10/10 failure clarification;
see `art-catalog/REVIEW-LEARNINGS.md` for the evidence and full prompt-writing
checklist.

## 9. Enemy identity separation

Enemies should not inherit all protagonist signals.

Avoid using these together on a normal enemy:

- Full dark plate armor
- Long crimson cape
- Long one-handed sword
- Tall vigilant knight stance
- Compact closed sallet or armet

If an enemy uses one protagonist-adjacent feature, counterbalance it with a
different body plan, posture, prop, palette, or supernatural effect.

## 10. Horror, blood, and gore

Default horror should come from:

- Ritual objects
- Masks and veils
- Unnatural posture
- Deceptive sound
- Possession
- Strange movement
- Mourning, repetition, and unfinished duties
- Supernatural cloth, shadow, smoke, roots, rain, or fire

For normal batches:

- Avoid exposed organs, flayed skin, wounds, and graphic body horror.
- Keep the mood eerie rather than nauseating.

When blood is explicitly requested or culturally central, as with the approved
Manananggal batch:

- Make crimson visually meaningful rather than muddy.
- Prefer stylized drops, clean trails, simple ribbons, wing veins, and controlled
  red OSL.
- Use roughly 15–22 percent red coverage.
- Avoid photorealistic tissue, detailed organs, entrail piles, victims, or
  pregnancy imagery unless the user explicitly asks for a more graphic treatment.

## 11. Culturally and historically specific source handling

- Apply this section only when the current brief or active collection names a
  real culture, tradition, historical period, or folkloric being.
- Research the named being, culture, equipment, clothing, or period before
  finalizing prompts.
- Prefer academic, cultural-institution, government, museum, or documented oral
  tradition sources where available.
- Treat different regional accounts as variations, not errors.
- State that designs are original game interpretations rather than definitive
  cultural portrayals.
- Use locally relevant materials, clothing, architecture, tools, and
  environmental cues only when they genuinely serve that specifically selected
  concept.
- For Philippine-specific work, this may include abaca, bamboo, nipa, balete,
  river roads, rice fields, or rural work clothes; none is a default for other
  work.
- Do not turn respected living traditions, spiritual roles, or cultural
  identities into default villains.
- Do not overwrite a named tradition with unrelated generic fantasy styling,
  and do not force that tradition's motifs onto unrelated creatures.
- Never depict real cultural groups as monstrous.

## 12. Prompt structure

Generate each design with its own prompt and its own image-generation call.

Use this compact structure:

```text
Use case: stylized-concept
Asset type: production-ready enemy concept for a 2D gothic Metroidvania
Primary request: <one named enemy and its gameplay role>
Scene/backdrop: perfectly uniform warm charcoal #171311, no scenery
Subject: <body plan, exact anatomy, clothing, prop, pose, direction>
Style/medium: deliberate crisp pixel art, connected clusters, restrained detail
Composition/framing: one full creature, centered, generous padding, readable at 256
Color palette: <base colors, accent family, approximate accent coverage>
Lighting/mood: <emotion and controlled OSL>
Constraints: <counts, invariants, required silhouette>
Avoid: <artifacts, accidental anatomy, copying, forbidden colors and content>
```

Prompt requirements:

- Complete `render-contracts/EQUIPMENT-RESEARCH.md` before prompting any weapon,
  shield, or weapon-like tool.
- Record authoritative full-profile and handle/construction sources outside the
  image prompt. If the hidden construction cannot be verified, change weapons.
- Spell out exact counts for physical elements: wings, arms, lanterns, weapons,
  and roots.
- Name the exact weapon, state that it is straight and full combat length, and
  record its realistic total length, component proportions, and
  handler-relative scale. State which hand or hands grip the handle (both for
  two-handed weapons).
- For a longsword, greatsword, zweihänder, or other oversized sword, record the
  usable grip length and require both complete hands to fit on the grip between
  guard and pommel. Exclude half-swording, ricasso/forte contact, mordhau, blade
  contact, and any hand crossing the guard.
- Require continuous straight centerlines and aligned blade–guard–grip or
  head–socket–shaft construction.
- Exclude bows, arrows, quivers, and loose or floating ammunition. For a
  crossbow, specify support-hand placement, firing-hand grip, trigger-finger
  placement, and string clearance.
- State why the weapon is physically and culturally appropriate to its handler.
- For adult female characters, specify approximately 7.5–8 heads of height,
  long plausible legs, a balanced ribcage and pelvis, natural shoulders, a
  moderately defined waist, hips only modestly wider than the shoulders, and a
  naturally proportionate chest with no sexualized emphasis.
- Specify an attractive, unmistakably adult young-woman appearance,
  approximately 21–35 in apparent age. Build attractiveness through coherent,
  individually varied features and readable eyes, not sexualization, glossy
  glamour styling, or a repeated beauty-filter face. Exclude teenager,
  schoolgirl, childlike, and age-ambiguous cues.
- Require a distinctly feminine overall face. Avoid a strongly masculine-coded
  combination of brow ridge, broad square jaw, blocky chin, heavy low brows,
  coarse angular planes, and thick neck. Preserve varied brief-appropriate
  facial structures rather than imposing one ethnicity or one doll-like face.
- For every female character, specify face shape, jaw and chin, eyes and brows,
  nose, mouth, cheek structure, age cues, hairline, resting expression, and a
  setting-compatible hairstyle. In a wave, require at least four structural
  facial differences between every pair, excluding hairstyle and surface
  decoration.
- Specify simple, low-maintenance, battle-ready hair suited to a war-torn era.
  Keep it secured and clear of vision, armor, hands, shield grips, and weapon
  mechanisms. Do not use ornate accessories, elaborate braid architecture,
  towering buns, salon curls, ceremonial styling, long loose combat hair, or
  dramatic windblown volume.
- State that no visible spells or spell-like effects appear. This prohibition
  has no caster or magical-subject exception.
- Name the facing direction and flow direction of hair, cloth, or cape.
- Name the gameplay-defining prop and ensure it remains fully visible.
- Use one accent family deliberately.
- Keep metal, cloth, leather, wood, skin, and accents on separate local color
  ramps; prohibit any global sepia, brown, bronze, grey-black, desaturated, or
  uniformly warm/cool filter.
- For a comparable wave, complete the six-axis palette matrix and require at
  least three differences between every pair and against the ten most recent
  comparable renders.
- Do not use the fatigue-locked blackened-steel, soot-cloth, dark-brown,
  dirty-ivory, tiny-bronze, warm-rim bundle as the default gothic palette.
- Repeat critical anatomy constraints at the end.
- Do not ask one generation to produce five separate assets.

## 13. Folder convention

Root:

Render root (the one home for images):

`pixel-art/public/art/enemies/`

Batch documents root (prompts, manifests, status):

`pixel-art/collections/enemies/`

New numbered batch:

`pixel-art/public/art/enemies/<theme>-batch-<NN>/`

Examples:

- `white-lady-variations-batch-05/`
- `manananggal-variations-batch-06/`
- `tiktik-variations-batch-07/`

Use lowercase kebab-case. Batch numbers are two digits and never reused.

### Required retained-batch contents

```text
public/art/enemies/<theme>-batch-<NN>/
├── 01-<slug>.png
└── ...

collections/enemies/<theme>-batch-<NN>/
├── GENERATION-PROMPTS.md
├── STATUS.md
└── <theme>-manifest.json
```

The render lives once, at full quality, under `public/art/`. Never create
a second copy anywhere — no `-source` pair, no `-reference-256` downscale.
Generated review sheets live under
`art-catalog/review-sheets/enemies/<theme>-batch-<NN>/`.

### Reviewable, unapproved renders

After normal viability checks, save each new full-quality render directly at:

`public/art/enemies/<theme>-batch-<NN>/<NN>-<slug>.png`

Collection-root placement means the render is available in the review website.
It does not mean approved, retained, canonical, production-ready, or counted in
the lore compendium. Do not place new generations in a `drafts/` folder.
Existing legacy `drafts/` paths may remain until separately reviewed or
migrated.

### Revisions

Never silently overwrite a retained image.

Use:

`<NN>-<slug>-v02.png`

beside the original under its `public/art/enemies/` path.

Update the manifest to identify the active version.

## 14. File naming convention

Use descriptive lowercase kebab-case.

### Per asset

- Render (in `public/art/`): `<NN>-<slug>.png`
- `<NN>-<slug>-native-<width>x<height>.png`

### Batch support

- One `GENERATION-PROMPTS.md` while the batch has retained or active draft
  renders; append later waves and revisions to this file
- `<theme>-manifest.json`
- `STATUS.md` when a batch is incomplete or has special continuation notes
- Review sheets under
  `art-catalog/review-sheets/enemies/<theme>-batch-<NN>/`

Do not keep standalone continuation, retry, revision, or rejected prompt files.
Remove the prompt record when the batch has no retained or active draft renders;
Git history remains the archive.

Avoid filenames such as:

- `Generated image 1.png`
- `final-final.png`
- `monster-new.png`
- Random call IDs
- Names containing spaces

## 15. Review-sheet convention

The review sheet is assembled from 256 × 256 nearest-neighbor panels made
on the fly from the renders; those panels are never saved individually.

- One horizontal row by default.
- Height: exactly 256 pixels.
- Width: `asset count × 256`.
- Five assets produce a 1280 × 256 review sheet.
- Use the same warm near-black backing.
- Preserve asset order from the manifest.
- Do not stretch panels.
- Do not add labels over the artwork unless explicitly requested.

Review sheets are for comparison only and never replace the individual
full-quality catalog renders.

## 16. Manifest convention

Every completed batch requires a JSON manifest.
All file paths stored in a manifest are relative to the repository root.

Minimum structure:

```json
{
  "batch": "theme-batch-07",
  "status": "retained",
  "palette": {
    "base": ["charcoal", "weathered brown"],
    "accent": ["crimson"],
    "background": "#171311",
    "forbidden": ["green background"]
  },
  "assets": [
    {
      "id": 1,
      "name": "Readable Display Name",
      "status": "retained",
      "render": "public/art/enemies/theme-batch-07/01-readable-display-name.png"
    }
  ],
  "review_sheet": "art-catalog/review-sheets/enemies/theme-batch-07/theme-review-sheet.png"
}
```

Allowed asset statuses:

- `draft`
- `retained`
- `rejected`

Only `retained` assets belong in canonical counts.

## 17. Lore convention

After a batch is retained, update:

`pixel-art/collections/enemies/ENEMY-LORE-COMPENDIUM.md`

For each design add:

1. A concise origin or unresolved duty.
2. A gameplay or encounter hook.
3. Its faction or regional relationship.

Then update:

- Canonical retained count
- Batch count
- Palette/faction table when relevant
- Suggested progression when the new faction changes the campaign structure

Do not create lore for rejected images. Draft lore may live in a batch
`STATUS.md`, but it is not canon.

## 18. Retention and deletion

- Preserve each retained full-quality render once under its matching
  `public/art/` collection.
- Inspect renders at 256 pixels without keeping permanent per-render downscales.
- Rejected images should not remain in canonical batch folders.
- If the user asks to delete a generation, remove its project files and remove it
  from manifests, review sheets, lore, and counts.
- Images already displayed in a conversation may remain visible in that chat
  history even after their local files are removed; never claim that deleting a
  workspace file erases the chat display.

## 19. Quality checklist

An asset can be retained only when all applicable checks pass.

### Subject

- [ ] Correct named creature or role
- [ ] Complete silhouette
- [ ] Required props and effects present
- [ ] No accidental protagonist resemblance

### Anatomy

- [ ] Exact required limb, hand, foot, wing, head, and tail count
- [ ] Five fingers and a correct thumb on every visible hand
- [ ] No duplicated or missing anatomy
- [ ] Plausible feet and leg placement
- [ ] Adult human proportions; feminine build preserved on female concepts
- [ ] Adult woman is approximately 7.5–8 heads high, not a nine-head fashion
      figure
- [ ] Female character is visibly attractive and unmistakably adult, normally
      approximately 21–35 in apparent age
- [ ] No teenager, schoolgirl, childlike, or age-ambiguous facial, anatomical,
      clothing, posture, or head-to-body cues
- [ ] Attractiveness comes from coherent individually varied features, not
      sexualization, glossy glamour, or a repeated beauty-filter face
- [ ] Female face reads as distinctly feminine, without a strongly
      masculine-coded combination of brow, jaw, chin, facial planes, and neck
- [ ] Feminine facial variety preserves brief-appropriate features rather than
      imposing one ethnicity or repeating one doll-like face
- [ ] Female legs are long but plausible; ribcage and pelvis are balanced
- [ ] Female waist is moderately defined and hips are only modestly wider than
      shoulders
- [ ] Female chest is naturally proportionate with no oversized breasts
- [ ] No extreme hourglass, pin-up posture, cleavage emphasis, molded
      breast-cup armor, vacuum-sealed garment, or fetishized framing
- [ ] Female face differs structurally from every other woman in the wave on at
      least four axes, excluding hair and surface decoration
- [ ] Female hairstyle is setting-compatible and not the only identity change
- [ ] Female hairstyle is simple, secured, low-maintenance, and battle ready
- [ ] Hair remains clear of the eyes, armor, weapon hands, shield grips, and
      weapon mechanisms
- [ ] No long loose combat hair, elaborate braid architecture, towering bun,
      salon curls, ornate accessories, ceremonial styling, or dramatic
      windblown volume
- [ ] Short hair, when used, retains a clearly feminine contour
- [ ] No buzz cut, shaved-side undercut, mohawk, fauxhawk, high-and-tight cut,
      graphic shaved pattern, neon/multicolor fantasy dye, or conflicting
      contemporary statement hairstyle
- [ ] No inferred sexual orientation or romantic/relationship signaling unless
      explicitly required by a narrative brief
- [ ] Intentional folkloric anatomy remains coherent
- [ ] Hands, feet, wings, and props are separated visually

### Weapon and equipment

- [ ] `EQUIPMENT-RESEARCH.md` completed before prompt assembly
- [ ] Authoritative measured object record and source links are recorded
- [ ] Full-profile and handle/socket/trigger/shield-back views are usable
- [ ] No handle or hidden construction was guessed
- [ ] Exact weapon type and realistic total length are recorded
- [ ] Handler-relative scale matches the real weapon-to-handler ratio
- [ ] Weapon reads at measured full combat length at 256
- [ ] Straight blade, haft, shaft, stick, and handle centerlines are unbroken
- [ ] Blade–guard–grip and head–socket–shaft components align mechanically
- [ ] Hands grip the handle only; no hand on the blade
- [ ] Oversized sword shows the guard, both complete hands fully on the grip,
      the full usable grip, and the pommel in one inspectable crop
- [ ] No oversized-sword hand touches the blade, forte, or ricasso; crosses the
      guard; or uses half-swording or mordhau
- [ ] Handle length, cross-section, hand count, contact points, thumb side,
      finger closure, and wrist direction match the researched subtype
- [ ] Hand contacts and blade/head-to-handle joins remain visible for review
- [ ] Both hands on a two-handed weapon in ready poses
- [ ] No blade resting on a shoulder
- [ ] Shield handle or strap is interior, load-bearing, and aligned with hand,
      wrist, and forearm
- [ ] No bows, arrows, quivers, or loose or floating ammunition
- [ ] Crossbow mechanism matches the researched period and subtype
- [ ] Ready crossbow trigger finger is indexed straight along the stock; only a
      firing pose places it on the trigger
- [ ] Crossbow support hand, firing hand, and string clearance are mechanically
      correct
- [ ] Conventional recognizable weapon design (no gimmick objects as weapons)
- [ ] No visible spells or spell-like effects, including auras, droplets,
      sigils, runes, orbs, magical projectiles, elemental emissions, smoke
      wisps, or particles
- [ ] Weapon suits the handler's anatomy, size, strength, hands, vision, role,
      culture, clothing, armor, stance, and implied attack

### Composition

- [ ] One intended subject
- [ ] Generous safe padding
- [ ] No crop
- [ ] Correct facing and flow direction
- [ ] Readable at 256

### Pixel treatment

- [ ] Crisp hard pixels
- [ ] Connected clusters
- [ ] Restrained detail
- [ ] No blur, smoothing, gradients, or painterly noise

### Palette

- [ ] Perfectly uniform `#171311` background
- [ ] No green background
- [ ] No vignette, edge falloff, warm halo, or background tint
- [ ] No global sepia, brown, bronze, grey-black, desaturated, or uniformly
      warm/cool grade
- [ ] Metal, cloth, leather, wood, skin, and accents retain distinct local
      color ramps
- [ ] Palette matrix differs on at least three axes from the current wave and
      ten most recent comparable enemies
- [ ] Fatigue-locked blackened/soot/brown/bronze/warm-rim bundle not repeated
- [ ] Accent color is controlled but visible
- [ ] Enemy is not too muted or entirely neon
- [ ] Color family matches its gameplay effect

### Files

- [ ] Full-quality render saved once under `public/art/`
- [ ] No `-source` or `-reference-256` duplicate created
- [ ] Render inspected at 256 × 256
- [ ] Prompt record saved
- [ ] Manifest valid
- [ ] Review sheet correct
- [ ] Lore updated only after approval

## 20. Definition of done

A batch is complete when:

1. Every requested variation has its own full-quality catalog render.
2. Every retained render has been verified at 256 × 256.
3. The review sheet presents all retained assets in manifest order.
4. Anatomy, palette, silhouette, and crop checks pass.
5. `GENERATION-PROMPTS.md` records the shared direction and subjects.
6. The JSON manifest parses successfully.
7. The lore compendium includes the retained designs and updated counts.
8. No rejected or incomplete assets are represented as canon.

## 21. Batch registry

| Number | Collection | Location | Status |
| --- | --- | --- | --- |
| 01 | Restrained Gothic Enemies | `collections/enemies/` root | Retained |
| 02 | Cultists and Demons | `collections/enemies/cultists-demons-batch-02/` | Retained |
| 03 | Philippine Folklore | `collections/enemies/philippine-folklore-batch-03/` | Retained |
| 04 | Combat and Magic | `collections/enemies/combat-magic-batch-04/` | Retained |
| — | Green Ghost Palette Test | `collections/enemies/green-ghost-palette-test/` | Retained test |
| 05 | White Lady Variations | `collections/enemies/white-lady-variations-batch-05/` | Retained |
| 06 | Manananggal Variations | `collections/enemies/manananggal-variations-batch-06/` | Retained |
| 07 | Tiktik Variations | `collections/enemies/tiktik-variations-batch-07/` | Draft, 2 of 5 |

The next new batch after completing Tiktik is batch `08`.

## 22. Current Tiktik continuation

The Tiktik batch was interrupted after two draft generations.

Saved drafts:

1. Alimokon Omen
2. Roof-Clinger Tiktik

The intended remaining roles are:

3. Needle-Tongue Tiktik
4. Storm-Call Tiktik
5. Aswang-Guide Tiktik

Direction:

- Treat Tiktik primarily as an ominous bird-call or aswang companion.
- Keep the body bird-like rather than another winged humanoid.
- Build gameplay around deceptive clicking sound, proximity confusion, roof
  ambushes, storm warnings, and familiar behavior.
- Give each variant a distinct accent family.
- Use only controlled crimson stains unless the user explicitly asks for more
  blood.
- Avoid victims and pregnancy imagery.

Read `collections/enemies/tiktik-variations-batch-07/STATUS.md` before resuming.
