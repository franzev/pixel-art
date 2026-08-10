# Confirmed Review Learnings

Last updated: 2026-08-02

Source: the 1,382 confirmed reviews recorded in `render-feedback.jsonl` and
`RENDER-FEEDBACK.md` (362 keep, 207 reject, 813 delete). The 813 marked catalog
files were physically removed through the authorized deletion workflow on
2026-07-31; their review records remain historical evidence. Those two files
are machine exports and must not be hand-edited; this document is the
human-readable distillation for future generation sessions.

Read this before writing any new generation prompt. Every rule here comes from explicit user decisions, structured defects, or verbatim correction notes — not from inference.

## Current style-scope clarification

- **2026-07-31 direct clarification:** the gallery is not limited to Filipino,
  Philippine, 1970s, colonial, folklore, or folk-craft design.
- Banig, abaca, capiz, Filipino clothing, Philippine folklore, and similar
  regional cues apply only when the current brief or active collection
  explicitly asks for them.
- A positive rating for a culturally specific asset validates that asset or
  named collection; it does not make the same cultural motif mandatory for
  knights, creatures, or unrelated collections.
- When a brief does not specify a culture or period, keep the direction open
  and original. Do not infer an ethnicity, decade, or regional craft language
  from another gallery item.

## Canonical background clarification

- **2026-07-31 direct clarification:** every future isolated asset concept and
  opaque preview uses one perfectly uniform warm-charcoal background:
  `#171311`.
- Do not vary the background among concepts or batches. Older `#120F0E`,
  `#1A1513`, warm-near-black ranges, and unspecified near-black instructions
  are superseded for future generations.
- Do not add a tint, gradient, vignette, glow field, texture, scenery, floor
  plane, cast shadow, or atmosphere to the flat background.

### 2026-08-02 prompt-language correction

- `Near-black`, `soft radial studio falloff`, and similar photographic backdrop
  wording are not acceptable substitutes for the fixed background. They caused
  visible mottling, halos, edge darkening, and floor-like shading in redo
  attempts. Future prompts must say: perfectly flat, perfectly uniform
  solid-color `#171311` from edge to edge; every background pixel is the same;
  subject lighting does not affect the background.
- `High-resolution fantasy concept art` and other painting/illustration labels
  can overpower an earlier pixel-art clause. Future prompts repeat
  `deliberately pixel-authored high-density pixel art` at the beginning and end
  and explicitly reject smoothing, anti-aliasing, painterly gradients,
  brushwork, and pixel-filtered painting.
- A strong design with textured background or smooth non-pixel rendering is
  still a failed attempt. Preserve it in the raw attempt archive, but rerun the
  complete visual prompt; do not repair it through pixel manipulation.
- Do not retroactively recolor historical renders. Native production sprites
  and animation frames remain transparent; intentionally illustrated
  environments and narrative scenes remain full compositions.

## Canonical canvas clarification

- **2026-07-31 direct clarification:** every future original full-quality
  generated render uses a square `1:1` canvas in every category, including
  environments and narrative scenes.
- State `square 1:1 canvas; output width must equal output height` in every
  generation prompt and select a `1:1` generator setting when available.
- Verify the returned PNG's actual pixel dimensions before saving. Prompt
  wording or a visually near-square result is not sufficient.
- Reject and regenerate any non-square generated output. Do not crop, stretch,
  squash, or pad it into compliance.
- Do not retroactively alter historical renders. Deliberately authored native
  sprites, animation sheets, environment plates, UI composites, and review
  sheets may retain their specified production dimensions because they are
  derived artifacts rather than generated source renders.

## Canonical facing clarification

- **2026-08-01 direct clarification:** `right-facing` means a slight
  screen-right bias, not a complete side profile.
- Keep every future directional subject mostly frontal in a shallow
  **front** three-quarter view. The camera-facing facial plane must remain
  readable. For an unobscured face, show both eyes, nose, mouth, chin, and
  expression; the gaze may glance right without turning the face away.
- Turn the head and upper torso only enough for the leading action, locomotion,
  attack, and equipment use to favor the right edge. Preserve both shoulders
  when anatomy and costume permit. Do not force a 90-degree profile, rear
  three-quarter view, back-of-head view, ear-only view, far-cheek sliver, or
  edge-on torso unless explicitly requested. Hair, cloth, banners, and capes
  may trail toward screen-left.
