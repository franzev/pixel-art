# Enemy Art Direction and User Feedback

**Last updated:** 2026-07-31
**Purpose:** Durable user-taste and workflow guidance for future enemy generation

> 2026-07-30: The user completed a 996-render bulk review. The distilled,
> confirmed lessons live in `art-catalog/REVIEW-LEARNINGS.md` — read that file
> together with this one. Where this document and the review data conflict,
> the review data wins. A subsequent direct clarification made visible spells
> a project-wide hard prohibition because spell-bearing generations fail
> consistently (10/10); see §4b.
>
> 2026-07-31: The enemy gallery is not globally Filipino, Philippine, 1970s,
> colonial, folkloric, or folk-craft themed. Apply those directions only to an
> explicitly named brief or collection. Banig, abaca, capiz, Filipino clothing,
> and Philippine creature traits are not default knight or creature features.

Read this document before proposing or generating a new enemy batch. It records
what the user has explicitly liked, disliked, rejected, or corrected. It does
not replace `ENEMY-ASSET-SPEC.md`; use both.

## 1. Project Purpose

This project is building an original enemy library for a side-scrolling gothic
Metroidvania.

Enemy generation should produce:

- isolated full-body character concept masters;
- strong gameplay-readable silhouettes;
- genuine deliberate pixel art;
- coherent dark-fantasy art direction;
- designs that can later inform native sprites and animation;
- draft assets that remain outside canon until explicit approval.

The project is not primarily seeking:

- cinematic illustrations;
- environmental storytelling scenes;
- novelty creature exercises;
- generic fantasy concept paintings;
- maximal visual variety without a coherent game identity.

## 2. Strongest Positive Reference

> **Superseded 2026-07-30.** In the bulk review the user rated the Flesh-Veil
> Oracle 1/5 and marked it for deletion, along with nearly all of Infernal
> Demons Batch 13 (1/15 kept). Do not use it as a positive reference anymore.
> Use the 5/5 keeps listed in `art-catalog/REVIEW-LEARNINGS.md` instead —
> e.g. Sable Longsword Castellan (Blood Demon Knights 37), Oxblood Rapier
> Confessor and Pale Grave Hammer Canoness (Blood Priestesses 39). Any kept
> render remains subject to current reference-retirement and fatigue rules;
> specifically, do not use the Ash-Hatchet Penitent or treat the complete
> Catholic Knights Batch 41 armor grammar as a reusable template. The
> historical record below is retained for provenance only.

The clearest liked reference was:

`collections/enemies/infernal-demons-batch-13/drafts/03-flesh-veil-oracle-source.png`

Matching 256 reference:

`public/art/enemies/infernal-demons-batch-13/drafts/03-flesh-veil-oracle-reference-256.png`

SHA-256:

`b6c98bd3e4f4d174de50a40169b9091ad6c9c4e09b1c0e4fdc2b857f7415e4c5`

The user later supplied a desktop copy of this exact image and explicitly asked
for more characters like it.

### What to preserve from this reference

- Adult, statuesque, elegant humanoid proportions
- Feminine or androgynous occult-caster presence
- Severe horned hood or veiled headpiece
- Partly concealed face with a readable profile
- Pale intact flesh with restrained scarlet ritual markings
- Layered soot-black and deep-burgundy cloth
- Worn bronze or copper trim
- Controlled ember-orange spell light (historical only; now prohibited)
- Long cloth shapes with a melancholy gothic silhouette
- Full-body isolated presentation
- Crisp, visible pixel construction
- Infernal menace without bulky musculature or graphic gore

Use this as a character-family and treatment reference. Do not repeatedly copy
its exact three-orb column, hand pose, garment panels, hood shape, or facial
profile.

## 3. Confirmed Likes

The user has positively selected or requested:

- Elegant veiled infernal spellcasters
- Lean or statuesque adult humanoids
- Layered black, charcoal, burgundy, and maroon garments
- Pale flesh used as contrast rather than exposed gore
- Restrained ritual markings
- Blackened horn or horn-like veil shapes
- Bronze, copper, or dirty-gold trim
- Strong but controlled ember lighting
- Floating spell geometry that remains easy to count and understand
  (superseded 2026-07-30: never use this direction again. The bulk review
  rejected floating effects repeatedly, and the later 10/10 clarification
  makes visible spells a project-wide hard prohibition.)
- Severe, mournful, occult character presence
- One complete character on a perfectly uniform `#171311` warm-charcoal
  background
