# Principal Bosses v01 — Draft Status

**Status:** Eight unapproved first-pass boss concepts ready for user review  
**Generated:** 2026-07-28  
**Retained assets:** 0  
**Lore/count changes:** None  
**Generation workflow:** Built-in image generation, one separate image per boss

## Purpose

This collection proposes eight principal bosses that form the dramatic spine of
the Ashen Provinces. The roster mixes existing enemy-family foundations with new
story antagonists rather than treating bosses as enlarged regular enemies.

These are concept masters and 256 × 256 review references. They are not native
game sprites, animation sheets, collision-ready assets, or canonical lore until
the user explicitly approves individual designs.

## Draft roster

| # | Boss | Story role | Core encounter identity |
| --- | --- | --- | --- |
| 01 | Drowned Tithemother | Flooded-market guardian | Water debt, bell pulls, and glimpses of the resisting person inside |
| 02 | First Severance | Ancestral Manananggal leader | Roof-skimming pursuit followed by an airborne eclipse phase |
| 03 | Bride of the Unreturned Road | Ancestral White Lady | Mirror doubles, extinguished lanterns, and recognition instead of mandatory destruction |
| 04 | Minister of Last Confessions | Blood Ministry authority | Verdicts, delayed chains, and a ritual-cage transformation |
| 05 | Marshal Beneath the Balete | Green Host commander tied to the Knight | Disciplined spear duel followed by a planted-banner oath phase |
| 06 | Saint of the Empty Belfry | Colossal cathedral guardian | Bell shockwaves followed by zones of supernatural silence |
| 07 | Hand Without a Rope | Mortal instigator of the Silent Toll | Conducted sound and silence followed by direct Hollow Country control |
| 08 | Door at the End of All Roads | Optional Hollow Country superboss | Replayed attack memories followed by a starless threshold phase |

## Saved files

Every active draft has:

- `drafts/<NN>-<slug>-source.png` — full 1254 × 1254 generated source
- `drafts/<NN>-<slug>-reference-256.png` — 256 × 256 nearest-neighbor reference

Batch comparison:

- `art-catalog/review-sheets/bosses/principal-bosses-v01/drafts/principal-bosses-v01-draft-review-sheet.png` — 2048 × 256,
  numbered in roster order

Prompt record:

- `GENERATION-PROMPTS.md`

Fresh-session handoff:

- `CONTINUATION-PROMPT.md`

## Visual review

- [x] Eight distinct silhouettes remain readable on the 256 review sheet.
- [x] Every active source uses a warm near-black background and never a green
      background.
- [x] Every active concept presents exactly one principal boss.
- [x] Props, wings, major limbs, and trailing elements remain on canvas.
- [x] The First Severance has two arms and two back-mounted wings rather than
      arm-wings.
- [x] The Saint of the Empty Belfry reads as a constructed guardian with one
      central bell.
- [x] The corrected Door at the End of All Roads has exactly four legs.
- [x] Sources and nearest-neighbor 256 references are saved separately.
- [ ] User approval is still required for every individual design.
- [ ] Exact native frame sizes, pivots, baselines, palettes, and phase animation
      budgets remain undecided.
- [ ] Generated source micro-shading and subtle background falloff must be
      simplified during deliberate native-grid construction.

## Rejected pass

The first Door at the End of All Roads generation had a strong concept but
failed the anatomy gate by adding more than four legs. Its source and 256
reference are preserved under:

`drafts/rejected/08-door-at-the-end-of-all-roads-pass01-extra-legs-*`

It is excluded from the active roster and review sheet.

## Promotion gate

Do not move files out of `drafts/`, create a retained manifest, update the enemy
lore compendium, change canonical counts, or call these production sprites until
the user has reviewed and explicitly approved the individual bosses.

After selection:

1. revise only the bosses the user identifies;
2. establish gameplay scale and native frame dimensions per boss;
3. redraw approved concepts deliberately on native pixel grids;
4. define phase silhouettes, pivots, collision shapes, and attack readability;
5. create a retained manifest and boss lore only after final approval.
