# Confirmed Review Learnings

Last updated: 2026-07-30

Source: the 996-render bulk review recorded in `render-feedback.jsonl` and `RENDER-FEEDBACK.md` (996 reviews: 203 keep, 86 reject, 707 delete). Those two files are machine exports and must not be hand-edited; this document is the human-readable distillation for future generation sessions.

Read this before writing any new generation prompt. Every rule here comes from explicit user decisions, structured defects, or verbatim correction notes — not from inference.

## How to read the decisions

- `keep` is a review keep, not canon approval. Kept work is still draft until explicitly approved.
- `reject` records carry the correction guidance; they are the highest-value evidence of what to fix.
- `delete` was used partly as archive cleanup of old exploratory batches. A deleted render is negative evidence about the batch, but the specific reason is only known when a note exists.

## The defect leaderboard

Structured defects across the review (fatal + major):

| Defect | Count | What it means for prompts |
|---|---|---|
| Anatomy / limbs | 27 | Verify limbs, legs, feet placement before saving |
| Unwanted magic / effects | 26 | Default to NO spell effects — see below |
| Wrong proportions | 26 | Adult human proportions; not too tall, not too muscular |
| Weapon handling | 16 | Grips must be mechanically correct |
| Weapon too short | 14 | Weapons must read at full combat length |
| Hands / fingers | 11 | Count fingers; check thumbs |
| Bent / crooked weapon | 9 | Shafts and blades must be straight |
| Wrong weapon design | 8 | Conventional recognizable weapons only |

Weapon problems combined (handling + too short + bent + wrong design = 47) are the single largest failure category. Anatomy problems (anatomy + hands/fingers + proportions = 64) are the other. Almost every rejection is one of these two families plus unwanted effects.

## Weapon rules (the most repeated corrections)

1. **Straight.** Sword blades, spear hafts, polearm shafts, knife blades, and handles must be perfectly straight. "Weapon bent", "spear looks bent", "knife not straight", "weapon handle bent" recur across many collections.
2. **Full length.** Longswords, spears, and maces repeatedly rendered too short — this alone killed most of Forest Elf Sword Knights Batch 35 (2/26 kept). A longsword must read as a longsword at 256 px, not a short sword.
3. **Never grip the blade.** Verbatim: "STOP HOLDING THE BLADE, THIS IS A COMMON MISTAKE." Hands go on the handle/grip only.
4. **Two-handed weapons take both hands.** Greatswords held one-handed were rejected; "both hands should be holding the sword", "right hand should also be holding the spear".
5. **No resting the blade on shoulders.** "Blade shouldn't be resting on shoulders."
6. **Correct grip anatomy.** Thumbs placed correctly, no missing fingers on the gripping hand, wrist and forearm aligned with the handle. Shield handles must be interior and mechanically plausible — "weird shield handle placement" caused rejections.
7. **Conventional weapon designs.** Verbatim: "please no weird weapons." Rejected as weapons: fans, ledgers/books, spindles, salvers/plates, ornate candlesticks, over-designed gimmick arms. Repeated user substitutions point at the preferred arsenal: halberd, morning star (spiked ball), longsword, mace, war pick, bolo, rapier, sabre, crossbow, arquebus, kitchen knife (for domestic-horror concepts). A religious motif may live in the weapon's detailing (e.g. a cross-shaped head), but the weapon itself stays a standard weapon.
8. **When a weapon fails but the character works, only the weapon needs to change.** "Preserve all, just fix weapon handling" — prefer targeted rerenders over redesigns.

## Effects: default to none

The most common `next attempt` note, across at least ten collections, is some form of **"remove spells"**: remove spells, remove blood drops, remove blood string, remove blood effects, remove the smoking stuff, no more arrows (floating ammunition), remove weapon/spells.

- Do not add floating spell effects, blood droplets, magic threads, glowing sigils, orbiting projectiles, or ambient particles unless the brief explicitly requests a caster with visible magic.
- This supersedes the older "controlled ember magic / floating spell geometry" preference: the review data shows armed martial humanoids with clean silhouettes are kept, while effect-heavy casters were nearly all deleted (Combat Magic Batch 04: 2/31 kept; Cultists Demons Batch 02: 1/29; Infernal Demons Batch 13: 1/15).
- Also remove non-weapon hand props that clutter the read (plates, books, ropes). One weapon, or one clearly-purposed tool, per character.
- Remove skin tattoos/markings when they read as decoration ("remove skin tattoo").