- Cohesive families of related characters with different combat roles
- Designs that remain readable at 256×256

These historical likes do not authorize a recurring black/bronze/ember global
grade. The current palette, filter, and lighting fatigue lock below takes
precedence.

## 4. Confirmed Dislikes and Rejections

### Rejected archetypes

The user explicitly disliked:

- imps;
- dog or hellhound enemies;
- bell demons;
- bugs, beetles, and insect-derived enemies;
- bulky brutes.

Do not reintroduce these merely by changing their palette or equipment.

### Duplicate-heavy batches

The user said Batch 13 had too many duplicates, although the batch was allowed
to remain.

Avoid filling a batch with repeated:

- red horned bipeds;
- similar standing caster poses;
- near-identical veils or robes;
- polearm carriers;
- goat-headed silhouettes;
- identical orb arrangements;
- the same body plan with only a new prop.

A coherent family is welcome, but each member still needs a different gameplay
read at thumbnail scale.

### Armor repetition and reference fatigue

On 2026-07-31 the user reported strong visual fatigue from the repeated armor
design represented by:

`public/art/enemies/catholic-knights-batch-41/drafts/09-ash-hatchet-penitent.png`

The Ash-Hatchet Penitent remains a historical 5/5 review keep, but is now
reference-retired. Do not use its full-body render as an image-generation
input or positive armor anchor. A keep decision validates an asset at the time
of review; it does not grant permanent reference status.

Until the user explicitly reverses this direction, do not repeat the complete
combination of:

- compact closed perforated armet;
- rounded or layered plate pauldrons;
- full blackened plate over mail;
- dark indigo and weathered-brown split devotional tabard or skirt;
- prominent chest crosses;
- layered rope, cord, or centered belt treatment.

Individual components are not universally banned. The recognizable combined
armor grammar is fatigue-locked.

For every multi-knight wave:

- build an armor structural matrix before prompting;
- vary helmet and face exposure, torso construction, coverage level, shoulder
  architecture, arms, waist and hips, lower body, cloth topology, dominant
  material, body mass, posture, and negative space;
- require at least four structural differences between every pair and against
  each of the ten most recent comparable knights;
- do not count weapon, weapon angle, palette, insignia, weathering, or name as
  structural armor variation;
- compare temporary body-only silhouette and grayscale views at 256 pixels;
- reject a result that reads as the same knight after weapon, palette,
  devotional markings, and small accessories are ignored;
- stop and rewrite the armor blueprints when two outputs in the same wave fail
  this similarity gate.

Use at most two restrained shared construction or material tokens to establish
order cohesion. Never use one complete armor kit as the shared family token.

### Palette, filter, and lighting fatigue

On 2026-07-31 the user reported strong fatigue with the repeated filter, look,
and palette represented by:

`public/art/enemies/axe-wielding-knights-batch-50/drafts/03-black-scapular-brace.png`

The supplied Desktop file is byte-identical to the catalog render. Treat it as
direct negative evidence for palette and lighting. Do not use it as a palette
or treatment reference. This feedback does not, by itself, approve or reject
its weapon, anatomy, concept, or lifecycle state.

The fatigue-locked combination is:

- blackened or charcoal steel;
- soot-black or charcoal cloth;
- dark-brown wood or leather;
- dirty-ivory details;
- tiny bronze or copper highlights;
- warm bronze, copper, amber, or brown rim lighting;
- a global sepia, brown, bronze, grey-black, or desaturated grade.

The mandatory `#171311` background remains perfectly flat and separate from the
subject. Never turn it into a vignette, edge falloff, warm halo, haze, or color
cast.

For every comparable multi-character wave:

- record dominant material and color family, secondary garment hue and value,
  metal finish and temperature, leather or wood hue, accent role and coverage,
  and lighting direction and temperature;
- require at least three palette-axis differences between every pair and
  against each of the ten most recent comparable renders;
- do not count tiny hue shifts within the same black-grey-brown family;
- preserve separate local color ramps for metal, cloth, leather, wood, skin,
  bone, shell, and accents;
- share no more than one anchor color and one trim or material token across the
  family;
- stop and rewrite the color scripts after two repeated palette or global-grade
  failures.

Palette diversity and armor diversity are independent gates. A new palette does
not rescue copied armor, and a new armor or weapon does not rescue a repeated
filter.

### Inappropriate shields and implausible grips

