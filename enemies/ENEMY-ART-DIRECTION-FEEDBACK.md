# Enemy Art Direction and User Feedback

**Last updated:** 2026-07-30  
**Purpose:** Durable user-taste and workflow guidance for future enemy generation

> 2026-07-30: The user completed a 996-render bulk review. The distilled,
> confirmed lessons live in `art-catalog/REVIEW-LEARNINGS.md` — read that file
> together with this one. Where this document and the review data conflict,
> the review data wins (notable: spell effects are now default-off; see §4b).

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
> Confessor and Pale Grave Hammer Canoness (Blood Priestesses 39), and the
> Catholic Knights Batch 41 set. The historical record below is retained for
> provenance only.

The clearest liked reference was:

`enemies/infernal-demons-batch-13/drafts/03-flesh-veil-oracle-source.png`

Matching 256 reference:

`site/public/art/enemies/infernal-demons-batch-13/drafts/03-flesh-veil-oracle-reference-256.png`

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
- Controlled ember-orange spell light
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
  (superseded 2026-07-30: the bulk review rejected floating effects repeatedly
  — "remove spells" is the most common correction note. Default to no spell
  effects; add them only when the brief explicitly requests a caster.)
- Severe, mournful, occult character presence
- One complete character on a plain warm near-black background
- Cohesive families of related characters with different combat roles
- Designs that remain readable at 256×256

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

### Inappropriate shields and implausible grips

The user rejected Warrior White Ladies Batch 33 and specifically called out a
shield that was not appropriate to the character and had weird handle
placement.

- Do not add a shield merely to make a silhouette broader or different.
- A shield must fit the character's role, cultural/material logic, and implied
  fighting behavior.
- Show a mechanically plausible interior handle or strap system.
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

- weapons must be perfectly straight (bent blades/hafts rejected ~10 times);
- weapons must be full combat length ("weapon too short" killed most of
  Forest Elf Sword Knights Batch 35 — 2/26 kept);
- never grip the blade ("STOP HOLDING THE BLADE, THIS IS A COMMON MISTAKE");
- two-handed weapons take both hands on the grip;
- no blade resting on shoulders;
- correct thumbs, no missing fingers, plausible shield handles;
- conventional weapons only ("please no weird weapons") — fans, books,
  spindles, plates, and candlesticks were all rejected as weapons.

**Spell effects are default-off.** "Remove spells / blood drops / blood
string / effects" is the most repeated next-attempt note across at least ten
collections. Effect-heavy caster batches were nearly wiped out (Combat Magic
04: 2/31; Cultists Demons 02: 1/29; Infernal Demons 13: 1/15).

**Anatomy and proportions.** Missing fingers, odd hands, weird legs/feet, and
"weird body" recur. "Too tall", "too muscular", and "too masculine" were
explicit rejections for female fighter families — keep feminine builds.

**Coherence and finish.** Equipment logic must hold (no blindfolded crossbow
aimer); garments must be weathered and specific, not "too boring too perfect"
and not "too cartoony".

**What was kept.** Keeps concentrate in armed, martial, religious-gothic
humanoids with conventional weapons and clean silhouettes: Catholic Knights
41 (10/10), Bone Knights 39 (5/5), Veiled Warrior Nuns 37 (8/10), Blood
Priestesses 39 (8/11), Crown of Thorns Knights 40 (7/10), Blood Demon
Knights 37 (10/15), Convent Horrors 37 (13/25), Maria Clara Corruptions 41
(3/5). Philippine-inflected elements (bolo, abaca, capiz, abaniko, Maria
Clara dress, sampaguita) performed well when execution was correct.

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
- No cropped hands, feet, horns, cloth, weapons, or magic
- Plain warm near-black background
- Never a green background
- No scenery, floor plane, cast shadow, or vignette for character concepts
- Intact stylized flesh
- No exposed organs or graphic gore
- Broad grimdark influence without copying recognizable franchises

## 6. Desired Variety

Prefer variation through gameplay identity rather than random species changes.

Good ways to vary a coherent character family:

- artillery, control, barrier, summoning, movement, and elite roles;
- narrow, wide, diagonal, circular, crouched, and levitating silhouettes;
- high-hand, low-hand, crossed-arm, guarded-core, or extended-arm poses;
- distinct spell geometries such as isolated orbs, threads, barriers, contained
  cores, or crown motes;
- different cloth construction, hood geometry, and negative-space patterns;
- palette emphasis shifting among charcoal, pale flesh, burgundy, bronze, and
  ember without abandoning the family.

Weak variety:

- changing only the weapon;
- changing only the number of horns;
- changing only the orb count;
- repeating the same stance and robe with a different name;
- producing unrelated novelty creatures to avoid duplicate humanoids.

## 7. Generation and Review Preferences

- Work in small reviewable groups—five is a good default unless the user asks
  for another number.
- Use one fresh image-generation call per distinct character.
- When the user supplies a liked image, use it directly as a style and
  character-family reference.
- State whether a supplied image is a reference or an edit target.
- Save each accepted source and 256 reference immediately.
- Inspect at 256 before continuing.
- Compare silhouettes during the batch rather than only at the end.
- Keep all work in `drafts/` until explicit approval.
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

1. Identify the exact positive reference.
2. Describe which traits will be preserved.
3. Describe how new silhouettes will differ.
4. Keep the first batch small.
5. Ask before making a large batch or changing to a radically different theme.

During generation:

1. Reject malformed anatomy or incorrect counts.
2. Reject obvious duplicate silhouettes.
3. Do not drift into generic red-skinned demon repetition.
4. Do not drift into novelty creatures unrelated to the selected family.
5. Inspect shield, weapon, and tool grips for mechanically plausible handle,
   wrist, forearm, and load-bearing alignment.
6. Do not add equipment solely to manufacture silhouette variety.
7. Stop immediately when requested.

After generation:

1. Keep accepted files in draft locations.
2. Create review sheets only for saved drafts.
3. Present the group for explicit approval.
4. Record feedback without treating silence or “enough” as approval.

## 10. Current Approval State

- The Flesh-Veil Oracle is no longer a positive reference (rated 1/5 and
  marked for deletion, 2026-07-30). The current positive anchors are the
  5/5 review keeps listed in `art-catalog/REVIEW-LEARNINGS.md`.
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
