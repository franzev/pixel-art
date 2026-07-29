# Left-Facing Pose Tests v01

**Status:** Draft pose studies, not canonical native sprites  
**Created:** 2026-07-28

## Purpose

Test how three retained enemy concepts translate into screen-left gameplay poses
for a gothic side-scrolling Metroidvania.

These images preserve the approved concept masters. They do not replace the
retained sources, references, manifests, or lore entries.

## Drafts

1. **Crooked Bellman**
   - Source identity: retained collection 01, asset 03
   - Result: strong left-facing grounded silhouette
   - Preserved: bent posture, patched work clothes, two wrist bells
   - Native v02 draft:
     `drafts/01-crooked-bellman-left-facing-v02-native-96x96.png`
   - Preview:
     `drafts/01-crooked-bellman-left-facing-v02-preview-6x.png`
   - Validation: 96 × 96 transparent canvas, 39 × 72 occupied bounds, top row
     19, bottom baseline row 90, 15 opaque colors, no partial alpha
   - Remaining review: confirm that the hands, feet, and two bells are readable
     enough at actual gameplay scale before producing a four-to-six-frame idle

2. **Roadside White Lady**
   - Source identity: retained White Lady batch 05, asset 01
   - Result: strong left-facing cloth silhouette with lantern leading
   - Preserved: mourning dress, black hair, one cold lantern, bare feet
   - Chunky native blueprint v02: rejected as a style direction because the
     oversized logical blocks made the character too cartoony
   - Medium-density v03 study:
     `drafts/02-roadside-white-lady-left-facing-medium-density-v03-source.png`
   - Medium-density v03 reference:
     `site/public/art/enemies/left-facing-pose-tests-v01/drafts/02-roadside-white-lady-left-facing-medium-density-v03-reference-256.png`
   - Status: pending user review before native conversion
   - Intended native follow-up: use a 96 × 96 frame with mature 7.5-head
     proportions and separate body, lantern, hair, and dress-tail motion

3. **Roof-Hunter Manananggal**
   - Source identity: retained Manananggal batch 06, asset 01
   - Result: strong horizontal left-facing flight silhouette
   - Preserved: separated torso, two arms, two back-mounted wings, indigo blouse,
     scarlet wing veins
   - Chunky native blueprint v02: rejected as a style direction because the
     oversized logical blocks made the character too cartoony
   - Required revision: manually verify and simplify the trailing waist ribbons
     to exactly four before promotion
   - Medium-density conversion paused until the White Lady v03 density is
     approved
   - Intended native follow-up: use a wider flying frame with a fixed torso
     pivot and six-frame wing cycle

## File roles

- `drafts/*-source.png` — full generated pose-study source
- `drafts/*-reference-256.png` — nearest-neighbor 256 × 256 draft reference
- `drafts/*-native-96x96.png` — deliberately constrained native draft
- `drafts/*-preview-6x.png` — nearest-neighbor preview on warm charcoal
- `left-facing-pose-tests-v01-draft-review-sheet.png` — three references in one
  768 × 256 comparison row

## Promotion rule

Do not treat these pose studies as native game sprites. A selected study must be
redrawn deliberately at its native pixel grid, reviewed at 1×, given a stable
pivot or baseline, and approved before animation frames are produced.