The user rejected Warrior White Ladies Batch 33 and specifically called out a
shield that was not appropriate to the character and had weird handle
placement.

- Do not add a shield merely to make a silhouette broader or different.
- A shield must fit the character's role, cultural/material logic, and implied
  fighting behavior.
- Show a mechanically plausible interior handle or strap system.
- Place that system to support the shield's center of mass, not merely wherever
  the hand happens to appear.
- The gripping hand, wrist, and forearm must align naturally with that system
  and plausibly support the shield's weight.
- Reject front-face or outer-rim handle placement unless a clearly justified
  historical construction requires it.
- Reject ambiguous hand-to-handle joins before saving the image as a draft.

### Too many red demons

The user explicitly objected when the collection accumulated too many red
demons.

Important nuance:

- Deep burgundy cloth, maroon lining, scarlet markings, and ember light are
  liked in the Flesh-Veil Oracle direction.
- Repeated bright-red skin and repeated generic red horned demon bodies are not
  liked.
- Red should usually be a controlled material or accent, not the only idea
  distinguishing the character.

### Uncanny Outsiders Batch 23

The user fully rejected and requested deletion of:

- Saffron Kiln Toad
- Indigo Folding-Fan Wraith
- Chalkbone Nautilus
- Cobalt Raincloak Strider
- Moon-Jelly Mourner

The complete batch, website references, review sheet, prompt/status files, and
generated-image originals were removed from the project and moved to Trash.

The user described the batch only as “bad” and issued a full rejection. Do not
invent a more specific reason than the user gave. The safe operational lesson
is:

- radical novelty is not automatically useful;
- “surprise me” must remain grounded in the project’s established gothic
  Metroidvania identity;
- do not replace a requested character family with unrelated animal, object,
  or whimsical abstract silhouettes.

### 4b. 2026-07-30 bulk review (996 renders)

The user reviewed the entire archive one render at a time: 203 keep, 86
reject, 707 delete. Rejects carry structured defects and correction notes.
Full distillation: `art-catalog/REVIEW-LEARNINGS.md`. The enemy-relevant
conclusions:

**Weapon faults are the top rejection cause.** Recurring, explicitly stated
corrections:

- complete `render-contracts/EQUIPMENT-RESEARCH.md` before prompting; record an
  authoritative measured object, a full-profile image, and a close
  handle/socket/trigger/shield-back view;
- never guess a hidden handle, shield back, socket, or trigger mechanism;
- measure the exact weapon against a realistic example, record its total length
  and component proportions, and convert that scale to the handler's height;
- weapons must be perfectly straight (bent blades/hafts rejected ~10 times);
- straight blades, shafts, sticks, and handles require one continuous
  centerline, with blade–guard–grip or head–socket–shaft components aligned;
- weapons must be full combat length ("weapon too short" killed most of
  Forest Elf Sword Knights Batch 35 — 2/26 kept);
- never grip the blade ("STOP HOLDING THE BLADE, THIS IS A COMMON MISTAKE");
- two-handed weapons take both hands on the grip;
- for longswords, greatswords, zweihänders, and other oversized swords, both
  complete hands must fit visibly on the researched grip between guard and
  pommel; reject half-swording, ricasso/forte contact, mordhau, any hand
  crossing the guard, and any glove or gauntlet touching the blade;
- no blade resting on shoulders;
- correct thumbs, no missing fingers, plausible shield handles;
- no bows, arrows, quivers, or loose/floating ammunition;
- crossbows require correct support-hand, firing-hand, trigger-finger, and
  string-path anatomy;
- every weapon must suit the handler's body, strength, hands, vision, role,
  culture, clothing, armor, stance, and implied attack;
- conventional weapons only ("please no weird weapons") — fans, books,
  spindles, plates, and candlesticks were all rejected as weapons.

**Visible spells are prohibited.** "Remove spells / blood drops / blood string
/ effects" is the most repeated next-attempt note across at least ten
collections. Effect-heavy caster batches were nearly wiped out (Combat Magic
04: 2/31; Cultists Demons 02: 1/29; Infernal Demons 13: 1/15). The user later
clarified that spell-bearing generations fail consistently (10/10) and always
look awful. Do not add spells even for casters; express supernatural identity
through physical design, conventional equipment, posture, materials,
corruption, and silhouette.