- This direction supersedes older screen-left canonical poses, collection
  prompts, continuation notes, reference poses, and any interpretation of the
  2026-07-31 screen-right rule as requiring a full profile.
- Do not mirror a finished render as a repair because mirroring can reverse
  handed equipment, asymmetrical construction, costume details, and lighting.
  Regenerate the subject with the correct slight rightward three-quarter bias,
  anatomy, and equipment.
- A generic `right-facing` clause is insufficient when the same prompt locks a
  screen-left-leading leg, weapon head, or attack line. State and verify the
  concrete screen-space cues: forward knee and leading foot toward
  screen-right, rear leg and loose cloth trailing toward screen-left, and the
  weapon head or active end leading toward screen-right. Reject any result whose
  dominant locomotion or equipment cue still leads left.
- Directional correction must not be implemented by mirroring the character.
  Lock each asymmetric trait—exposed shoulder, scar, sleeve, shawl, handed
  equipment, and ornament—to its original screen side in the regeneration
  prompt and verify those sides in the returned image.
- A truly non-directional prop, empty environment, or abstract composition may
  record facing as not applicable only with an explicit QA explanation.

## Redo identity preservation clarification

- **2026-08-01 direct clarification:** redos must not racially or ethnically
  recast a character. A redo is the same person, not a replacement person.
- Preserve the source character's visible skin tone and undertone, facial
  structure, eye and nose shape, lips, hair texture, age, gender presentation,
  and culturally or ethnically specific appearance.
- Do not lighten, darken, or change racial or ethnic appearance unless the user
  explicitly requests that exact identity change. Correcting pose, facing,
  equipment, anatomy, palette, or background does not authorize recasting.
- When the source covers or leaves an identity trait ambiguous, preserve the
  covering or ambiguity. Do not infer ethnicity from name, costume, role,
  faction, location, culture, or fantasy species.
- This is an identity-continuity rule for source-based revisions. It does not
  create a prohibited or preferred race for newly designed characters.

## Redo minimum-delta clarification

- **2026-08-01 direct clarification:** a redo must correct the named defect,
  not reinterpret the whole character.
- A polished candidate still fails when it changes unrelated face visibility,
  identity, body build, proportions, pose, silhouette, garment topology,
  palette, accessories, footwear state, or equipment outside the confirmed
  correction.
- The failure example was Burnt-Rose Iron-Club Nun: the instruction was only
  to change the club into a morning star, but an earlier candidate exposed and
  recast the face, changed the body, stance, dress layers, shawl, belt, rosary,
  boots, silhouette, and one-hand pose.
- Prevent drift through a self-contained reconstruction prompt that describes
  every visible source detail and names the one authorized change. Do not rely
  on an archetype label or the source bitmap alone.
- Redos are fresh whole-image generations. Never mirror, composite, recolor,
  replace the background, script-inpaint, or otherwise manipulate pixels to
  repair them. Preserve every raw result and retry through the prompt.

## How to read the decisions

- `keep` is a review keep, not canon approval. Kept work is still draft until explicitly approved.
- `keep` is also not permanent permission to reuse the full render as a
  generation reference. Current direct feedback may retire a kept image as a
  reference without changing its historical rating or asset decision.
- `reject` records carry the correction guidance; they are the highest-value evidence of what to fix.
- `delete` was used partly as archive cleanup of old exploratory batches. A deleted render is negative evidence about the batch, but the specific reason is only known when a note exists.

## The defect leaderboard

Structured defects across the review (fatal + major):

| Defect | Count | What it means for prompts |
|---|---|---|
| Anatomy / limbs | 27 | Verify limbs, legs, feet placement before saving |
| Unwanted magic / effects | 26 | Never generate spell effects — see below |
| Wrong proportions | 26 | Adult human proportions; not too tall, not too muscular |
| Weapon handling | 16 | Grips must be mechanically correct |
| Weapon too short | 14 | Weapons must read at full combat length |
| Hands / fingers | 11 | Count fingers; check thumbs |
| Bent / crooked weapon | 9 | Shafts and blades must be straight |
| Wrong weapon design | 8 | Conventional recognizable weapons only |

Weapon problems combined (handling + too short + bent + wrong design = 47) are the single largest failure category. Anatomy problems (anatomy + hands/fingers + proportions = 64) are the other. Almost every rejection is one of these two families plus unwanted effects.

