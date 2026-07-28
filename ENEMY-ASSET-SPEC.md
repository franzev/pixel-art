# Enemy Pixel-Art Asset Specification

**Status:** Canonical production baseline  
**Version:** 1.0  
**Last updated:** 2026-07-28  
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
4. Read only the relevant sections of `enemies/ENEMY-LORE-COMPENDIUM.md`.
5. Inspect one or two approved references from the closest existing batch.
6. Confirm the next batch number from the registry in this document.
7. Generate one separate image per distinct design.
8. Save the full source and mandatory 256 × 256 reference.
9. Inspect the 256 references together on a review sheet.
10. Mark assets retained only after the batch passes the quality checklist.

## 3. Core art direction

Create original dark-fantasy pixel-art characters for a side-scrolling gothic
Metroidvania. The mood combines ruined sacred spaces, weathered rural life,
Philippine folklore, restrained supernatural color, and readable in-game
silhouettes.

The desired result is:

- Dark, strange, melancholy, and threatening
- Weird without becoming visually incoherent
- Detailed enough to feel premium but simplified enough to animate
- Readable at small size
- Clearly distinct from the Crimson Knight
- Inspired by the density and discipline of high-quality Metroidvania sprites
  without reproducing an existing game's character, costume, or composition

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

`/Users/franz/Desktop/knight.png` and the `pixel-art/samples/silver-knight-*`
assets define the protagonist, not the enemy library.

Approved enemy batches are the best style references for new enemies. Choose the
closest thematic batch rather than using every previous image at once.

## 4. Image roles and sizes

Every file role must remain explicit.

### A. Generated source

Filename:

`<NN>-<descriptive-slug>-source.png`

Rules:

- Preserve the full square image returned by the image-generation workflow.
- Do not overwrite, crop, stretch, or upscale it.
- The exact source dimensions may vary.
- The source is the concept master, not necessarily a production sprite.

### B. Mandatory 256 reference

Filename:

`<NN>-<descriptive-slug>-reference-256.png`

Rules:

- Exactly 256 × 256 pixels.
- Created from the source with nearest-neighbor resizing.
- Always saved beside every retained source.
- Used for comparisons, review sheets, documentation, and future prompting.
- Never use smoothing, bicubic resampling, blur, or sharpening.
- This is a reference image, not automatically the native Godot sprite.

### C. Native game sprite

Filename:

`<NN>-<descriptive-slug>-native-<width>x<height>.png`

or, when a project-wide native size is already established:

`<NN>-<descriptive-slug>-native.png`

Rules:

- Created deliberately at the chosen native pixel grid.
- Human-sized actors should begin from the Knight's 96 × 96 scale comparison,
  but may use a different frame when silhouette or effects require it.
- Large creatures, flying wings, spell trails, and bosses may require wider or
  taller frames.
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
- Generous padding around weapons, wings, cloth, hair, tails, magic, and feet.
- Most humanoid concepts should occupy roughly 70–80 percent of canvas height.
- Wide flying creatures may prioritize width while retaining safe padding.
- No cropped hands, feet, wings, weapon tips, or trailing cloth.
- No text, UI, border, logo, watermark, or decorative frame.

### Background

Use a plain warm near-black background.

Preferred starting range:

- `#120F0E`
- `#171311`
- `#1A1513`

Non-negotiable:

- Never use a green background.
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

### Shared base

Use a restrained foundation:

- Charcoal
- Soot black
- Ash grey
- Weathered brown
- Faded cloth
- Dirty bone
- Aged wood, bamboo, brass, or iron
- Corpse-pale or natural muted skin where appropriate

Typical color count:

- Quiet humanoid or ghost: 14–18 colors
- Combat, magic, or blood enemy: 16–22 colors
- Hard maximum is flexible only for bosses or complex coordinated effects

### Accent coverage

Color accents must make gameplay readable without swallowing the base design.

- Minor magical cue: 5–10 percent
- Standard combat magic: 10–20 percent
- Blood-centered enemy: 15–22 percent
- Do not make the entire sprite one bright neon color.
- Do not let every enemy become a muted brown-grey silhouette.