**Anatomy and proportions.** Missing fingers, odd hands, weird legs/feet, and
"weird body" recur. "Too tall", "too muscular", and "too masculine" were
explicit rejections for female fighter families — keep feminine builds. For
adult women, follow the user's 2026-07-30 proportion direction: approximately
7.5–8 heads high, long but plausible legs, balanced ribcage and pelvis, natural
shoulders, moderate waist definition, hips only modestly wider than the
shoulders, and a naturally proportionate chest. Reject oversized breasts,
extreme hourglass anatomy, pin-up posture, cleavage emphasis, molded breast-cup
armor, vacuum-sealed garments, and fetishized framing.

**Female face and hair variety.** Do not reuse one female face with different
hair. Every multi-woman wave must vary at least four structural facial axes
between each pair: face shape, jaw/chin, brows/eyes, nose, mouth, cheeks, age
cues, or hairline. Hair does not count toward the four. Use varied
setting-compatible feminine hairstyles, including soft feminine short cuts, but
keep them simple and battle ready for a war-torn era. Prefer one secured braid,
a low bun, simply wrapped or pinned hair, a low tied ponytail, tucked
shoulder-length hair, a bob, or a soft short cut. Hair must remain clear of the
eyes, armor, weapon hands, shield grips, and crossbow mechanisms. Avoid long
loose combat hair, elaborate braid architecture, towering buns, cascading salon
curls, ornate hair jewelry, flowers, ribbons, excessive pins, ceremonial
styling, dramatic windblown volume, buzz cuts, shaved-side undercuts, mohawks,
fauxhawks, high-and-tight cuts, graphic shaved patterns, neon/multicolor
fantasy dyes, and conflicting contemporary statement styling. Do not infer
sexual orientation from appearance. Unless a narrative brief requires a
relationship, keep each concept isolated with no romantic, couple, courtship,
or sexual signaling.

**Female age and attractiveness.** The 2026-07-31 direct clarification requires
every female character to be visibly attractive and to read as an unmistakably
adult young woman, normally approximately 21–35 in apparent age. Build
attractiveness through harmonious but individually varied facial proportions,
clear readable eyes, well-formed features, setting-compatible grooming, and a
composed, severe, mournful, or role-appropriate expression. Do not turn this
into sexualized anatomy, glossy modern glamour, a repeated beauty-filter face,
or juvenile styling. Reject teenager or schoolgirl cues, childlike
head-to-body ratios, disproportionately oversized childlike eyes, undeveloped
facial planes, immature jaws or chins, childlike posture or clothing, and any
age-ambiguous result.

**Distinctly feminine faces.** The 2026-07-31 direct clarification also rejects
female faces that read as deliberately masculine or heavily androgynous. The
combined jaw, chin, brow, eyes, cheeks, mouth, and neck must produce a clearly
feminine adult read. Avoid a dominant combination of pronounced brow ridge,
very broad square jaw, oversized blocky chin, heavy low brows, coarse angular
planes, and thick masculine neck. Preserve varied brief-appropriate facial
structures, noses, eye shapes, and skin tones without imposing one ethnicity;
do not replace face diversity with one narrow-nosed, doll-like, or
beauty-filter template.
Sexual orientation cannot be inferred from facial appearance and is not a
visual acceptance or rejection criterion.

**Coherence and finish.** Equipment logic must hold (no blindfolded crossbow
aimer); garments must be weathered and specific, not "too boring too perfect"
and not "too cartoony".

**What was kept.** Keeps concentrate in armed, martial, religious-gothic
humanoids with conventional weapons and clean silhouettes: Catholic Knights
41 (10/10), Bone Knights 39 (5/5), Veiled Warrior Nuns 37 (8/10), Blood
Priestesses 39 (8/11), Crown of Thorns Knights 40 (7/10), Blood Demon
Knights 37 (10/15), Convent Horrors 37 (13/25), Maria Clara Corruptions 41
(3/5). Philippine-inflected elements (bolo, abaca, capiz, abaniko, Maria
Clara dress, sampaguita) performed well in those specifically themed
collections when execution was correct. That evidence is collection-local and
does not make those elements a default for new enemies.

**What was cleared out.** Near-0% keep, do not regenerate without new
direction: novelty-species knights (treant, siyokoy, dwende, goat, frost,
steampunk, ethereal-horse, otherworldly, inverted-cross), effect-heavy
casters, Redeemed Demons 22, Katipunero Afflictions 10, Philippine Folklore
03 (in its old creature-heavy form), Ghouls/Ghoul Foot Soldiers, and
Manananggal Variations 06.