## Weapon rules (the most repeated corrections)

1. **Research before prompting; never guess the handle.** Complete
   `render-contracts/EQUIPMENT-RESEARCH.md`. Use an authoritative measured
   object record, a full-profile image, and a close handle, socket, trigger, or
   shield-back view. If the hidden construction cannot be verified, do not
   generate that equipment.
2. **Measure realistic length.** Name the exact real-world weapon type, establish
   its realistic total length and component proportions, then convert that to
   the depicted handler's height. Verify:
   `rendered weapon length / rendered handler height ≈ real weapon length / real handler height`.
   Do not rely on "long" or "full length" as subjective prompt wording.
3. **Straight and aligned.** Sword blades, spear hafts, polearm shafts, sticks,
   knife blades, and handles meant to be straight must share one continuous
   centerline. Blade, guard, grip, and pommel—or head, socket, shaft, and
   butt—must align without bends, kinks, offsets, or broken joins. "Weapon
   bent", "spear looks bent", "knife not straight", and "weapon handle bent"
   recur across many collections.
4. **Full length.** Longswords, spears, and maces repeatedly rendered too short — this alone killed most of Forest Elf Sword Knights Batch 35 (2/26 kept). A longsword must read as a longsword at 256 px, not a short sword.
5. **Never grip the blade.** Verbatim: "STOP HOLDING THE BLADE, THIS IS A COMMON MISTAKE." Hands go on the handle/grip only. This is especially strict for longswords, greatswords, zweihänders, and other oversized swords: show every finger, thumb, palm, glove, and gauntlet entirely on the grip between guard and pommel. No half-swording, ricasso/forte grip, mordhau, support hand on the blade flat, or hand crossing the guard.
6. **Two-handed weapons take both hands.** Greatswords held one-handed were rejected; "both hands should be holding the sword", "right hand should also be holding the spear". For an oversized sword, measure the usable grip and verify both closed hands fit visibly behind the guard. If they do not, change the hilt, subtype, pose, or framing rather than moving a hand onto the blade.
7. **No resting the blade on shoulders.** "Blade shouldn't be resting on shoulders."
8. **Correct subtype-specific grip and shield anatomy.** Record handle length,
   cross-section, hand count, contact points, thumb side, finger closure, and
   wrist direction from the actual equipment reference. Thumbs must be placed
   correctly, with no missing fingers on the gripping hand; the wrist and
   forearm must align with the handle.
   Shield handles and straps must stay on the interior, support the center of
   mass, and align with the hand, wrist, and forearm. Weird front-face,
   outer-rim, or disconnected shield handles are automatic rejections.
9. **No arrows.** Avoid bows, arrows, quivers, and loose or floating
   ammunition. Crossbows are allowed, but the support hand must remain under
   the stock and clear of the rail/string path; the firing hand must grip the
   researched stock or tiller. In a ready pose, the trigger finger stays
   straight along the stock above the trigger; only an explicitly firing pose
   puts the fingertip on the trigger. If loaded, show exactly one short,
   correctly seated bolt or quarrel—never a long arrow.
10. **Appropriate to the handler.** A weapon must suit the wielder's anatomy,
   height, strength, usable hands, vision, role, training, culture, clothing,
   armor, stance, and intended attack. Mechanical correctness alone is not
   enough if the handler could not realistically carry, aim, or use it.
11. **Conventional weapon designs.** Verbatim: "please no weird weapons." Rejected as weapons: fans, ledgers/books, spindles, salvers/plates, ornate candlesticks, over-designed gimmick arms. Repeated user substitutions point at the preferred arsenal: halberd, morning star (spiked ball), longsword, mace, war pick, bolo, rapier, sabre, crossbow, arquebus, kitchen knife (for domestic-horror concepts). A religious motif may live in the weapon's detailing (e.g. a cross-shaped head), but the weapon itself stays a standard weapon.
12. **When a weapon fails but the character works, only the weapon needs to change.** "Preserve all, just fix weapon handling" — prefer targeted rerenders over redesigns.
13. **A straight-weapon prompt is not a pass.** On 2026-08-02, newly generated
    vampire-knight attempts still contained visibly bowed or unreliable weapon
    geometry even though their prompts explicitly required straight continuous
    centerlines. After preserving the raw attempt, stop on that concept. Use a
    temporary endpoint-to-endpoint straight reference line, inspect the full
    profile and every join at full resolution and 256 pixels, and regenerate
    the same concept before generating the next armed member of the wave. Raw
    attempt indexing is preservation, not acceptance.