## Anatomy and proportions

- Five fingers per visible hand. Missing fingers were rejected repeatedly even on otherwise good renders.
- Check hand placement and what the hands are actually doing ("hands holding the cloth incorrectly", "wrong hand placement", "left hand is odd").
- Check legs and feet placement ("fix feet/leg placement", "weird legs", "left leg weird").
- Adult human proportions, but not exaggerated: "too tall" and "weird proportions" were rejection reasons.
- Female fighters stay feminine: "too masculine" and "too muscular" were explicit rejections in Veiled Warrior Nuns Batch 35.

## Coherence and finish

- Equipment logic must hold: "shouldn't be blindfolded if holding a crossbow." A character's sensory and physical state must permit using their equipment.
- Not too clean, not too perfect: "dress too boring too perfect" — garments need weathering, asymmetry, and specificity.
- Not cartoony: "too cartoony" was a rejection.
- Detail placement matters at 256 px: "wrong purple eye placement (too high)".
- Exact duplicates or repeated poses within a batch are fatal defects.

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

Strong 5/5 anchors to use as references (all under their listed collection paths):

- Sable Longsword Castellan (Blood Demon Knights 37)
- Ivory Hook Glaive Mourner, Oxblood Rapier Confessor, Pale Grave Hammer Canoness, Pale Tithe Bolo Sacristan (Blood Priestesses 39)
- Processional Crucifer, Sunburst Relic Lancer, Palm Weave Arquebusier, Votive Lamp Sabreur (Catholic Knights 41)
- Abaca Gatewarden, Harvest Hook Puller (Bone Knights 39)
- Oxblood Arming Sword Survivor, Rust Pearl Poleaxe Matron, Soot Green Bolo Veteran (Veiled Warrior Nuns 37)
- Abaniko Fang Ilustrada, Capiz Mirror Heiress, Grave Sickle Harvest Widow (Maria Clara Corruptions 41)
- Silver Spear Betrothed, Veil Fang Processional, Sampaguita Vow Matron (Vampire Brides 35)

Philippine-inflected concepts (bolos, abaca, capiz, abaniko, Maria Clara dress, sampaguita) performed well when the weapon and anatomy were correct — the setting direction is validated; execution failures were the problem.

## What was cleared out (avoid regenerating)

Reviewed at or near 0% keep — do not regenerate these directions without new explicit user direction:

- Effect-heavy casters: Combat Magic 04, Cultists Demons 02, Infernal Demons 11/13, Demonic Astrologers 41.
- Novelty-species knights: Treant 25, Siyokoy 29, Dwende 29, Goat 37, Frost 37, Steampunk 37, Ethereal Horse 37, Otherworldly 41, Inverted Cross Demonic 44.
- Creature/folklore experiments in their current form: Manananggal Variations 06, Ghouls Haunts Curses 12, Ghoul Foot Soldiers 26, Katipunero Afflictions 10, Philippine Folklore 03, Redeemed Demons 22.
- Corrupted Angels v01: 1/35 kept. Angel Concepts: 2/8. The angel direction needs a reworked pilot (fix bent weapons, remove spells) before any new batch.
- All reviewed environments (15) and bosses (9) were deleted; both categories need a fresh direction conversation before regeneration.
- Protagonist variations: 8/44 kept — review the 8 keeps before generating more.

**Direction reversal:** the Flesh-Veil Oracle (`enemies/infernal-demons-batch-13/drafts/03-flesh-veil-oracle-*`), previously the project's strongest positive reference, was rated 1/5 and marked for deletion in this review. All documents that cited it as a positive anchor are superseded. The 5/5 keeps above are the current anchors.

## Prompt-writing checklist derived from this review

Before submitting any generation prompt, confirm it explicitly states:

1. The exact weapon, its full combat length, and that it is straight.
2. Which hand(s) grip the handle — both hands for two-handed weapons — and that no hand touches the blade.
3. Five fingers per visible hand; deliberate feet placement.
4. No floating spell effects, droplets, particles, or extra props (unless explicitly briefed).
5. Adult human proportions; feminine build for female concepts.
6. Weathered, specific garments — never pristine or cartoony.
7. Equipment logic is physically usable by the character as depicted.

Before saving any result as a draft, verify all seven at full resolution and at 256 px, and reject internally on any failure.