## 5. Visual Quality Requirements the User Cares About

- Genuine low-shade pixel art, not a pixel filter over a painting
- Hard square pixels and deliberate connected clusters
- Large readable value shapes before texture
- Full silhouette with comfortable padding
- Correct anatomy and exact effect or prop counts
- No cropped hands, feet, horns, cloth, or weapons
- No visible spells or spell-like effects
- Perfectly uniform `#171311` warm-charcoal background
- Never a green background
- No scenery, floor plane, cast shadow, or vignette for character concepts
- Intact stylized flesh
- No exposed organs or graphic gore
- Broad grimdark influence without copying recognizable franchises

## 6. Desired Variety

Prefer variation through gameplay identity rather than random species changes.

Good ways to vary a coherent character family:

- ranged pressure, area denial, pursuit, movement, and elite roles expressed
  through physical design and conventional equipment;
- different helmet families and amounts of face exposure;
- different torso construction and armor-coverage levels;
- different shoulder, waist, hip, lower-body, and footwear architectures;
- cloth-dominant, mail-dominant, leather-dominant, partial-plate, and
  plate-dominant material distributions when appropriate to the brief;
- distinct metal finishes, garment hue families, leather or wood hues, accent
  roles, and lighting temperatures without using a global filter;
- narrow, wide, diagonal, circular, crouched, and high-stepping silhouettes;
- high-hand, low-hand, crossed-arm, guarded-core, or extended-arm poses;
- distinct weapon, tool, binding, armor, garment, or corruption geometries;
- different cloth construction, hood geometry, and negative-space patterns;
- palette emphasis shifting among charcoal, pale flesh, burgundy, bronze, and
  ember without abandoning the family.

Weak variety:

- changing only the weapon;
- changing only the weapon angle or stance around the same armor body;
- changing only the palette, cross motif, belt ornament, or weathering;
- repeating the same black/soot/brown/bronze/warm-rim grade around a different
  body or weapon;
- changing only the number of horns;
- changing only the orb count;
- repeating the same stance and robe with a different name;
- producing unrelated novelty creatures to avoid duplicate humanoids.

## 7. Generation and Review Preferences

- Work in small reviewable groups—five is a good default unless the user asks
  for another number.
- Use one fresh image-generation call per distinct character.
- Use a liked image directly only when current feedback still marks it as an
  active reference. A keep rating alone is insufficient, and a
  reference-retired full-body render must never be supplied as an input.
- Prefer a design-neutral pixel-treatment crop or style sample when the goal is
  to preserve rendering technique without inheriting a complete costume.
- State whether a supplied image is a reference or an edit target.
- After viability checks, save each full-quality render once at the collection
  root so it appears in the review website. Do not create source/reference
  duplicates or use a `drafts/` folder for new generations.
- Inspect at 256 before continuing.
- Compare silhouettes during the batch rather than only at the end.
- Treat collection-root placement as review availability, not approval,
  retention, canon, or production readiness.
- Do not update lore, manifests, retained counts, or canonical galleries
  without approval.
- When the user says stop, stop generating immediately.
- Do not automatically save an output that completed immediately before a stop
  request unless the user later asks to keep it.
- When the user rejects and asks to delete a batch, remove the full project
  collection and corresponding website references; use recoverable Trash where
  practical.

## 8. Feedback Timeline

### Infernal Demons Batch 11

The user disliked the imps, dog, bell demon, bug/insect, and brute directions.

### Infernal Demons Batch 13

The batch removed the explicitly disliked archetypes. The user said it still
contained too many duplicates but allowed it to remain.

The later attachment confirmed that the Flesh-Veil Oracle within Batch 13 is a
strong positive target.

### Redeemed Demons Batch 22

The user objected to accumulating too many red demons and asked for different
characters. Treat current files according to that batch's own `STATUS.md`; do
not infer approval from successful generation.

### Uncanny Outsiders Batch 23

Full rejection. Deleted from the project at the user's request.

### Veiled Ember Coven Batch 24

Created specifically from the Flesh-Veil Oracle reference.

Four valid draft sources and references were saved:

1. Ember-Triad Veilseer
2. Cinder-Thread Binder
3. Pyre-Sleeve Channeler
4. Ash-Crown Augur

A fifth concept, Furnace-Veil Matriarch, completed generation but was not copied
into the project because the user asked to stop immediately after it appeared.