## Gender-neutral batch interpretation

- **2026-08-02 direct clarification:** a generic plural brief such as `vampire
  knights` must not become an all-woman wave merely because the nearest older
  collection was historically feminine.
- Inherit a single-gender direction only when the current user instruction
  names it, explicitly requests continuation of that gendered collection, or
  uses a gender-specific family name.
- Otherwise create a mixed adult cast. Keep the family cohesive through role,
  armor, silhouette, materials, and encounter behavior; gender is not a
  substitute for concept diversity.
- This clarification is future-facing. It does not require deleting,
  replacing, or recasting already generated attempts.

## Immediate web-gallery availability

- **2026-08-02 direct clarification:** every newly generated bitmap must be
  available in the web gallery immediately, not after the wave finishes.
- Preserve the untouched result first with `render:save-attempt`, then verify
  its exact entry in `app/attempt-index.json` and the gallery's History view
  before inspecting, retrying, or generating the next concept.
- If automatic refresh fails, run `npm run sync:attempts`. If the gallery is
  not running, start `npm run dev` and verify the History item before
  continuing.
- History is the immediate home of all raw attempts, including failures.
  Catalog remains restricted to selected renders that pass the executable
  render gate. Immediate visibility does not mean approval or canon.

## Retry-budget clarification

- **2026-08-03 direct clarification:** five near-identical retries of one
  concept waste the user's generation and token budget and must not be
  mistaken for a requested five-character batch.
- Default to one initial generation plus one targeted correction per concept.
- Allow at most two correction calls across a complete review wave.
- Every returned output counts against the budget, including obvious failures,
  background failures, malformed weapons, and near-duplicates.
- If the correction still fails, abandon that concept for the current wave and
  continue with the next distinct concept when safe. The armed serial gate
  prevents accepting bad equipment; it does not require indefinite retries.
- Any third attempt for the same concept requires new explicit user approval
  after reporting the attempts already used and the exact unresolved defect.
- Raw-attempt preservation remains mandatory, but History is evidence of calls
  already spent—not permission to keep spending them.

## Effects: spells are prohibited

The most common `next attempt` note, across at least ten collections, is some form of **"remove spells"**: remove spells, remove blood drops, remove blood string, remove blood effects, remove the smoking stuff, no more arrows (floating ammunition), remove weapon/spells.

- **2026-07-30 direct clarification:** the user reports that spell-bearing
  generations fail consistently (10/10) and always look awful. Visible spells
  are therefore a project-wide hard prohibition, not a default that a caster
  brief can switch on.
- Do not add floating magic, auras, blood droplets, magic threads, glowing
  sigils, runes, orbs, magical projectiles, elemental emissions, summoned
  geometry, smoke wisps, or ambient particles.
- A caster or supernatural role must read through physical design, conventional
  equipment, posture, materials, corruption, and silhouette. Spell-related
  wording is gameplay or lore identity only.
- This prohibition supersedes every older spell-positive collection prompt,
  status note, reference description, and effect palette.
- This supersedes the older "controlled ember magic / floating spell geometry" preference: the review data shows armed martial humanoids with clean silhouettes are kept, while effect-heavy casters were nearly all deleted (Combat Magic Batch 04: 2/31 kept; Cultists Demons Batch 02: 1/29; Infernal Demons Batch 13: 1/15).
- Also remove non-weapon hand props that clutter the read (plates, books, ropes). One weapon, or one clearly-purposed tool, per character.
- Remove skin tattoos/markings when they read as decoration ("remove skin tattoo").

## Anatomy and proportions

- Five fingers per visible hand. Missing fingers were rejected repeatedly even on otherwise good renders.
- Check hand placement and what the hands are actually doing ("hands holding the cloth incorrectly", "wrong hand placement", "left hand is odd").
- Check legs and feet placement ("fix feet/leg placement", "weird legs", "left leg weird").
- Adult human proportions, but not exaggerated: "too tall" and "weird proportions" were rejection reasons.
- Female fighters stay feminine: "too masculine" and "too muscular" were explicit rejections in Veiled Warrior Nuns Batch 35.
- **2026-07-30 female proportion clarification:** use the supplied reference for
  broad anatomy only. Adult women should read around 7.5–8 heads high, with long
  but plausible legs, a balanced ribcage and pelvis, natural shoulders, a
  moderately defined waist, and hips only modestly wider than the shoulders.
