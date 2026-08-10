# Render Redo Tracker

Last updated: 2026-07-30

This file is the persistent progress overlay for renders marked `reject` in
`render-feedback.jsonl`. The review exports remain the source of truth for the
original user decisions and must not be hand-edited.

## Queue summary

- Baseline rejected renders: 86
- Redo candidates awaiting user review: 8
- User-approved redos: 0
- Active rejected items needing another correction: 0
- Unattempted rejected renders: 78

An item leaves the unattempted queue when its source render ID appears below.
It leaves `awaiting-review` only after explicit user feedback in a later
session.

## Default redo method

For future redo waves, prefer a fresh generation over repeated image editing:

1. Reconstruct the original concept prompt from the collection prompt record.
2. Add every confirmed defect, written correction, and `nextAttempt` note as a
   positive visual constraint.
3. Use current high-rated anchors for style, proportions, weapon handling, and
   family continuity.
4. Treat the rejected image as diagnostic evidence only, not as the edit
   target.
5. Generate one fresh version and run the full quality gate. If it still fails,
   record it as another required redo instead of repeatedly inpainting it.

Use a targeted image edit only for a genuinely isolated change, such as
removing one effect without altering anatomy or equipment, or when the user
explicitly requests an edit.

## Redo process failure — 2026-07-30

### What failed

The first redo wave was presented as internally validated, but renders 01 and
13 remained visibly poor and did not solve their recorded defects. The user had
to identify these failures after spending substantial time creating the source
review data.

This was an agent process failure, not missing user feedback.

### Specific mistakes

1. For Blood-Needle Duelist, the agent treated `nextAttempt: remove blood
   string` as the entire correction and ignored the separate confirmed
   `Weapon handling` defect.
2. For Oxblood Greatsword Pursuer, the agent repeatedly edited malformed hand
   and grip anatomy instead of reconstructing the prompt and generating a fresh
   image.
3. The agent accepted ambiguous hands and weapon contact as passing even though
   ambiguity in anatomy or weapon handling is an automatic rejection condition.
4. The agent described the wave as clean before the user reviewed it. That
   overstated the reliability of the internal visual check.
5. The process asked the user to perform quality control that should have
   happened before presentation, creating a risk that the user's original
   tagging effort would be replaced by another full review burden.

### Mandatory safeguards for every future redo

These safeguards override the looser procedure used for redo wave 01:

1. **Complete correction contract:** Build the redo requirements from the union
   of structured defects, defect notes, written feedback, and `nextAttempt`.
   Never allow one field to override or hide another.
2. **Fresh generation by default:** Reconstruct the collection prompt and
   generate a new render. Do not use a rejected image as an edit target for
   anatomy, proportions, hands, pose, or weapon handling.
3. **Per-defect acceptance matrix:** Before presenting a render, record a
   `PASS` or `FAIL` for every original defect and correction note. A render with
   any `FAIL`, uncertainty, or unverified item stays internal.
4. **Automatic rejection on ambiguity:** Unclear finger counts, overlapping
   hands, questionable grips, possible blade contact, bent weapons, uncertain
   proportions, or unreadable anatomy are failures—not judgment calls.
5. **Full-size and 256-pixel evidence:** Inspect the complete render at full
   resolution and at 256 pixels. For hand, anatomy, and weapon defects, inspect
   a focused crop before marking the item presentable.
6. **No user review of internal failures:** Failed attempts do not enter the
   redo review sheet and do not increase the user's review queue.
7. **Small trust-recovery pilot:** Generate at most two redo candidates in the
   next wave. Do not expand the wave unless the user accepts the quality of that
   pilot.
8. **No premature completion language:** Use `candidate awaiting user review`,
   never `solved`, `clean`, `passed`, or `completed`, until the user explicitly
   accepts the redo.
9. **Preserve original review work:** Never hand-edit
   `art-catalog/RENDER-FEEDBACK.md` or
   `art-catalog/render-feedback.jsonl`. Link every candidate to its source
   render ID so the original ratings, decisions, defects, and notes remain the
   source of truth.

### Trust-recovery state

- The user explicitly requested five candidates for redo wave 02, superseding
  the earlier two-candidate pilot limit for this wave only.
- Fresh candidates for redos 01 and 13 are now `awaiting-review`; neither is
  approved.
- New fresh candidates for Blood Priestess redos 04, 06, and 07 are also
  `awaiting-review`; none is approved.
- Redos 02, 03, and 08 from wave 01 remain `awaiting-review`; none is approved.

## Redo wave 01

Collection: Blood Demon Knights Batch 37

Review sheet:
`art-catalog/review-sheets/enemies/blood-demon-knights-batch-37/drafts/blood-demon-knights-batch-37-redo-wave-01-review-sheet.png`

The original paths below are historical paths captured by the review export.
After single-active-render consolidation, a path may now contain the newer
candidate; render IDs remain the unambiguous identity.

