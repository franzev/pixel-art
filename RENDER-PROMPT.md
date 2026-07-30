# Ashen Provinces Master Render Contract

Version: 1.1

Last updated: 2026-07-30 (incorporates the 996-render bulk review; see `art-catalog/REVIEW-LEARNINGS.md`)

Status: Active project-wide rendering instructions

## Purpose

This is the default contract for all new renders in this repository.

The user may invoke it with a terse brief such as:

> Use `RENDER-PROMPT.md`: 5 forest knights

Treat that as sufficient instruction. Do not ask the user to repeat their established visual preferences. Infer the category, create distinct concepts, apply the relevant rules below, inspect the results, and keep them as drafts until the user explicitly approves them.

## Instruction Precedence

When instructions conflict, use this order:

1. The user's newest direct instruction.
2. The newest active category or collection specification.
3. This master render contract.
4. Compatible visual traits from a positive reference supplied or named for the current request.
5. Older generation prompts and exploratory drafts.

Rejected work is evidence of what not to repeat. It is never a positive reference.

A newly supplied positive reference controls visual direction only where it is compatible with active locks. If the user explicitly reverses a lock, that direct instruction takes precedence.

Current active specifications include:

- `ASSET-SPEC.md`
- `ENEMY-ASSET-SPEC.md`
- `enemies/ENEMY-ART-DIRECTION-FEEDBACK.md`
- `art-catalog/REVIEW-LEARNINGS.md` — distilled lessons from the confirmed review data; read before every batch
- `art-catalog/RENDER-FEEDBACK.md` and `art-catalog/render-feedback.jsonl` — machine-exported review records (never hand-edit)
- Category and collection `STATUS.md`, `POSITIVE-REFERENCE-NOTES.md`, and `REJECTION-NOTES.md` files

If an older prompt conflicts with a newer specification, follow the newer specification.

## How to Interpret a Terse Brief

Read a short request as:

`[total quantity] [subject or family] [optional modifiers]`

Examples:

- `5 forest knights`
- `3 corrupted river angels`
- `1 bell giant boss`
- `2 flooded market rooms`
- `4 crimson knight helmet orders`
- `1 redemption scene: a soldier protecting civilians`

### Quantity

- If no quantity is given, default to one.
- Generate one distinct asset per image.
- Use one generation call per concept.
- A requested quantity is the total desired count.
- Work in review waves of no more than five.
- Do not generate a large contact sheet as a substitute for separate source images.
- If the user says stop, stop immediately even if the requested total has not been reached.

### Default Category Inference

- `environment`, `room`, `area`, `market`, `garden`, `crossing`, or another location: playable environment plate.
- `scene`, `redemption`, or `anthology`: cinematic narrative illustration.
- `boss`: boss character concept.
- `angel`: angel character concept.
- `Crimson Knight`, `player`, or `protagonist`: player-character or protagonist variant.
- A knight order, armored humanoid, creature, demon, haunt, cultist, soldier, or other encounter subject without a different label: isolated character concept, normally an enemy or NPC family.

When a term remains mildly ambiguous, choose the safest interpretation, state it in one sentence, and proceed. Ask a question only when different interpretations would create materially different deliverables and no safe default exists.

## Required Preflight

Before generating, silently inspect the newest relevant specifications and status notes. Then give the user a compact preflight containing:

- Interpreted asset category.
- Requested quantity and current review-wave size.
- Positive reference or closest accepted direction.
- Traits that will be preserved.
- How the concepts will differ from one another.
- Relevant hard prohibitions.

Keep the preflight short. It is a confirmation of interpretation, not a request for the user to redesign the brief.

## Reference Handling

- Inspect a named positive reference at full size and at 256 pixels before generating.
- When the generation system supports image references, use the actual supplied reference instead of relying only on a text description.
- Explicitly identify it as a visual reference, not an edit target.
- Preserve only the approved high-level qualities.
- Do not copy its exact pose, costume, anatomy, prop placement, spell arrangement, or silhouette.
- Compare the result with the positive reference and the current batch side by side.
- If the user explicitly asks to edit an existing image, treat that image as the edit target instead.