- Keep breasts naturally proportionate to the ribcage and never oversized. Do
  not make the chest the primary silhouette feature.
- Reject extreme hourglass anatomy, wasp waists, exaggerated hips, thighs, or
  buttocks, arched-back pin-up poses, chest-forward posing, cleavage emphasis,
  individual molded breast cups, vacuum-sealed garments, or fetishized camera
  angles.
- Preserve femininity through coherent adult anatomy and silhouette, not
  sexualization or impractical clothing.

## Female face and hairstyle variety

- **2026-07-31 feminine-face clarification:** female faces must read as
  distinctly feminine through the combined jaw, chin, brow, eyes, cheeks,
  mouth, and neck. Reject a deliberately masculine or heavily androgynous
  construction dominated by a pronounced brow ridge, very broad square jaw,
  oversized blocky chin, heavy low brows, coarse angular planes, or thick
  masculine neck.
- Preserve varied brief-appropriate facial structures, noses, eye shapes, and
  skin tones. Do not impose one ethnicity when the brief does not specify one.
  Femininity must not collapse into one narrow-nosed, doll-like, or repeated
  beauty-filter face.
- **2026-07-31 battle-ready hair clarification:** the setting is war-torn, so
  female hairstyles must be simple, restrained, low-maintenance, and ready for
  combat rather than fancy. Hair must stay clear of vision, armor articulation,
  weapon hands, shield grips, and crossbow mechanisms.
- Prefer one secured braid, a low braided or plain bun, simple wrapped or pinned
  hair, a low tied ponytail, tucked or partly secured shoulder-length hair,
  chin-length bobs, soft pixies, side-swept crops, and short feminine layered
  cuts. A few natural loose strands are acceptable; large unsecured masses are
  not.
- Reject long loose combat hair, elaborate braided crowns, decorative braid
  networks, towering or sculpted buns, cascading salon curls, ornate hair
  jewelry, flowers, ribbons, excessive pins, ceremonial hair architecture, and
  dramatic windblown volume.
- **2026-07-31 age and appearance clarification:** every female character
  should be visibly attractive and read as an unmistakably adult young woman,
  normally approximately 21–35 in apparent age. “Younger” means youthful adult,
  never teenager, schoolgirl, childlike, or age-ambiguous.
- Build attractiveness through harmonious but individually varied facial
  proportions, readable eyes, well-formed features, setting-compatible
  grooming, and a composed or character-appropriate expression. Do not use
  sexualized anatomy, glossy glamour styling, beauty-filter sameness, or a
  single standardized “pretty face.”
- Reject childlike head-to-body ratios, disproportionately oversized childlike
  eyes, undeveloped facial planes, immature jaws and chins, teen/schoolgirl
  styling, or childlike posture and clothing.
- **2026-07-30 identity clarification:** female characters must not share one
  face template. Different hair, clothing, makeup, scars, or palette do not fix
  duplicated facial structure.
- For every multi-woman wave, assign and compare face shape, facial length, jaw
  width, chin shape, brow weight, eyebrow arc, eye shape and spacing, nose
  bridge and tip, mouth width and lip shape, cheek structure, age cues,
  hairline, and resting expression.
- At least four structural facial axes must differ between every pair of women;
  hairstyle does not count toward the four.
- Require restrained hairstyle variety across a wave. Approved directions are
  secured single braids, low braided or plain buns, simply pinned or wrapped
  hair, low tied ponytails, tucked or partly secured shoulder-length cuts,
  chin-length bobs, soft pixies, side-swept crops, and short feminine layered
  cuts.
- Short hair is allowed when it retains a soft feminine contour. Avoid buzz
  cuts, shaved-side undercuts, mohawks, fauxhawks, high-and-tight cuts, graphic
  shaved patterns, neon or multicolor fantasy dyes, and overtly contemporary
  statement styling that conflicts with the setting.
- Sexual orientation cannot be determined from appearance and must not be
  assigned or inferred from a face, hairstyle, clothing, or body type. Default
  isolated concepts to no romantic, couple, courtship, or sexual signaling
  unless a narrative brief explicitly requires a relationship.