| Source render ID | Original path at review time | Correction | Redo candidate | Status |
| --- | --- | --- | --- | --- |
| `rnd_ea106332a553a7e09c5f2495` | `enemies/blood-demon-knights-batch-37/drafts/01-blood-needle-duelist.png` | Fresh generation required: remove the blood string and correct the confirmed weapon-handling defect; use one straight full-length estoc with a mechanically valid handle-only grip and a natural empty off-hand | `rnd_f12d4380faf5290e0347f737` — former `01-blood-needle-duelist-v02.png`, now outside the catalog | redo-again |
| `rnd_9e54937ec7e54ea511dcbaa9` | `enemies/blood-demon-knights-batch-37/drafts/02-vein-hook-arrestor.png` | Remove both blood cords; preserve the hooked bill and grip | `rnd_ff5e05df4ff0f2b96166e127` — `public/art/enemies/blood-demon-knights-batch-37/drafts/02-vein-hook-arrestor.png` | awaiting-review |
| `rnd_c7086304834d0e56246f2b34` | `enemies/blood-demon-knights-batch-37/drafts/03-clot-sigil-bastion.png` | Replace the floating ward with a straight two-handed longsword | `rnd_fc5f6ba8407c478a2b77f030` — `public/art/enemies/blood-demon-knights-batch-37/drafts/03-clot-sigil-bastion.png` | awaiting-review |
| `rnd_5c000ea727d632e34cbc4039` | `enemies/blood-demon-knights-batch-37/drafts/08-sable-greatsword-pursuer.png` | Move both hands onto the greatsword handle; no hand on blade | `rnd_310e3cf3188f2e6fa5a51aab` — `public/art/enemies/blood-demon-knights-batch-37/drafts/08-sable-greatsword-pursuer.png` | awaiting-review |
| `rnd_66146f6cd1c3762b2c5d7dcf` | `enemies/blood-demon-knights-batch-37/drafts/13-oxblood-greatsword-pursuer-v02.png` | Fresh generation required: create exactly two coherent hands gripping only the long greatsword handle, with the crossguard between both hands and the blade; no grip repair or inherited hand anatomy | `rnd_3143fa6185e604d37e3a5cc9` — former `13-oxblood-greatsword-pursuer-v03.png`, now outside the catalog | redo-again |

## Redo wave 02

Collections: Blood Demon Knights Batch 37 and Blood Priestesses Batch 39

Review sheet:
`art-catalog/review-sheets/enemies/redo-wave-02/redo-wave-02-review-sheet.png`

Internal evaluation:
`art-catalog/REDO-WAVE-02-EVALUATION.md`

Every candidate in this wave was generated fresh from its reconstructed
collection prompt. No rejected image was supplied as an edit or visual
reference. `awaiting-review` means only that the candidate cleared the
documented internal defect checks; it is not approval.

| Source render ID | Original | Complete correction contract | Redo candidate | Status |
| --- | --- | --- | --- | --- |
| `rnd_ea106332a553a7e09c5f2495` | `enemies/blood-demon-knights-batch-37/drafts/01-blood-needle-duelist.png` | Remove every blood string/effect and correct weapon handling: one complete straight estoc, right hand on the handle behind the guard, coherent empty off-hand | `rnd_5a021e9942208c12abd02199` — `public/art/enemies/blood-demon-knights-batch-37/drafts/01-blood-needle-duelist.png` | awaiting-review |
| `rnd_66146f6cd1c3762b2c5d7dcf` | `enemies/blood-demon-knights-batch-37/drafts/13-oxblood-greatsword-pursuer-v02.png` | Fresh female knight with exactly two coherent hands visibly enclosing separate sections of one greatsword handle, entirely behind the crossguard | `rnd_19e1d3cc1755e4124db2f99d` — `public/art/enemies/blood-demon-knights-batch-37/drafts/13-oxblood-greatsword-pursuer.png` | awaiting-review |
| `rnd_56123c8c5799991409d21af1` | `enemies/blood-priestesses-batch-39/drafts/04-oxblood-quarrel-canoness.png` | Remove the blindfold/eye obstruction; both eyes open and visible while sighting one coherently held loaded crossbow | `rnd_499957581d3b5c3b18464c30` — `public/art/enemies/blood-priestesses-batch-39/drafts/04-oxblood-quarrel-canoness.png` | awaiting-review |
| `rnd_8be24205e0d2fa7bc6fa16b7` | `enemies/blood-priestesses-batch-39/drafts/06-oxblood-processional-mace-votary.png` | Correct anatomy and limb placement: exactly two naturally aligned legs ending in two separate grounded feet | `rnd_ab73e4c0647b63d77df33f85` — `public/art/enemies/blood-priestesses-batch-39/drafts/06-oxblood-processional-mace-votary.png` | awaiting-review |
| `rnd_ed68ff5784778fc9bd1ba19f` | `enemies/blood-priestesses-batch-39/drafts/07-ivory-lance-sepulchral-votary.png` | Correct hands and weapon handling: both hands, especially the right, visibly wrap separate sections of one continuous spear shaft | `rnd_01e5ff20d7481b2605d28d6f` — `public/art/enemies/blood-priestesses-batch-39/drafts/07-ivory-lance-sepulchral-votary.png` | awaiting-review |