## World and Mood

The project is a Philippine-inflected gothic Metroidvania set in the Ashen Provinces after the Silent Toll opened the Hollow Country.

Horror comes from:

- Grief and mourning.
- Ritual obligation.
- Possession and unfinished duties.
- Religious decay.
- Strange behavior and movement.
- Weathered clothing, armor, tools, and architecture.
- Absence, silence, shadow, smoke, roots, rain, floodwater, and restrained fire.

The world must not be replaced by generic Western cathedral fantasy. Use Philippine roads, rice fields, flooded markets, river crossings, balete, bamboo, nipa, abaca, local devotional objects, and colonial history where relevant.

Keep horror non-graphic unless the user explicitly requests otherwise. Prefer suggestion and consequence over exposed organs, flayed skin, wet gore, or victim tableaux.

## Core Taste

Favor:

- Mature, adult proportions.
- Lean, statuesque, or believable medium builds.
- Strong, readable silhouettes.
- One immediately understandable role.
- One primary prop, equipment set, corruption event, or magical idea.
- At most one secondary magical accent unless the concept requires a counted set.
- Coherent clothing and armor systems.
- Restrained ornament.
- Severe, mournful, occult, weathered, and historically grounded character.
- Black, charcoal, soot, dirty ivory, dull metal, bronze, copper, dirty gold, and controlled family-specific accents.
- Controlled ember-orange light.
- Countable spell geometry, only when a caster with visible magic is explicitly briefed (effects are otherwise default-off; see the Weapon, Grip, and Effect Contract).
- Clear negative spaces between the body, limbs, weapons, wings, cloth, and effects.
- Designs that remain recognizable at 256 pixels and gameplay scale.

The target is restrained but specific. A design should not be plain, but it must not need excessive decoration to establish its identity.

## Universal Isolated-Asset Contract

Unless the request is explicitly an environment or narrative scene:

- Create exactly one character or asset.
- Use a square 1:1 canvas.
- Show the complete silhouette.
- Include generous padding on every side.
- Do not crop the head, halo, horns, wings, hands, feet, weapon, cape, cloth, flame, smoke, or spell effect.
- Use a plain warm near-black background such as `#120f0e`, `#171311`, or `#1a1513`.
- Never use a green background.
- Do not add scenery, rooms, landscapes, decorative frames, typography, floor planes, cast shadows, vignettes, or gradients.
- Keep attachments and overlapping anatomy readable.
- Use coherent human anatomy unless the brief explicitly establishes a different anatomy.
- For a standard humanoid, require one head, two arms, two hands, two legs, and two feet.
- State and verify exact counts for all wings, horns, ears, eyes, weapons, jars, coils, bands, flames, orbiting objects, or other repeated parts.
- Follow the collection's established facing direction. If none exists, choose a readable three-quarter view and keep the batch consistent.

Do not use the Penitent One or another copyrighted character as a design template. Existing references may guide pixel treatment, weight, or atmosphere, but do not copy their helmet, costume, pose, weapon, or silhouette.

## Weapon, Grip, and Effect Contract

These rules come directly from the confirmed review data (`art-catalog/REVIEW-LEARNINGS.md`). Weapon faults and unwanted effects are the two most common rejection causes across 996 reviews.

Weapons:

- Blades, hafts, shafts, and handles must be perfectly straight. A bent or crooked weapon is an automatic rejection.
- Render every weapon at full combat length. A longsword or spear that reads short at 256 pixels is a rejection; do not compress the weapon to fit the frame — adjust the pose or padding instead.
- Hands grip the handle only. Never place a hand on the blade.
- Two-handed weapons (greatswords, spears held ready, polearms in action poses) take both hands on the grip.
- Do not rest a blade on the character's shoulder.
- Thumbs and fingers must wrap the grip correctly, with the wrist and forearm aligned to the handle. Shields need a mechanically plausible interior handle or strap that the hand actually holds.
- Use conventional, immediately recognizable weapons: halberd, longsword, arming sword, greatsword, rapier, sabre, mace, morning star, war pick, flail, bolo, knife, spear, glaive, crossbow, arquebus. Do not arm characters with gimmick objects — fans, books, spindles, serving plates, candelabra — unless the user explicitly requests one. A religious or family motif belongs in the weapon's detailing, not in replacing the weapon.

Effects and props:

- Default to zero floating spell effects, blood droplets, magic threads, sigils, orbiting projectiles, floating ammunition, smoke wisps, and ambient particles. Add visible magic only when the brief explicitly calls for a caster with effects.
- One weapon or one clearly-purposed tool per character. Remove secondary hand props (plates, books, ropes) that clutter the read.
- Do not add decorative skin tattoos or markings unless the family specification requires them.

Coherence:

- The character must be physically able to use their equipment as depicted — no blindfolded crossbow aimers, no grips the hand cannot make.
- Garments must be weathered and specific, never pristine, symmetric-perfect, or cartoony.

## Pixel-Art Treatment

The output must look deliberately pixel-authored:

- Crisp, hard square pixels.
- Connected pixel clusters.
- Broad readable value masses.
- Restrained color ramps.
- Selective highlights.
- Consistent pixel density.
- Clean silhouette edges.

Reject:

- Anti-aliasing.
- Blur or soft focus.
- Smooth painterly gradients.
- Airbrushed rendering.
- A high-detail fantasy painting with a pixel filter.
- Excessive dithering.
- Confetti pixels or noisy microtexture.
- Mixed pixel sizes.
- Unnecessary tiny scratches, leaf specks, brick marks, or fabric noise.
- Extremely chunky, chibi, toy-like, mitten-handed, or oversimplified treatment.

“Pixel art” does not mean maximally blocky. Preserve enough density for mature anatomy, facial planes, hair, cloth, armor joints, and important props.

## Concept Diversity

Every concept in a batch must have a different gameplay and visual identity.

Vary several of these at once:

- Height and body mass within the permitted family.
- Posture and center of gravity.
- Open versus closed silhouette.
- Garment construction and hem shape.
- Armor coverage and plate geometry.
- Tool or weapon function.
- Hand gesture.
- Head, veil, mask, or helmet geometry.
- Binding, wound, burial, or possession logic.
- Spell geometry.
- Negative space.
- Movement implication.
- Encounter role.

Do not create duplicates differentiated only by:

- Color.
- A renamed weapon.
- Horn count.
- Orb count.
- Minor trim.
- A different title.
- Repositioned particles.

Compare each new silhouette with every other concept in the current batch before accepting it as a draft.

Before generating, assign every member of the wave a distinct internal combination of encounter role, posture, silhouette anchor, primary tool or effect, clothing construction, and movement implication. Do not begin with five names and solve the visual differences afterward.

## Enemy and Demon Direction

For new demon concepts, the current project-wide diversity lock is mandatory:

- No animal-bodied demons.
- No animal-headed demons.
- No animal-derived demon concepts.
- No imps, including small hunched bodies, oversized heads, goblin-like faces, or diminutive silhouettes.
- No red-dominant body palette.
- Red, scarlet, oxblood, burgundy, flesh-pink, and mauve must not become the primary body color.
- Prefer full-height adult humanoid or person-like anatomy.
- Prefer cool or neutral body palettes.
- Use posture, clothing, tools, bindings, masks, effects, facial planes, and gestures for variety.

Also avoid:

- Hellhounds and dog demons.
- Bell demons.
- Beetles, bugs, and insect-derived demons.
- Generic bulky brutes.
- Recolored versions of a previously rejected archetype.
- Whimsical unrelated animal, object, or abstract outsiders.
- Excessively repeated veiled women, identical handsome men, or cloned athletic bodies.