- Compare same-scale portrait crops side by side at full resolution and at 256
  pixels. Any same-face pair is an automatic rejection.

## Coherence and finish

- Equipment logic must hold: "shouldn't be blindfolded if holding a crossbow." A character's sensory and physical state must permit using their equipment.
- Not too clean, not too perfect: "dress too boring too perfect" — garments need weathering, asymmetry, and specificity.
- Not cartoony: "too cartoony" was a rejection.
- Detail placement matters at 256 px: "wrong purple eye placement (too high)".
- Exact duplicates or repeated poses within a batch are fatal defects.

## Armor repetition and reference fatigue

- **2026-07-31 direct clarification:** repeated use of the same dark plate
  armor body causes strong visual fatigue even when the weapon, pose, or small
  ornament changes.
- The Ash-Hatchet Penitent
  (`public/art/enemies/catholic-knights-batch-41/drafts/09-ash-hatchet-penitent.png`)
  retains its historical 5/5 keep, but is retired as a future generation
  reference. Do not use its full-body image as an input or positive armor
  anchor.
- The fatigue-locked bundle is a compact closed perforated armet, rounded
  pauldrons, full blackened plate over mail, dark indigo and weathered-brown
  split devotional cloth, prominent chest crosses, and a layered rope or
  centered belt treatment. Isolated elements remain available; do not recreate
  the recognizable bundle unless the user explicitly reverses this lock.
- Cohesion cannot be satisfied by cloning one armor body. Before a multi-knight
  wave, compare helmet, torso construction, armor coverage, shoulders, arms,
  waist and hips, lower body, cloth topology, dominant material, body mass,
  posture, and negative space. Require at least four structural differences
  between every pair and against each of the ten most recent comparable
  knights.
- Weapon type, weapon angle, palette, cross ornament, surface weathering, and
  name do not count as structural armor differences.
- Review a temporary body-only silhouette and grayscale 256-pixel view with
  weapons, insignia, palette, and small accessories ignored. If it still reads
  as the same knight, reject it.
- If two outputs in a wave fail for the same armor similarity, stop the wave
  and redesign the armor blueprints instead of finishing the requested count
  through repetition.

## Palette, filter, and lighting fatigue

- **2026-07-31 direct clarification:** yellowish filtering is common across
  renders and must be eliminated. Use no global color filters or grades.
  Future renders should default to a neutral color balance and look vibrant
  through clear local hues, readable saturation, and crisp value separation.
  Do not simulate vibrancy with a colored wash or blanket oversaturation.
- **2026-07-31 direct clarification:** the repeated near-black, bronze, brown,
  and warm-rim treatment causes strong visual fatigue independently of armor
  repetition.
- The user supplied
  `public/art/enemies/axe-wielding-knights-batch-50/drafts/03-black-scapular-brace.png`
  as direct negative evidence for its filter/look/palette. The supplied Desktop
  file is byte-identical to the catalog render.
- Do not use that render as a palette or lighting reference. This feedback does
  not by itself decide the asset's anatomy, weapon, or lifecycle status.
- The fixed `#171311` background remains mandatory, perfectly flat, and
  separate from the subject. It is not permission to apply a warm grade,
  vignette, falloff, or halo.
- Never apply any global color filter or grade, including yellowish, sepia,
  tobacco-brown, bronze, copper, amber, grey-black, uniformly desaturated, or
  uniformly warm/cool grading. Materials must retain distinct, vibrant local
  color ramps under a neutral overall balance.
- The complete blackened-steel, soot/charcoal-cloth, dark-brown wood/leather,
  dirty-ivory, tiny bronze/copper, and warm-rim palette is fatigue-locked.
  Individual components remain available when the overall color script is
  clearly different.
- For comparable multi-character waves, record dominant material, secondary
  garment hue, metal finish, leather or wood hue, accent role, and lighting
  temperature. Require at least three differences between every pair and
  against each of the ten most recent comparable renders.
- A palette change does not count toward armor diversity, and an armor or
  weapon change does not excuse a repeated palette-and-lighting grade.
- After two repeated palette or filter failures in one wave, stop and rewrite
  the color scripts instead of completing the count.

## What the user keeps (positive direction)

Keeps concentrate overwhelmingly in **armed, martial, religious-gothic humanoids with conventional weapons and no effects**. Best-performing collections:

| Collection | Keep rate |
|---|---|
| Catholic Knights Batch 41 | 10/10 |
| Bone Knights Batch 39 | 5/5 |
| Veiled Warrior Nuns Batch 37 | 8/10 |
| Blood Priestesses Batch 39 | 8/11 |
| Crown of Thorns Knights Batch 40 | 7/10 |
| Blood Demon Knights Batch 37 | 10/15 |
| Maria Clara Corruptions Batch 41 | 3/5 |
| Convent Horrors Batch 37 | 13/25 |

Collection keep rates describe historical review outcomes, not permission to
reuse one collection's complete armor grammar indefinitely. Reference
retirement and fatigue locks take precedence.

Strong 5/5 anchors eligible for reference consideration, subject to current
collection notes and reference-retirement rules:

- Sable Longsword Castellan (Blood Demon Knights 37)
- Ivory Hook Glaive Mourner, Oxblood Rapier Confessor, Pale Grave Hammer Canoness, Pale Tithe Bolo Sacristan (Blood Priestesses 39)
- Processional Crucifer, Sunburst Relic Lancer, Palm Weave Arquebusier, Votive Lamp Sabreur (Catholic Knights 41)
- Abaca Gatewarden, Harvest Hook Puller (Bone Knights 39)
- Oxblood Arming Sword Survivor, Rust Pearl Poleaxe Matron, Soot Green Bolo Veteran (Veiled Warrior Nuns 37)
- Abaniko Fang Ilustrada, Capiz Mirror Heiress, Grave Sickle Harvest Widow (Maria Clara Corruptions 41)
- Silver Spear Betrothed, Veil Fang Processional, Sampaguita Vow Matron (Vampire Brides 35)

Philippine-inflected concepts (bolos, abaca, capiz, abaniko, Maria Clara dress,
sampaguita) performed well in the specifically themed collections where they
were reviewed. This validates those individual concepts and collections only;
it is not a gallery-wide style requirement and must not be propagated to
unrelated knights, creatures, or other assets.

## What was cleared out (avoid regenerating)

Reviewed at or near 0% keep — do not regenerate these directions without new explicit user direction:

- Effect-heavy casters: Combat Magic 04, Cultists Demons 02, Infernal Demons 11/13, Demonic Astrologers 41.
- Novelty-species knights: Treant 25, Siyokoy 29, Dwende 29, Goat 37, Frost 37, Steampunk 37, Ethereal Horse 37, Otherworldly 41, Inverted Cross Demonic 44.
- Creature/folklore experiments in their current form: Manananggal Variations 06, Ghouls Haunts Curses 12, Ghoul Foot Soldiers 26, Katipunero Afflictions 10, Philippine Folklore 03, Redeemed Demons 22.
- Corrupted Angels v01: 1/35 kept. Angel Concepts: 2/8. The angel direction needs a reworked pilot (fix bent weapons, remove spells) before any new batch.
- All reviewed environments (15) and bosses (9) were deleted; both categories need a fresh direction conversation before regeneration.
- Protagonist variations: 8/44 kept — review the 8 keeps before generating more.

**Direction reversal:** the Flesh-Veil Oracle (`collections/enemies/infernal-demons-batch-13/drafts/03-flesh-veil-oracle-*`), previously the project's strongest positive reference, was rated 1/5 and marked for deletion in this review. All documents that cited it as a positive anchor are superseded. The 5/5 keeps above are the current anchors.

## Prompt-writing checklist derived from this review

Before submitting any generation prompt, confirm it explicitly states:

1. The perfectly uniform `#171311` background for every isolated concept or
   opaque preview, with no alternate near-black, tint, gradient, vignette,
   texture, scenery, floor, shadow, glow, or atmosphere.
2. Authoritative source links plus usable full-profile and handle/construction
   views are recorded outside the image prompt.
3. The exact weapon, realistic total length, component proportions, and
   handler-relative scale.
4. Straight centerlines and aligned blade–guard–grip or head–socket–shaft
   construction.
5. Researched handle length, cross-section, hand count, contact points, thumb
   side, finger closure, and wrist direction.
6. Which hand(s) grip the handle—both hands for two-handed weapons—and that no
   hand touches the blade. For an oversized sword, both complete hands fit on
   the visible grip between guard and pommel; no half-swording, ricasso/forte
   contact, mordhau, or hand crossing the guard.