## Redo wave 03

Requested: 20 fresh regenerations in four internal review waves of five.

Every item below is regenerated from a reconstructed prompt. Rejected images
are diagnostic evidence only and are not supplied as edit targets. Candidates
remain under `work/redo-staging/` until the complete defect matrix, full-size
inspection, focused anatomy/equipment crops, and 256-pixel inspection pass.

The queue deliberately skips:

- source renders whose concept already has an active redo candidate;
- the rejected Sable Longsword Castellan V01 because the active version is a
  confirmed 5/5 keep;
- the abandoned candlestick pilot, whose collection status prohibits reviving
  that direction without an explicit request.

| # | Source render ID | Concept | Complete correction contract | Status |
| --- | --- | --- | --- | --- |
| 01 | `rnd_896a8828a896d6f125a90a6b` | Cinder-Crowned Apostate | Straight full-length flanged mace; mature coherent proportions; remove all ember crown fragments and every visible spell/effect | staged: `rnd_1d32487e34f64a86310c5f1f` |
| 02 | `rnd_3ab3257768eafa6778cb77c0` | Black-Rain Arbalist | Fresh mechanically researched crossbow build; unobstructed sightline; correct support hand, firing hand, trigger finger, rail, string, and one seated bolt | staged: `rnd_171a9b28b26a3ada7bfb5e24` |
| 03 | `rnd_54c0f55ac88fa15a4d7949d3` | Capiz-Veil Bolo Harrier | Correct anatomy and limb separation; functional simplified costume; one measured Philippine blade with a visible handle-only grip | staged: `rnd_5d59850e805ac579a69ad7ca` |
| 04 | `rnd_dfbb928893090833d54ee20d` | Dawn-Hide Rattan Bulwark | Correct technical construction and weapon handling; source-grounded rattan shield with an interior load-bearing grip aligned to hand, wrist, forearm, and shoulder | staged: `rnd_86021ea901d13ca6988d8a31` |
| 05 | `rnd_a69900f709f625ed046ef4cb` | Night-Marrow Lance Warden | Perfectly straight measured spear; correct anatomy; violet eyes placed on the natural eye line behind the visor | staged: `rnd_db32f3a4aac2e5c93171255e` |
| 06 | `rnd_7db6400d8bebec5a2877a595` | Black-Bell Caller | Replace the boring, overly perfect dress with weathered asymmetric mourning construction while keeping a grounded rounded silhouette and no effects | staged: `rnd_617ac42f5b082f58301678a1` |
| 07 | `rnd_8a081dfbcfdafca0b53754f1` | Comb-Reclaiming Widow | Mature non-cartoony treatment; researched comb held at its spine with a readable natural grip and coherent wrist | staged: `rnd_8de344913a52f37929d59573` |
| 08 | `rnd_dad432b5c77a0d4967014781` | Crimson-Edged Mourner | Restore the complete left arm and hand; exactly two arms, two hands, and five fingers on every visible hand | staged: `rnd_7d95c0a2c44534b581b1be54` |
| 09 | `rnd_b79a1fbacc420d65a9c4fa4e` | Crimson-Lace Regent | Add restrained physical tarnished chains integrated into the garment; no floating chains or spell-like behavior | staged: `rnd_598ee98eea99dad5f624ec52` |
| 10 | `rnd_caa616fe1004fe1b78edc93e` | Hollow-Throat Matriarch | Remove the sound spindle, shards, glow, and every visible spell/effect; convey the role only through posture and physical design | staged: `rnd_7d427b9759581f534a281701` |
| 11 | `rnd_37dda5dc022182d0a8862abb` | Indigo-Wrap Mourner | Restore a complete readable left hand with five fingers; preserve grounded anatomy and rounded garment construction | staged: `rnd_6117142a41335bbeb2bf77c7d` |
| 12 | `rnd_515eb97487639ecf4b31292c` | Shawlbound Lamenter | Fresh costume and anatomy; shawl hangs naturally without being incorrectly gripped; remove all spectral threads and effects; complete hands and limbs | staged: `rnd_30accb30ca382974a55e8aa8c` |
| 13 | `rnd_9397237843c596c85861a6a9` | Five-Drop Phlebotomist | Remove all five blood drops and every visible effect; retain one physically supported copper basin with coherent two-hand contact | staged: `rnd_0c1e0f70ddc67d2bf1ae50dd` |
| 14 | `rnd_fd0365e4804f0a99d00540cb` | Bronze Mace Prefect | Restore plausible adult female proportions and a full 67.5 cm flanged mace with a straight visible handle-only grip | staged: `rnd_39f2258547bc5c6e48602e0a` |
| 15 | `rnd_b5fa02e6471d19068fc7baf5` | Blood-Cup Interdictor | Remove the denial ring, blood effects, strings, and all visible magic; retain one ordinary solid chalice held securely | staged: `rnd_a7ab8acd69dbb0794d4ddae55` |
| 16 | `rnd_ddb1b873a7b68087f826cae7` | Blood-Diamond Hierophant | Correct both hands and fingers; remove the floating ward and every spell; preserve the diamond identity as a sewn garment inlay, not a floating prop | staged: `rnd_9e4aa50e2b6c5d91471a99ea` |
| 17 | `rnd_5c78cfadbe60bab0a632fe88` | Blackwater Aspergillist | Remove the crescent spray and all droplets/effects; retain one dry aspergillum and one holy-water bucket with plausible grips | staged: `rnd_1f2352eb0c5c06554e0f009e` |
| 18 | `rnd_18f0d2d9c396c27ed0cb2ada` | Wax-Mitre Ordinariate | Replace the crozier hook with a mechanically joined cross finial on one straight processional staff; both hands on the shaft | staged: `rnd_59449be6add6637958f928705` |
| 19 | `rnd_bdc8aaf002dff6bbf4536eec` | Ash-Blue Vampire Whip Sister | Rebuild the left hand with five readable fingers; preserve the rest of the concept; one researched single-tail whip with visible handle grip | staged: `rnd_445a86f6f5b6ebf4b700287d` |
| 20 | `rnd_419ac453e6c7e7ba2af5bf37` | Black Procession Threshing-Flailer | Replace the agricultural flail with one conventional rigid morning-star mace; straight haft, compact joined spiked head, handle-only grip | staged: `rnd_07fd663e2a728603bbccbd44` |