### Effect families

| Effect | Preferred colors | Use |
| --- | --- | --- |
| Blood | Burgundy, deep crimson, vivid scarlet | Wounds, rites, projectiles, OSL |
| Fire | Ember orange, copper, gold | Flames, brands, hoofprints |
| Acid | Ochre, sickly yellow, yellow-chartreuse | Pools, smoke, corrosion |
| Moon | Indigo, silver, pale ice blue | Barriers, salt, celestial attacks |
| Curse | Bruised violet, muted plum | Binding, possession, traps |
| Water ghost | Slate blue, pale cyan, spectral white | Rain, nets, puddles |
| White Lady | Pearl white, ivory, silver grey, cold blue | Dress, mist, mirror light |
| Green Host only | Deep emerald through mint | Oath-bound ghosts and spectral weapons |
| Insect magic | Amber, violet | Beetles, sealed vessels, swarm cues |

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
- Accidental body fusion
- Props growing out of hands
- Clothing merging with anatomy
- Unreadable silhouette
- Oversized head without a concept reason
- Tiny or hidden gameplay-defining weapon
- Cropped effects or body parts
- Enemy accidentally resembling the Crimson Knight

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

## 11. Philippine folklore handling

- Research the named being before finalizing prompts.
- Prefer academic, cultural-institution, government, museum, or documented oral
  tradition sources where available.
- Treat different regional accounts as variations, not errors.
- State that designs are original game interpretations rather than definitive
  cultural portrayals.
- Use locally relevant material cues—abaca, bamboo, nipa, balete, river roads,
  rice fields, rural work clothes—only when they genuinely serve the concept.
- Do not turn respected living traditions or roles such as babaylan, albularyo,
  or diwata into default villains.
- Do not add Western cathedral clothing, European armor, or generic vampire
  styling to every Philippine creature.
- Never depict real cultural groups as monstrous.

## 12. Prompt structure

Generate each design with its own prompt and its own image-generation call.

Use this compact structure:

```text
Use case: stylized-concept
Asset type: production-ready enemy concept for a 2D gothic Metroidvania
Primary request: <one named enemy and its gameplay role>
Scene/backdrop: uniform warm near-black, no scenery
Subject: <body plan, exact anatomy, clothing, prop, pose, direction, effects>
Style/medium: deliberate crisp pixel art, connected clusters, restrained detail
Composition/framing: one full creature, centered, generous padding, readable at 256
Color palette: <base colors, accent family, approximate accent coverage>
Lighting/mood: <emotion and controlled OSL>
Constraints: <counts, invariants, required silhouette>
Avoid: <artifacts, accidental anatomy, copying, forbidden colors and content>
```

Prompt requirements:

- Spell out exact counts: wings, arms, flames, lanterns, weapons, roots, orbs.
- Name the facing direction and flow direction of hair, cloth, smoke, or cape.
- Name the gameplay-defining prop and ensure it remains fully visible.
- Use one accent family deliberately.
- Repeat critical anatomy constraints at the end.
- Do not ask one generation to produce five separate assets.

## 13. Folder convention

Root:

`pixel-art/enemies/`

New numbered batch:

`pixel-art/enemies/<theme>-batch-<NN>/`

Examples:

- `white-lady-variations-batch-05/`
- `manananggal-variations-batch-06/`
- `tiktik-variations-batch-07/`

Use lowercase kebab-case. Batch numbers are two digits and never reused.

### Required retained-batch contents

```text
<theme>-batch-<NN>/
├── 01-<slug>-source.png
├── 01-<slug>-reference-256.png
├── ...
├── GENERATION-PROMPTS.md
├── <theme>-manifest.json
└── <theme>-review-sheet.png
```

### Drafts

Unapproved or incomplete work goes in:

`<theme>-batch-<NN>/drafts/`

Drafts:

- Are not canonical
- Are not counted in the lore compendium
- May have source and 256 reference files for continuity
- Must be promoted to the batch root only after approval

### Revisions

Never silently overwrite a retained image.

Use:

`<NN>-<slug>-v02-source.png`

and:

`<NN>-<slug>-v02-reference-256.png`