7. Interior, load-bearing, source-verified shield handles or straps.
8. No bows, arrows, quivers, or loose or floating ammunition.
9. For crossbows, period-correct mechanism, support hand, firing hand, trigger
   state, trigger finger, and string clearance.
10. The weapon is appropriate to the handler and implied attack.
11. Handle contacts and component joins remain visible enough for focused
    review. An oversized-sword crop includes the guard, both complete hands,
    full usable grip, and pommel together.
12. Five fingers per visible hand; deliberate feet placement.
13. No visible spells, spell-like effects, droplets, particles, or extra props.
14. Adult human proportions; for women, approximately 7.5–8 heads high with
    long plausible legs, balanced torso and pelvis, moderate waist definition,
    and hips only modestly wider than the shoulders.
15. A naturally proportionate chest with no oversized breasts, sexualized
    emphasis, pin-up posture, or molded breast-cup armor.
16. Weathered, specific garments—never pristine, vacuum-sealed, or cartoony.
17. An attractive, unmistakably adult young-woman read, normally approximately
    21–35 in apparent age, expressed through coherent and individually varied
    facial features rather than sexualization or glamour-filter sameness.
18. No teenager, schoolgirl, childlike, or age-ambiguous cues in face, anatomy,
    posture, clothing, or head-to-body ratio.
19. A distinctly feminine overall face with no strongly masculine-coded
    combination of brow ridge, broad square jaw, blocky chin, heavy low brows,
    coarse angular planes, and thick neck.
20. A face structurally distinct from every other woman in the wave on at least
    four axes, excluding hair and surface decoration.
21. A setting-compatible hairstyle not repeated as the batch's only identity
    difference; feminine short hair is allowed.
22. A simple, secured, low-maintenance, battle-ready hairstyle that stays clear
    of vision, armor, hands, shield grips, and weapon mechanisms; no long loose
    combat hair, ornate hair accessories, elaborate braid architecture,
    towering buns, salon curls, or dramatic windblown volume.
23. No buzz cut, shaved-side undercut, mohawk, fauxhawk, high-and-tight cut,
    graphic shaved pattern, neon/multicolor fantasy dye, or conflicting
    contemporary statement hairstyle.
24. No inferred sexual orientation or romantic, couple, courtship, or sexual
    signaling unless explicitly required by a narrative brief.
25. For a multi-knight wave, a structural armor matrix covering helmet, torso,
    coverage, shoulders, arms, waist and hips, lower body, cloth topology,
    dominant material, mass, posture, and negative space.
26. At least four structural differences between every knight pair and against
    each of the ten most recent comparable knights; weapon, weapon angle,
    palette, insignia, weathering, and name do not count.
27. No reference-retired render is supplied as a full-body image input, and no
    fatigue-locked armor bundle is recreated.
28. Family cohesion comes from restrained shared tokens rather than one copied
    armor body.
29. Temporary body-only silhouette and grayscale comparisons remain distinct
    at 256 pixels with weapons, insignia, palette, and small accessories
    ignored.
30. Distinct local color ramps for metal, cloth, leather, wood, skin, bone,
    shell, and accents, with no global sepia, brown, bronze, grey-black,
    desaturated, or uniformly warm/cool filter.
31. A six-axis palette matrix covering dominant material, secondary garment,
    metal finish, leather or wood, accent role, and lighting.
32. At least three palette-axis differences between every comparable pair and
    against each of the ten most recent comparable renders.
33. No fatigue-locked blackened-steel, soot-cloth, dark-brown, dirty-ivory,
    tiny-bronze, warm-rim bundle.
34. The perfectly uniform `#171311` field remains separate from the subject,
    with no vignette, edge falloff, warm halo, background tint, or color leak.
35. A square `1:1` canvas with output width equal to output height for every
    original full-quality generated render.
36. Every directional subject stays mostly frontal in a shallow
    front-three-quarter view with a slight screen-right bias. The camera-facing
    facial plane remains readable; an unobscured face shows both eyes, nose,
    mouth, chin, and expression. Gaze, leading torso action, locomotion, attack,
    and equipment use favor the right edge without turning the subject away,
    rearward, or into a complete side profile. A non-directional exception
    records why facing is not applicable.

Before saving any result for review, verify all thirty-six at full resolution,
with focused handle, attachment, and portrait crops, and at 256 px. Reject
internally on any failure.
