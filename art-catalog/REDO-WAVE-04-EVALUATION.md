# Redo Wave 04 Internal Evaluation

Date: 2026-07-31

Status: 20 internally passing candidates staged for user review. None are
activated or approved.

## Method

- Generated each candidate from a reconstructed text prompt; no rejected image
  was supplied as an edit target or visual reference.
- Converted every confirmed feedback item into a visible pass/fail condition.
- Checked the full-resolution render and a nearest-neighbor 256-pixel preview.
- Kept failed attempts out of `work/redo-staging/`.
- Checked the 20 staged files for identical SHA-256 content; no duplicates were
  found.
- Checked silhouette, pose, costume, face, and equipment variation across the
  sheet rather than evaluating each render only in isolation.

Review sheet: `work/redo-wave-04/review-sheet.png`

## Equipment evidence used

- Rapier, Italian, ca. 1540, 110.2 cm overall and 97.2 cm blade:
  https://www.metmuseum.org/art/collection/search/35679
- Mace, Italian, ca. 1575–1600, 58.6 cm overall with a 16.4 cm head:
  https://www.metmuseum.org/art/collection/search/32223
- War hammer/pick, German, mid-16th century, 50.2 cm overall:
  https://www.metmuseum.org/art/collection/search/33853
- Roundel dagger, South German, 33.2 cm overall and 18.1 cm blade:
  https://www.metmuseum.org/art/collection/search/34080
- Hand-and-a-half sword, probably German, 124.8 cm overall and 97.8 cm blade:
  https://www.metmuseum.org/art/collection/search/27966
- Halberd, Italian, 1500–1525, 235.6 cm overall:
  https://www.metmuseum.org/art/collection/search/23210
- Halberd, German, ca. 1650, 201.9 cm overall:
  https://www.metmuseum.org/art/collection/search/25887
- Military flail, possibly German, 49.5 cm overall:
  https://www.metmuseum.org/art/collection/search/33867
- Iron sickle, 23.5 cm blade:
  https://www.britishmuseum.org/collection/object/A_1880-1224
- Spanish silver chalice, 24.1 cm high:
  https://www.metmuseum.org/art/collection/search/192002

The references informed scale, component count, joins, and grip mechanics. They
were not supplied to image generation and were not copied as exact designs.

## Female identity separation

The fourteen women were specified with different combinations of age, face
shape, jaw/chin, eye placement and shape, brow shape, nose structure, mouth
shape, and hair/veil construction. Examples include the Burnt-Rose woman's
broad oval face and low bun; Cinder Widow's narrow heart face and shoulder
waves; Indigo Votary's long diamond face and pinned braid; Lavender Matron's
square older face and silver braided crown; Moon-Veil Sister's elongated oval
face and aquiline nose; and Cream Sacristan's pear-shaped young face and side
braid. The review sheet was checked for repeated face templates as well as
repeated poses.

## Result matrix

| # | Candidate render ID | Targeted defect gate | Result |
| --- | --- | --- | --- |
| 01 | `rnd_1aa782c8fd24381784c95891` | Rigid spiked morning star; no club or chain | pass |
| 02 | `rnd_d0f7ef0897a38bde5fdc0b8d` | No tattoo or skin marking | pass |
| 03 | `rnd_1c959ed8c7f32680ddea57d0` | Spiked ball and coherent single chain | pass |
| 04 | `rnd_5d0510f1ee273ce7e3e3a267` | Correct thumbs and two shaft grips | pass |
| 05 | `rnd_e8f62aedcb9f1902530a2f74` | Full-length straight rapier | pass |
| 06 | `rnd_8a667eaa339ac54672631bd0` | Straight full mace; aligned legs | pass |
| 07 | `rnd_5741be75da789c953610e34b` | Both hands behind guard; no blade grip | pass |
| 08 | `rnd_a2f14d3a63fee408000f8203` | Mature non-stretched proportions | pass |
| 09 | `rnd_e5847c3ff4f0fe2638a79c3d` | Mature proportions; coherent stake grip | pass |
| 10 | `rnd_a2a748dcd1019a9f5723dc93` | Compact pick; free hand clear | pass |
| 11 | `rnd_19e655536b9583738c888119` | Straight rondel blade | pass |
| 12 | `rnd_b7837816fbf213457c1880d4` | Conventional replacement weapon; coherent fingers | pass |
| 13 | `rnd_78202cd0c65d917dd424bd93` | Ruler-straight spear | pass |
| 14 | `rnd_52ec83db2bca6b09418b3c05` | Simple halberd; both hands on shaft | pass on attempt 2 |
| 15 | `rnd_00587d5451074e9652b328af` | Halberd replacement; both hands on shaft | pass on attempt 3 |
| 16 | `rnd_f720c523a264e0cc4f6281f9` | Full sword; skeletal hands on grip | pass |
| 17 | `rnd_d3e122ea21d8fe82d231231f` | Straight full lance; two grips | pass |
| 18 | `rnd_9bcd0a2c015d87ef6c03f24b` | Dry chalice; no drops or effects | pass |
| 19 | `rnd_af7b9f39b0b29a13f8183416` | Unique overhead pose; blade clear of body | pass |
| 20 | `rnd_629b2ae3530468f7313ef7cc` | Full mace; closed non-sexualized costume | pass |

## Quarantined attempts

| File | Reason |
| --- | --- |
| `14-ash-monstrance-pikeman-pass01-one-hand-only.png` | Only one hand contacted the halberd shaft |
| `15-collar-crook-gaoler-pass01-one-hand-only.png` | Only one hand contacted the halberd shaft |
| `15-collar-crook-gaoler-pass02-lower-fist-not-gripping.png` | Lower fist remained adjacent to rather than wrapped around the shaft |

These files remain outside staging and must not be activated, reviewed as
candidates, or counted as canonical assets.