The four saved designs remain drafts. “This is enough” was a quantity stop, not
an explicit retention or canon approval.

### Warrior White Ladies Batch 33

The user stopped generation during the fourth concept and fully rejected the
visible wave. Three saved sources and references were moved to the collection's
`rejected/` folders. The fourth concept was not saved, and the fifth was not
generated.

The only asset-specific feedback was to avoid shields when they are not
appropriate and to reject weird or mechanically implausible shield-handle
placement. Do not infer additional rejection reasons for the other designs, and
do not use any Batch 33 output as a positive reference.

### 2026-07-30 Bulk Archive Review

The user reviewed 996 renders one by one in the local review app (203 keep,
86 reject, 707 delete). See §4b and `art-catalog/REVIEW-LEARNINGS.md`.
Headline outcomes: the Flesh-Veil Oracle positive reference was reversed
(rated 1/5, marked for deletion); weapon correctness and effect removal
became the dominant correction themes; armed martial religious humanoids are
the confirmed direction; caster, novelty-species, and creature batches were
cleared out.

## 9. Decision Rules for Future Sessions

Before generating:

1. Identify the exact positive reference and confirm that it is still active.
2. Reject any reference-retired full-body image before prompt assembly.
3. Describe which traits will be preserved.
4. For knights, complete the armor structural matrix and compare it with the
   ten most recent comparable renders.
5. Describe how new body-only silhouettes and armor architectures will differ.
6. Keep the first batch small.
7. Ask before making a large batch or changing to a radically different theme.

During generation:

1. Reject malformed anatomy or incorrect counts.
2. Reject obvious duplicate silhouettes.
3. Do not drift into generic red-skinned demon repetition.
4. Do not drift into novelty creatures unrelated to the selected family.
5. Complete and record the authoritative equipment-research gate before
   prompting.
6. Measure weapon length against a realistic example and the depicted handler.
7. Inspect straightness and alignment through every blade, guard, grip, head,
   socket, shaft, stick, and handle.
8. Inspect shield, weapon, and tool grips for mechanically plausible handle,
   wrist, forearm, center-of-mass, and load-bearing alignment.
9. Inspect focused crops of every hand contact and component join; reject hidden
   or unverifiable handle construction.
10. Reject arrows, quivers, loose ammunition, and malformed crossbow hands or
   trigger fingers.
11. Reject equipment inappropriate to its handler or implied attack.
12. Do not add equipment solely to manufacture silhouette variety.
13. Do not count a changed weapon, pose, palette, insignia, or weathering as
    structural armor diversity.
14. Inspect temporary body-only silhouette and grayscale views at 256 pixels.
15. Stop the wave and rewrite its armor blueprints after two repeated-armor
    failures.
16. Inspect full-color 256-pixel comparisons for distinct material ramps and
    palette architecture.
17. Reject global sepia, brown, bronze, grey-black, desaturated, or uniformly
    warm/cool grading and any background vignette or color leak.
18. Stop the wave and rewrite its color scripts after two repeated-palette
    failures.
19. Stop immediately when requested.

After generation:

1. Keep each viable full-quality render once at its collection-root catalog
   path for review.
2. Create review sheets only for saved review renders.
3. Present the group for explicit approval.
4. Record feedback without treating silence or “enough” as approval.

## 10. Current Approval State

- The Flesh-Veil Oracle is no longer a positive reference (rated 1/5 and
  marked for deletion, 2026-07-30). The current positive anchors are the
  eligible 5/5 review keeps listed in `art-catalog/REVIEW-LEARNINGS.md`,
  subject to current reference-retirement and fatigue locks.
- The Ash-Hatchet Penitent remains a historical 5/5 review keep but is not an
  active generation reference. Its repeated armor bundle is fatigue-locked.
- 203 renders carry review keeps from the 2026-07-30 bulk review. A review
  keep is not canon approval; kept work remains draft until explicitly
  approved.
- 707 renders are marked for deletion (non-destructively). Physical deletion
  still requires a separately authorized cleanup pass.
- Batch 23 is fully rejected and deleted from the project.
- Batch 24 Designs 01–04 are saved drafts, not retained canon.
- Batch 24 Design 05 is not a project asset.
- Batch 33 is fully rejected; its three saved designs exist only under
  `rejected/` and are not positive references.
- No new lore, manifest, retained count, or canonical gallery update is
  authorized by the feedback recorded here.