### Positive Direction (updated from the 2026-07-30 bulk review)

The Flesh-Veil Oracle is no longer a positive reference: the user rated it 1/5 and marked it for deletion during the bulk review, together with nearly all effect-heavy caster batches. Do not use it or Infernal Demons Batch 13 as a mood anchor.

The confirmed positive direction is armed, martial, religious-gothic humanoids with conventional weapons, weathered garments, and no floating effects. Use the 5/5 review keeps as references — for example:

- `public/art/enemies/blood-demon-knights-batch-37/drafts/11-sable-longsword-castellan-v02.png`
- `public/art/enemies/blood-priestesses-batch-39/drafts/01-oxblood-rapier-confessor.png`
- `public/art/enemies/blood-priestesses-batch-39/drafts/10-pale-grave-hammer-canoness.png`
- `public/art/enemies/catholic-knights-batch-41/drafts/01-processional-crucifer.png`
- `public/art/enemies/veiled-warrior-nuns-batch-37/drafts/01-oxblood-arming-sword-survivor.png`

The full anchor list lives in `art-catalog/REVIEW-LEARNINGS.md`. Preserve the high-level qualities these share — statuesque adult presence, severe religious dress logic, worn metal and cloth, melancholy menace, one readable weapon — without copying any single pose, costume, or silhouette.

## Knight and Armored-Humanoid Direction

Armor must look wearable and mechanically plausible:

- A human body must fit inside it.
- The neck needs clearance.
- The wearer needs a plausible sight line and breathing path.
- Helmets require believable openings, pivots, catches, or articulated construction where visible.
- Shoulders, elbows, wrists, hips, knees, and ankles must be capable of movement.
- Weapons must remain human-scale unless the user explicitly asks for supernatural scale.
- Favor lean or medium builds over spherical torsos and tank-like feet.
- Avoid armor shaped like a box or building around the body.

Each knight order must differ through helmet, armor layout, cloth system, weapon, stance, mass, silhouette, and implied doctrine—not palette alone.

For forest knights specifically:

- Default to adult humanoid knights shaped by prolonged forest duty, not animal-headed forest creatures.
- Express the forest through weathering, root or vine bindings, practical wood or plant-fiber elements, damp cloth, moss-dark accents, tools, posture, and encounter role.
- Use muted olive, moss, bark, soil, ash, iron, dirty ivory, and restrained warm accents.
- Do not use a flat green background, green wash, bright fantasy-leaf armor, or a forest landscape behind the character.
- Do not turn every knight into the same armored body with different branches attached.

### Crimson Knight

When the request is specifically for the Crimson Knight, follow `ASSET-SPEC.md` exactly. Key locks include:

- Tall adult proportion, approximately 7 to 7.5 heads.
- Narrow waist and long legs.
- Closed rounded sallet or armet.
- No cone helmet, horns, plume, or crown.
- Dark medium plate armor.
- Long crimson cape reaching the lower calf with three or four broad torn tails.
- One long straight one-handed sword.
- Empty off-hand.
- Slight knee bend, never a compressed crouch.

## Angel Direction

Use the first three columns of `samples/angel-character-direction/angel-character-review-sheet.png` as the approved visual anchors:

1. Gilded Spear Angel.
2. Veiled Vessel Angel.
3. Hooded Lantern Pilgrim.

“Not overly done” means:

- One readable role.
- One primary prop or equipment set.
- Controlled two-wing silhouette unless another count is explicitly required.
- Small, restrained halo treatment.
- One coherent clothing system.
- Restrained warm-dark, dirty-ivory, ash, and dull-gold palette.
- Readability at 256 pixels.

For corrupted angels:

- Show one primary physical or religious consequence.
- Add no more than one secondary magical accent.
- Make corruption physically consequential, not fashionable or decorative.
- Keep ruined-religious and occult identity present.
- Use functional gothic or medieval clothing: tunic and tabard, trousers and boots, wrapped waist garment, cropped surcoat, or monastic work clothing.
- Robes may be used when structurally coherent and restrained.
- Do not overcorrect away from robes into bare chests, dark shorts, underwear, fashion harnesses, or generic model bodies.
- Avoid giant symmetrical wings, youthful handsome sameness, and literal object gimmicks.

For any new corrupted-angel extension, begin with no more than three pilot concepts and compare them side by side with the approved anchors.

## Boss Direction

Bosses must be story and encounter identities, not enlarged common enemies.

- Prefer transformations that express narrative consequence.
- Keep anatomy and repeated props exactly countable.
- Maintain a readable encounter silhouette.
- Give the boss a clear locomotion and attack logic.
- Humanoid giants such as the Bell Giant are valid.
- Do not create a boss whose body is a building, house, tower, doorway, altar, or other architectural structure unless the user explicitly reverses this rule.
- Do not hide required legs or appendages behind the body.
- Do not add extra limbs, containers, weapons, or repeated parts.

## Environment Direction

An environment request defaults to an empty, playable side-scrolling room:

- Use a strict side view.
- Prefer a 384 × 216 native grid when the collection does not specify another size.
- Use 24-pixel tile modules where appropriate.
- Establish a clear traversable baseline.
- Preserve negative space for 96 × 96 actors.
- Avoid perspective floors and cinematic camera angles.
- Keep the environment lower in saturation and contrast than the actors.
- Use broad connected value masses.
- Keep platforms, hazards, entrances, and exits readable.
- Do not populate the plate with generated characters unless explicitly requested.
- Generate exact transparent character cutouts separately when a populated mockup is needed.

Natural green is allowed for vegetation, moss, vines, and living roots. It must not become a flat background, fog, magical wash, or character tint.

Avoid:

- Individual-leaf noise.
- Excessive fern, bark, stone, vine, brick, rain, reflection, or debris microtexture.
- Accidental body-like faces or ghost silhouettes in trees and scenery.
- Overly empty color reduction that removes useful material detail.

## Redemption Anthology Direction

An anthology or redemption-scene request is an explicit exception to the isolated square asset contract.

Create a cinematic narrative illustration with:

- Believable anatomy.
- Clear action demonstrating a choice toward goodness.
- Restrained magic and gore.
- Strong character hierarchy.
- Environmental storytelling.
- A readable moral or emotional event without relying on explanatory text.

Do not reinterpret an anthology scene as a sprite concept unless the user asks for one.

## Generation Prompt Skeleton

Construct a separate prompt for each concept using this logic:

> Create one original [category] concept for the Ashen Provinces: [specific identity and gameplay role]. Show exactly one complete [adult humanoid or specified anatomy] on a square 1:1 canvas, isolated against a plain warm near-black background. Preserve generous padding around the entire silhouette, including [all counted extensions]. Use deliberate crisp pixel art with hard square pixels, connected clusters, broad value masses, restrained color ramps, and no anti-aliasing, blur, painterly gradients, or microtexture.
>
> - Anatomy and counted elements: [exact count], five fingers per visible hand.
> - Silhouette and posture: [specific construction].
> - Clothing or armor: [coherent functional system], weathered and specific, never pristine.
> - Primary equipment or corruption event: [one idea]. Weapon: [named conventional weapon], perfectly straight, full combat length, gripped correctly by the handle with [one or both] hands.
> - Secondary accent: [none or one restrained idea]; no floating spell effects, droplets, or particles unless explicitly briefed.
> - Palette: [dominant neutrals and limited accent coverage].
> - Mood: severe, mournful, occult, grounded, and non-graphic.
>
> Do not include: [category prohibitions], scenery, floor, cast shadow, vignette, text, frame, extra characters, cropped elements, extra anatomy, or unrequested props. Do not copy the positive reference's exact pose, costume, or silhouette.

