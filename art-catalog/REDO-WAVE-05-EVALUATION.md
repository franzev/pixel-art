# Redo Wave 05 Internal Evaluation

Date: 2026-07-31

Status: 20 internally passing candidates staged for user review. Nothing in
this wave is activated or approved.

## Method

- Reconstruct every candidate from a fresh text prompt. Do not supply a
  rejected render as an edit target or visual reference.
- Convert every confirmed defect and next-attempt instruction into a visible
  pass/fail condition.
- Inspect the full-resolution render and a nearest-neighbor 256-pixel preview.
- Keep failed attempts outside `work/redo-staging/`.
- Stage one candidate for each source render ID and check the final set for
  identical content and repeated pose, face, costume, and equipment patterns.

## Equipment evidence used

- Falchion, Italian (Venice), ca. 1490, 91.4 cm overall:
  https://www.metmuseum.org/art/collection/search/24904
- Hand-and-a-half sword, probably German, 124.8 cm overall and 97.8 cm blade:
  https://www.metmuseum.org/art/collection/search/27966
- Spear of Emperor Ferdinand I, German, 1558, 257.8 cm overall and 33 cm head:
  https://www.metmuseum.org/art/collection/search/22202
- Flanged mace, Italian, ca. 1575–1600, 58.6 cm overall:
  https://www.metmuseum.org/art/collection/search/32223
- Romano-British utility knife, 21.3 cm overall, slightly arched back and
  convex edge:
  https://www.britishmuseum.org/collection/object/H_1903-0214-14_1
- Late Anglo-Saxon iron scythe blade, 38 cm blade plus 8.5 cm tang:
  https://www.britishmuseum.org/collection/object/H_1912-0723-5

The references inform scale, component count, joins, blade profile, and grip
mechanics. They are not supplied to image generation and are not copied as
exact designs.

## Result matrix

| # | Source render ID | Targeted defect gate | Result |
| --- | --- | --- | --- |
| 01 | `rnd_dbb50d6e2a8ee1f2450f1d91` | Full-length conventional falchion; adult proportions | pass |
| 02 | `rnd_407e361dc6f83f79194282d4` | No fan and no effects; both hands empty | pass |
| 03 | `rnd_614a1a9453ef5266d4fd5785` | Ordinary kitchen knife; adult proportions | pass |
| 04 | `rnd_6e39d3482e8d0b9ea09b6c36` | No salver, smoke, or effects; both hands empty | pass |
| 05 | `rnd_da015d0bda932f3a8226481c` | No book or effects; both hands empty | pass |
| 06 | `rnd_94a6d2a69a6112eda035ad8f` | Conventional flanged-mace replacement | pass |
| 07 | `rnd_e03268e8fd6d311097afe6ce` | Full measured longsword; two-hand grip | pass |
| 08 | `rnd_17f01a64b3e30b02bf9c3d80` | Coherent hips, knees, ankles, and separated feet | pass |
| 09 | `rnd_7a23eaab31696911effcf319` | Full sword; adult proportions | pass |
| 10 | `rnd_10856f98614cf34d24242f70` | Full straight spear; two grips; adult proportions | pass |
| 11 | `rnd_ff4978bdb7723896f71abf9c` | Full longsword; two-hand grip; adult proportions | pass |
| 12 | `rnd_033b154296b967d7e6b732f7` | Full conventional sword; no dagger-like blade | pass |
| 13 | `rnd_c3f3e7b23bf197eb3018f88d` | Full longsword; adult proportions | pass |
| 14 | `rnd_6b9b6bf183b5154ebfb0dfbc` | Full longsword; both hands behind guard | pass |
| 15 | `rnd_7f6ca33ca37706286d01f6a4` | Full longsword; adult proportions; unique silhouette | pass on attempt 2 |
| 16 | `rnd_b2c10a06d81e18da24160d8b` | Coherent torso, hips, and limbs; full straight spear | pass |
| 17 | `rnd_24fa57e6b2b0514201af46d7` | Ruler-straight continuous scythe pole; adult proportions | pass |
| 18 | `rnd_ef326e3b9c4d442d43adc276` | No rope; coherent adult proportions; empty hands | pass |
| 19 | `rnd_6f3d25845a141c78e13caeea` | Conventional sabre; lean feminine anatomy | pass |
| 20 | `rnd_284d14544a25b21236895509` | Lean feminine anatomy without muscular bulk | pass |

## Batch checks

- 20 staged files, all square 1254 × 1254 full-quality originals.
- 20 distinct SHA-256 hashes; no identical files within the wave.
- No staged file is identical to a current public catalog PNG.
- The review sheet contains only these 20 candidates.
- Face, hair, stance, costume mass, and weapon direction were checked across
  the full sheet. Willow-Braid attempt 1 was removed because its low guard read
  too similarly to Verdant-Sleeve at 256 pixels.

Review sheet: `work/redo-wave-05/review-sheet.png`

## Quarantined attempts

| File | Reason |
| --- | --- |
| `17-willow-braid-counterguard-pass01-repeated-low-guard.png` | Individually valid, but its low guard and wide stance repeated another Wave 05 silhouette too closely |

The quarantined file remains outside staging and must not be activated,
reviewed as a candidate, or counted as a canonical asset.