Internal gate complete: 20 staged candidates from 31 fresh generation attempts.
Eleven failed attempts were quarantined before staging. No Wave 03 candidate has
been activated or counted as user-approved.

## Redo wave 04

Requested: another 20 fresh regenerations. Rejected images were used only as
diagnostic evidence and were never supplied to the generator. The 20 candidates
below cleared the documented internal gate after 23 fresh attempts. Three
halberd attempts that lacked required two-hand shaft contact remain quarantined
under `work/redo-wave-04/quarantine/`. No Wave 04 candidate has been activated
or counted as user-approved.

Review sheet: `work/redo-wave-04/review-sheet.png`

Internal evaluation: `art-catalog/REDO-WAVE-04-EVALUATION.md`

| # | Source render ID | Concept | Complete correction contract | Staged candidate |
| --- | --- | --- | --- | --- |
| 01 | `rnd_64825680add2191eb8d7e008` | Burnt-Rose Morning-Star | Replace iron club with one rigid spiked morning-star mace; handle-only grip | `rnd_1aa782c8fd24381784c95891` |
| 02 | `rnd_c338fe06bd79126af6968297` | Cinder Sickle Widow | Remove every skin tattoo or marking; preserve one coherent sickle | `rnd_d0f7ef0897a38bde5fdc0b8d` |
| 03 | `rnd_a1730252306d2ab3ef3dd13f` | Indigo Flail Votary | Give the one flail ball clear short spikes and valid chain joins | `rnd_1c959ed8c7f32680ddea57d0` |
| 04 | `rnd_487b73fed236d41d7fb57edf` | Lavender War-Pick Matron | Correct thumb/finger anatomy and two-hand shaft contact | `rnd_5d0510f1ee273ce7e3e3a267` |
| 05 | `rnd_70af9765496ed323f8861387` | Moon-Veil Rapier Sister | Full measured rapier rather than a short dagger-like blade | `rnd_e8f62aedcb9f1902530a2f74` |
| 06 | `rnd_e2ef5f2be1a2836c3fc4cd25` | Pale-Rosary Mace Sister | Straight full mace plus coherent aligned legs and feet | `rnd_8a667eaa339ac54672631bd0` |
| 07 | `rnd_ef5f73fdd8d55932795d9fca` | Plum-Amber Longsword | Both hands on the grip behind the guard; no blade contact | `rnd_5741be75da789c953610e34b` |
| 08 | `rnd_cdf0ef5c7a30e92aa5e646a7` | Silver-Rosary Mourner | Normal 7.5–8-head mature proportions; no stretched body | `rnd_a2f14d3a63fee408000f8203` |
| 09 | `rnd_ca81de08aef3e864c44c7846` | White-Stake Vampire Sister | Mature adult proportions and coherent two-hand stake grip | `rnd_e5847c3ff4f0fe2638a79c3d` |
| 10 | `rnd_8c13f4a19528d91368fc5072` | Thorn-Pick Pursuivant | Compact researched pick, handle-only grip, correct proportions | `rnd_a2a748dcd1019a9f5723dc93` |
| 11 | `rnd_35df51cfbf4b6d71d73d191c` | Thorn-Rondel Grappler | Perfectly straight rondel dagger with a handle-only grip | `rnd_19e655536b9583738c888119` |
| 12 | `rnd_1b7783e09710919505a616e9` | Black-Hedge Sacristan | Replace the weird weapon; coherent fingers and simple flanged mace | `rnd_b7837816fbf213457c1880d4` |
| 13 | `rnd_a750566b5a228fb37a31bb16` | Briar-Ring Processional | Replace bent staff with one straight conventional spear | `rnd_78202cd0c65d917dd424bd93` |
| 14 | `rnd_c52f071073dab1df05d97f06` | Ash-Monstrance Pikeman | Simplify to one straight conventional halberd; two visible grips | `rnd_52ec83db2bca6b09418b3c05` |
| 15 | `rnd_64bedcc2ea29e8f6b17e4a8b` | Collar-Crook Gaoler | Replace crook/mancatcher with a halberd; both hands on shaft | `rnd_00587d5451074e9652b328af` |
| 16 | `rnd_047d7c636fc184acca6a8ccf` | Five-Nail Ash War King | Full-length straight sword; both skeletal hands on grip | `rnd_f720c523a264e0cc4f6281f9` |
| 17 | `rnd_5d0fc3d8bbeeedfb4432b7ce` | Reed-Sash Dismounted Lancer | Ruler-straight full lance with two separated shaft grips | `rnd_d3e122ea21d8fe82d231231f` |
| 18 | `rnd_7923ccecf8762992545ee6dc` | Chalice-Vow Cantor | Remove every blood drop/effect; ordinary dry supported chalice | `rnd_9bcd0a2c015d87ef6c03f24b` |
| 19 | `rnd_b379795554fa2edbce466890` | Moon-Salt Sabre Bride | Unique overhead pose; blade clear of shoulders, neck, head and arms | `rnd_af7b9f39b0b29a13f8183416` |
| 20 | `rnd_b0ef533a21df664654838096` | Cream Flanged-Mace Sacristan | Full-length straight mace and current non-sexualized costume contract | `rnd_629b2ae3530468f7313ef7cc` |