Update the manifest to identify the active version.

## 14. File naming convention

Use descriptive lowercase kebab-case.

### Per asset

- `<NN>-<slug>-source.png`
- `<NN>-<slug>-reference-256.png`
- `<NN>-<slug>-native-<width>x<height>.png`

### Batch support

- `GENERATION-PROMPTS.md`
- `<theme>-manifest.json`
- `<theme>-review-sheet.png`
- `STATUS.md` when a batch is incomplete or has special continuation notes

Avoid filenames such as:

- `Generated image 1.png`
- `final-final.png`
- `monster-new.png`
- Random call IDs
- Names containing spaces

## 15. Review-sheet convention

The review sheet is assembled from the 256 references, not the full sources.

- One horizontal row by default.
- Height: exactly 256 pixels.
- Width: `asset count × 256`.
- Five assets produce a 1280 × 256 review sheet.
- Use the same warm near-black backing.
- Preserve asset order from the manifest.
- Do not stretch panels.
- Do not add labels over the artwork unless explicitly requested.

Review sheets are for comparison only and do not replace individual references.

## 16. Manifest convention

Every completed batch requires a JSON manifest.

Minimum structure:

```json
{
  "batch": "theme-batch-07",
  "status": "retained",
  "palette": {
    "base": ["charcoal", "weathered brown"],
    "accent": ["crimson"],
    "background": "warm near-black",
    "forbidden": ["green background"]
  },
  "assets": [
    {
      "id": 1,
      "name": "Readable Display Name",
      "status": "retained",
      "source": "01-readable-display-name-source.png",
      "reference_256": "01-readable-display-name-reference-256.png"
    }
  ],
  "review_sheet": "theme-review-sheet.png"
}
```

Allowed asset statuses:

- `draft`
- `retained`
- `rejected`

Only `retained` assets belong in canonical counts.

## 17. Lore convention

After a batch is retained, update:

`pixel-art/enemies/ENEMY-LORE-COMPENDIUM.md`

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

- Preserve all retained full sources and 256 references.
- Do not delete an approved source after making a smaller reference.
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
- [ ] No duplicated or missing anatomy
- [ ] Intentional folkloric anatomy remains coherent
- [ ] Hands, feet, wings, and props are separated visually

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

- [ ] Warm near-black background
- [ ] No green background
- [ ] Accent color is controlled but visible
- [ ] Enemy is not too muted or entirely neon
- [ ] Color family matches its gameplay effect

### Files

- [ ] Full source saved
- [ ] 256 × 256 nearest-neighbor reference saved
- [ ] Prompt record saved
- [ ] Manifest valid
- [ ] Review sheet correct
- [ ] Lore updated only after approval

## 20. Definition of done

A batch is complete when:

1. Every requested variation has its own full source.
2. Every retained source has a verified 256 × 256 reference.
3. The review sheet presents all retained assets in manifest order.
4. Anatomy, palette, silhouette, and crop checks pass.
5. `GENERATION-PROMPTS.md` records the shared direction and subjects.
6. The JSON manifest parses successfully.
7. The lore compendium includes the retained designs and updated counts.
8. No rejected or incomplete assets are represented as canon.

## 21. Batch registry

| Number | Collection | Location | Status |
| --- | --- | --- | --- |
| 01 | Restrained Gothic Enemies | `enemies/` root | Retained |
| 02 | Cultists and Demons | `enemies/cultists-demons-batch-02/` | Retained |
| 03 | Philippine Folklore | `enemies/philippine-folklore-batch-03/` | Retained |
| 04 | Combat and Magic | `enemies/combat-magic-batch-04/` | Retained |
| — | Green Ghost Palette Test | `enemies/green-ghost-palette-test/` | Retained test |
| 05 | White Lady Variations | `enemies/white-lady-variations-batch-05/` | Retained |
| 06 | Manananggal Variations | `enemies/manananggal-variations-batch-06/` | Retained |
| 07 | Tiktik Variations | `enemies/tiktik-variations-batch-07/` | Draft, 2 of 5 |

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

Read `enemies/tiktik-variations-batch-07/STATUS.md` before resuming.