The prompt must describe the desired image positively as well as list prohibitions. Do not rely on a long negative list to invent the concept.

## Mandatory Quality-Control Gate

Inspect every returned image before presenting or saving it as a viable draft.

### Full-Resolution Check

- Exactly one intended asset.
- Correct canvas shape.
- Correct background.
- Complete silhouette and padding.
- Correct anatomy.
- Correct count of every repeated part.
- No accidental extra face, hand, limb, weapon, wing, jar, orb, or attachment.
- Five fingers on every visible hand, with correct thumb placement.
- Weapon is straight, full combat length, and gripped by the handle only — both hands for two-handed weapons, no hand on the blade, no blade resting on a shoulder.
- No unrequested spell effects, droplets, particles, or floating props.
- Feet and legs are planted plausibly.
- Coherent joins between anatomy, clothing, armor, and props.
- Equipment is physically usable by the character as depicted.
- Requested facing and pose.
- No scenery or text.

### Art-Direction Check

- Belongs to the requested family.
- Reads as Ashen Provinces rather than generic fantasy.
- Uses one clear primary idea.
- Is not overly decorated.
- Does not repeat an existing concept or another member of the batch.
- Avoids all current category prohibitions.
- Does not imitate an external character or rejected design.

### Pixel Check

- Crisp square pixels and connected clusters.
- No smoothing or soft gradients.
- No noisy microtexture.
- Broad values remain readable.
- Important anatomy and equipment remain legible at 256 pixels.
- The silhouette remains readable at likely gameplay scale.

If a mandatory criterion fails, reject the result internally and regenerate from a corrected prompt. Do not repair structurally broken anatomy by compositing or painting over it unless the user explicitly requests an edit.

## Saving and Approval

- Save the original generated render, at full quality, directly under its
  `public/art/<category>/<collection>/` path as `<NN>-<slug>.png`. That
  single file is the only copy — never create a `-source` duplicate or a
  `-reference-256` downscale.
- Follow the repository's existing category, collection, numbering, and filename conventions.
- Save viable generated work only as a draft (in the collection's `drafts/` folder).
- Native production sprites must be deliberately redrawn to their specified grid; never blindly shrink a concept master and call it final.
- Preserve the exact generation prompt in the active collection's single
  `GENERATION-PROMPTS.md`. Append revisions and waves there; do not create
  prompt files under `rejected/`. Remove the record when the collection has no
  retained or active draft renders.
- Do not mark anything canonical, retained, approved, or production-ready without explicit user approval.
- Do not update lore, canonical counts, retained galleries, or approval manifests before approval.
- Silence does not mean approval.
- “This is enough” means stop generating; it does not mean the renders are approved.

If the user says stop while a generation is pending, do not save the newly completed result unless the user later asks for it.

If the user rejects a complete batch and asks for deletion, use a recoverable deletion method where practical and remove it from active presentation surfaces.

## Response After a Render Wave

Present the completed review wave concisely:

- Show each render.
- Give each a short functional name and one-line gameplay identity.
- Label every item `Draft`.
- Mention any internally rejected attempts only if they materially affected the result.
- Ask for approval, rejection, or adjustment of the visible drafts.

Do not write lore essays or promote the concepts while waiting for visual approval.

## Worked Interpretation: “5 forest knights”

Interpret this as:

- Five separate isolated adult humanoid knight concepts.
- One review wave of five.
- Character-concept/enemy-family rules.
- Forest influence expressed through duty, materials, weathering, bindings, equipment, posture, and role.
- No animal heads or bodies.
- No bright green dominance or green background.
- No scenery.
- No identical armor bodies differentiated by branch decorations.
- Five distinct encounter roles and silhouettes.
- One asset per image-generation call and one saved draft source per viable concept; retry separately if a result fails quality control.
- Full-resolution, 256-pixel, silhouette, anatomy, count, and duplication checks before presentation.

The user does not need to restate these rules.