## Redo wave 05

Requested: another 20 fresh regenerations. Rejected images were used only as
diagnostic evidence and were never supplied to the generator. The 20 candidates
below cleared the documented internal gate after 21 fresh attempts. One
technically valid but batch-repetitive Willow-Braid pose remains quarantined
under `work/redo-wave-05/quarantine/`. No Wave 05 candidate has been activated
or counted as user-approved.

Review sheet: `work/redo-wave-05/review-sheet.png`

Internal evaluation: `art-catalog/REDO-WAVE-05-EVALUATION.md`

| # | Source render ID | Concept | Complete correction contract | Staged candidate |
| --- | --- | --- | --- | --- |
| 01 | `rnd_dbb50d6e2a8ee1f2450f1d91` | Ash-Falchion Castellan | Replace the short wrong design with one full-length conventional falchion; correct adult proportions | `rnd_4027e1884fd24148791fc298` |
| 02 | `rnd_407e361dc6f83f79194282d4` | Briar-Fan Doña | Remove the fan and every effect; both hands visibly empty | `rnd_7abf9ec58519052d37fd536d` |
| 03 | `rnd_614a1a9453ef5266d4fd5785` | Crown-Barong Chatelaine | Replace the wrong weapon with one ordinary kitchen utility knife; correct adult proportions | `rnd_b465874a56ec4c0cb73e06a1` |
| 04 | `rnd_6e39d3482e8d0b9ea09b6c36` | Ember-Salver Matriarch | Remove the plate, smoke, and every effect; both hands visibly empty | `rnd_3e540e000366f815ae0b9b09` |
| 05 | `rnd_da015d0bda932f3a8226481c` | Thorn-Ledger Preceptress | Remove the book and every effect; both hands visibly empty | `rnd_464a0b7f3e0304b1d3158bd0` |
| 06 | `rnd_94a6d2a69a6112eda035ad8f` | Thorn-Spindle Widow | Replace the weird spindle weapon with one conventional flanged mace | `rnd_a1173c7f9aeeec04403a578d` |
| 07 | `rnd_e03268e8fd6d311097afe6ce` | Fern-Mantle Longsword Knight | Full measured hand-and-a-half longsword with both hands behind the guard | `rnd_7358cbe412bb79fd6bed524c` |
| 08 | `rnd_17f01a64b3e30b02bf9c3d80` | Ferncloak Greatsword Reeve | Rebuild both legs with aligned hips, knees, ankles, and separated feet | `rnd_84f90e25ec45a1c6a10acce2` |
| 09 | `rnd_7a23eaab31696911effcf319` | Green-Tabard Path Duelist | Full-length conventional sword and corrected adult proportions | `rnd_e19d2c2cb7a860c4fdf15765` |
| 10 | `rnd_10856f98614cf34d24242f70` | Grove-Spear Line Warden | Full body-length-plus straight spear with two separated shaft grips; correct proportions | `rnd_f76c491440b06ac9c2d6eb82` |
| 11 | `rnd_ff4978bdb7723896f71abf9c` | Moss-Bob Pursuit Duelist | Full measured longsword, coherent two-hand grip, and corrected adult proportions | `rnd_cf7253a0181699f64d7d7fb5` |
| 12 | `rnd_033b154296b967d7e6b732f7` | Moss-Sash Sword Warden | Full-length conventional straight sword; no dagger-like blade | `rnd_d3bea41cf2cc8a9707b115b6` |
| 13 | `rnd_c3f3e7b23bf197eb3018f88d` | Olive-Mantle Longsword Captain | Full measured longsword and corrected adult proportions | `rnd_0a319b5db820a6d070ee7c66` |
| 14 | `rnd_6b9b6bf183b5154ebfb0dfbc` | Verdant-Sleeve Longsword Freeblade | Full measured longsword with both hands behind the guard | `rnd_a0bdd5188ceb11c2540962c1` |
| 15 | `rnd_7f6ca33ca37706286d01f6a4` | Willow-Braid Counterguard | Full measured longsword, corrected adult proportions, and a unique high counterguard silhouette | `rnd_29ccf193dccfbef7fa393d58` |
| 16 | `rnd_b2c10a06d81e18da24160d8b` | Iron Spear Sentinel | Rebuild torso, hips, and limbs with coherent adult anatomy; one straight spear with two grips | `rnd_6ed43fc12c83d2966a4f3c15` |
| 17 | `rnd_24fa57e6b2b0514201af46d7` | Rice-Wake Reaper | Perfectly straight continuous scythe pole and corrected adult proportions | `rnd_8ff5313c8c26628be3f8af8a` |
| 18 | `rnd_ef326e3b9c4d442d43adc276` | Cord-Bound Widow | Remove the rope entirely and rebuild coherent adult proportions; both hands empty | `rnd_581ebe5f699d0be07b4c2e92` |
| 19 | `rnd_6f3d25845a141c78e13caeea` | Black-Gold Billhook Canoness | Replace the weird billhook with one conventional sabre; lean feminine anatomy | `rnd_a3390cad7450ed1df1e6a957` |
| 20 | `rnd_284d14544a25b21236895509` | Pearl Longsword Canoness | Lean graceful feminine anatomy without muscular or masculine bulk; coherent longsword grip | `rnd_e84f4ff8a3f22107e3289a80` |

## Single-active-render consolidation — 2026-07-30

The eight active redo slots now expose exactly one PNG each in the catalog.
Two additional pre-existing version-sibling pairs were also consolidated so
repository-wide duplicate enforcement could be enabled. Twelve older source or
failed-candidate files were moved out of the catalog and are now preserved in
tracked `archive/redo-history/`, keyed by their content-based render IDs. Original
ratings, defects, corrections, and source IDs remain unchanged in the review
exports and this tracker.

Future redo attempts must use `work/redo-staging/` and
`npm run redo:activate -- --candidate <staged-candidate-vNN.png>` so version
siblings never become additional review items.

## Automatic activation log

This machine-maintained log records atomic staging-to-catalog swaps. It does
not replace the user-review status tables above.

<!-- REDO-ACTIVATION-LOG:START -->
| Activated | Source render ID | Active render ID | Active path | Archived render IDs |
| --- | --- | --- | --- | --- |
| 2026-07-30T15:19:32.077Z | `rnd_ea106332a553a7e09c5f2495` | `rnd_5a021e9942208c12abd02199` | `public/art/enemies/blood-demon-knights-batch-37/drafts/01-blood-needle-duelist.png` | `rnd_f12d4380faf5290e0347f737`, `rnd_ea106332a553a7e09c5f2495` |
| 2026-07-30T15:19:32.078Z | `rnd_9e54937ec7e54ea511dcbaa9` | `rnd_ff5e05df4ff0f2b96166e127` | `public/art/enemies/blood-demon-knights-batch-37/drafts/02-vein-hook-arrestor.png` | `rnd_9e54937ec7e54ea511dcbaa9` |
| 2026-07-30T15:19:32.078Z | `rnd_c7086304834d0e56246f2b34` | `rnd_fc5f6ba8407c478a2b77f030` | `public/art/enemies/blood-demon-knights-batch-37/drafts/03-clot-sigil-bastion.png` | `rnd_c7086304834d0e56246f2b34` |
| 2026-07-30T15:19:32.079Z | `rnd_5c000ea727d632e34cbc4039` | `rnd_310e3cf3188f2e6fa5a51aab` | `public/art/enemies/blood-demon-knights-batch-37/drafts/08-sable-greatsword-pursuer.png` | `rnd_5c000ea727d632e34cbc4039` |
| 2026-07-30T15:19:32.080Z | `rnd_66146f6cd1c3762b2c5d7dcf` | `rnd_19e1d3cc1755e4124db2f99d` | `public/art/enemies/blood-demon-knights-batch-37/drafts/13-oxblood-greatsword-pursuer.png` | `rnd_66146f6cd1c3762b2c5d7dcf`, `rnd_3143fa6185e604d37e3a5cc9` |
| 2026-07-30T15:19:32.081Z | `rnd_56123c8c5799991409d21af1` | `rnd_499957581d3b5c3b18464c30` | `public/art/enemies/blood-priestesses-batch-39/drafts/04-oxblood-quarrel-canoness.png` | `rnd_56123c8c5799991409d21af1` |
| 2026-07-30T15:19:32.081Z | `rnd_8be24205e0d2fa7bc6fa16b7` | `rnd_ab73e4c0647b63d77df33f85` | `public/art/enemies/blood-priestesses-batch-39/drafts/06-oxblood-processional-mace-votary.png` | `rnd_8be24205e0d2fa7bc6fa16b7` |
| 2026-07-30T15:19:32.081Z | `rnd_ed68ff5784778fc9bd1ba19f` | `rnd_01e5ff20d7481b2605d28d6f` | `public/art/enemies/blood-priestesses-batch-39/drafts/07-ivory-lance-sepulchral-votary.png` | `rnd_ed68ff5784778fc9bd1ba19f` |
| 2026-07-30T15:30:35.491Z | `rnd_7f7438d945d008e9b4b0a913` | `rnd_6a0c867949f48deb4d4193c4` | `public/art/enemies/convent-tormentors-batch-30/drafts/11-ivory-axe-abbess.png` | `rnd_7f7438d945d008e9b4b0a913` |
| 2026-07-30T15:30:35.494Z | `rnd_1ae4f246cae548a0a9f4cf63` | `rnd_0d3df6952841fa33d2ebfb0a` | `public/art/enemies/crown-of-thorns-female-knights-batch-38/drafts/01-briar-point-justiciar.png` | `rnd_1ae4f246cae548a0a9f4cf63` |
| 2026-08-02T12:13:27.666Z | `rnd_3a772942133fac727eb7f7d0` | `rnd_9f0258cda2d8bcd1f736bd38` | `public/art/enemies/wealthy-spanish-vampire-wives-batch-46/02-velvet-rapier-condesa.png` | `rnd_3a772942133fac727eb7f7d0` |
| 2026-08-02T12:17:24.882Z | `rnd_d5321b2c21a1f020b4b8e25e` | `rnd_e4f550cecba279c45ee01bb5` | `public/art/enemies/combat-magic-batch-04/03-beetle-hexer.png` | `rnd_d5321b2c21a1f020b4b8e25e` |
| 2026-08-02T23:17:32.167Z | `rnd_fb706501c7c51d8c0951ca7f` | `rnd_083b15a53c9b75caffe17e80` | `public/art/enemies/convent-horrors-batch-37/30-powder-blue-burgundy-rosary-mourner.png` | `rnd_fb706501c7c51d8c0951ca7f` |
| 2026-08-02T23:18:51.226Z | `rnd_9947848753a285e902a63dce` | `rnd_afc2122d456c3757ab380567` | `public/art/enemies/skeleton-feudal-court-batch-39/12-three-arch-floodroad-king.png` | `rnd_9947848753a285e902a63dce` |
| 2026-08-02T23:20:01.944Z | `rnd_e8d822fb9853e4a390940706` | `rnd_8805078f33aacce5c3d4a46d` | `public/art/npcs/sex-workers-v01/03-fan-veiled-courtesan.png` | `rnd_e8d822fb9853e4a390940706` |
| 2026-08-02T23:21:36.097Z | `rnd_579de505c9ffd80eb556b301` | `rnd_4a61f86939ed2e8272aaec19` | `public/art/enemies/short-haired-inquisitors-batch-48/10-ash-crossbow-exactor.png` | `rnd_579de505c9ffd80eb556b301` |
| 2026-08-02T23:21:45.354Z | `rnd_5af432fcd64a6167af8981de` | `rnd_31f0c70afc084d5fbfb94124` | `public/art/enemies/experimental-haired-inquisitors-batch-51/03-raven-coil-prosecutor.png` | `rnd_5af432fcd64a6167af8981de` |
| 2026-08-02T23:21:56.933Z | `rnd_a0fa3c8a8b370f5f7ee36807` | `rnd_9ebbdf17cb3d54b28887fbee` | `public/art/enemies/experimental-haired-inquisitors-batch-51/01-ivory-cascade-interrogator.png` | `rnd_a0fa3c8a8b370f5f7ee36807` |
| 2026-08-02T23:22:15.146Z | `rnd_9ab1ad13ef9c01f177bc2f43` | `rnd_b127ffd9ea50c3f354543938` | `public/art/enemies/experimental-haired-inquisitors-batch-51/02-crimson-crown-castellan.png` | `rnd_9ab1ad13ef9c01f177bc2f43` |
| 2026-08-02T23:22:37.926Z | `rnd_7ab89f5cfeb172a6a02c3bcd` | `rnd_c257e485cd4368bfd06f0fe3` | `public/art/enemies/crown-of-thorns-female-knights-batch-38/06-thorn-mace-custodian.png` | `rnd_7ab89f5cfeb172a6a02c3bcd` |
| 2026-08-02T23:22:47.831Z | `rnd_a2b13b1c99baf3731ae4b598` | `rnd_d83b8139859f3f71ff275ef8` | `public/art/enemies/crown-of-thorns-female-knights-batch-38/03-root-hammer-penitent.png` | `rnd_a2b13b1c99baf3731ae4b598` |
| 2026-08-02T23:22:57.697Z | `rnd_244c53e40801eb99c100e57a` | `rnd_621cf2bc84ac703d3634d587` | `public/art/enemies/crown-of-thorns-female-knights-batch-38/08-crown-pick-adjudicator.png` | `rnd_244c53e40801eb99c100e57a` |
| 2026-08-02T23:23:06.980Z | `rnd_4d8a61bba27459567914cf84` | `rnd_3dc255bb761cb81b08b68a98` | `public/art/enemies/crown-of-thorns-female-knights-batch-38/09-chain-thorn-penitent.png` | `rnd_4d8a61bba27459567914cf84` |
| 2026-08-02T23:23:46.807Z | `rnd_487b73fed236d41d7fb57edf` | `rnd_3f240f1fcbe8adf3d9b9012d` | `public/art/enemies/convent-horrors-batch-37/24-lavender-ash-rose-war-pick-matron.png` | `rnd_487b73fed236d41d7fb57edf` |
| 2026-08-02T23:24:04.363Z | `rnd_ef5f73fdd8d55932795d9fca` | `rnd_ab307e60d2e7bc73fa8686f2` | `public/art/enemies/convent-horrors-batch-37/22-plum-amber-longsword-votary.png` | `rnd_ef5f73fdd8d55932795d9fca` |
| 2026-08-02T23:24:30.887Z | `rnd_ca81de08aef3e864c44c7846` | `rnd_637b31a72590ab5b5733b0f6` | `public/art/enemies/convent-horrors-batch-37/19-white-stake-vampire-sister.png` | `rnd_ca81de08aef3e864c44c7846` |
| 2026-08-02T23:24:53.345Z | `rnd_c338fe06bd79126af6968297` | `rnd_f15c8e20ffbed714283dbe52` | `public/art/enemies/convent-horrors-batch-37/09-cinder-sickle-widow.png` | `rnd_c338fe06bd79126af6968297` |
| 2026-08-02T23:27:23.693Z | `rnd_5c78cfadbe60bab0a632fe88` | `rnd_5ece063a9e2a19fea4860d16` | `public/art/enemies/catholic-evil-white-priests-batch-41/02-blackwater-aspergillist.png` | `rnd_5c78cfadbe60bab0a632fe88` |
| 2026-08-02T23:27:30.618Z | `rnd_ddb1b873a7b68087f826cae7` | `rnd_3a9c757208b282ca92e32261` | `public/art/enemies/blood-priestesses-batch-39/05-blood-diamond-hierophant.png` | `rnd_ddb1b873a7b68087f826cae7` |
| 2026-08-02T23:29:55.453Z | `rnd_ff4978bdb7723896f71abf9c` | `rnd_2a737b2f09a676cb89e5ba89` | `public/art/enemies/forest-elf-sword-knights-batch-35/18-moss-bob-pursuit-duelist.png` | `rnd_ff4978bdb7723896f71abf9c` |
| 2026-08-02T23:31:34.720Z | `rnd_e03268e8fd6d311097afe6ce` | `rnd_1e7b17c640f9ec008556fa02` | `public/art/enemies/forest-elf-sword-knights-batch-35/02-fern-mantle-longsword-knight-variant-01.png` | — |
| 2026-08-02T23:56:57.408Z | `rnd_614a1a9453ef5266d4fd5785` | `rnd_26abbcf69fba3f6a5273ce73` | `public/art/enemies/crowned-thorn-mistresses-batch-46/03-crown-barong-chatelaine.png` | `rnd_614a1a9453ef5266d4fd5785` |
| 2026-08-02T23:58:05.778Z | `rnd_6ecf94f7b4023416af651e16` | `rnd_7b7a60674ad77bf4da3cf643` | `public/art/enemies/wealthy-demonic-vampires-batch-38/04-reliquary-dowager.png` | `rnd_6ecf94f7b4023416af651e16` |
| 2026-08-02T23:58:56.103Z | `rnd_adcce7ece7764a4e439cea88` | `rnd_de3d75d44d5d938a978a1f41` | `public/art/enemies/veiled-warrior-nuns-batch-37/10-dove-black-battle-axe-witness.png` | `rnd_adcce7ece7764a4e439cea88` |
| 2026-08-03T03:51:01.835Z | `rnd_7f6ca33ca37706286d01f6a4` | `rnd_29ccf193dccfbef7fa393d58` | `public/art/enemies/forest-elf-sword-knights-batch-35/17-willow-braid-counterguard.png` | `rnd_7f6ca33ca37706286d01f6a4` |
<!-- REDO-ACTIVATION-LOG:END -->

## Status values

- `awaiting-review`: generated and internally checked, but not user-approved.
- `approved`: the user accepted the redo.
- `redo-again`: the user found a remaining or new defect.
- `superseded`: replaced by a later redo candidate.
