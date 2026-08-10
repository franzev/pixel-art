# The Ashen Archive

This repository is both the pixel-art workspace and its searchable review
gallery. The website runs directly from the repository root.

## Gallery-wide art-direction scope

The gallery is a multi-style archive, not a single Filipino, Philippine,
1970s, or folk-craft art direction. No culture, country, decade, costume
tradition, material, or decorative motif is a gallery-wide default.

Apply a cultural or period influence only when the user's current brief or the
selected collection explicitly requires it. In particular, do not add banig
weave, abaca, capiz, Filipino clothing, Philippine folklore, colonial-period
details, or 1970s styling to a knight, creature, character, environment, or
scene merely because those elements appear elsewhere in the archive.

Named themed collections remain valid records of their own direction. Their
prompts and positive references do not govern unrelated collections. When a
brief is culturally or historically unspecified, default to an original,
grounded gothic or dark-fantasy treatment and derive identity from the subject,
role, silhouette, materials, and requested setting—not borrowed regional
motifs.

## Repository layout

- `public/art/` — the only permanent location for full-quality catalog renders.
- `app/`, `db/`, `scripts/`, and `worker/` — the gallery and review application.
- `collections/` — category and collection records: prompts, status files,
  manifests, and review notes. These folders contain no renders.
- `samples/` — intentional visual references and generation inputs.
- `art-catalog/` — exported review decisions, distilled generation lessons, and
  generated review sheets.
- `archive/legacy-art/` — quarantined legacy images awaiting explicit
  classification; never use these as active renders or positive references.
- `archive/redo-history/` — durable, non-catalog history for superseded redo
  bitmaps, keyed by content-based render ID.
- `archive/render-attempts/` — durable, non-catalog history of every raw
  generator result, including first, second, third, and internally rejected
  attempts.
- `work/` — ignored local outputs, temporary files, and backups.
- `ORGANIZATION.md` — canonical folder, filename, and generation workflow.

## Canonical specifications

- `ASSET-SPEC.md` — Crimson Knight proportions, equipment, native scale, facing
  direction, cape, sword, and animation baseline.
- `ENEMY-ASSET-SPEC.md` — Enemy and folklore-creature art direction, palette,
  batch workflow, folder structure, filenames, 256 × 256 references, manifests,
  review sheets, approvals, and lore updates.
- `collections/enemies/ENEMY-LORE-COMPENDIUM.md` — Working world canon and gameplay identity
  for retained enemy designs.
- `collections/enemies/ENEMY-ART-DIRECTION-FEEDBACK.md` — Durable user preferences,
  rejected directions, strongest positive references, and batch workflow
  lessons. Read this before proposing or generating a new enemy batch.
- `RENDER-PROMPT.md` — Router that loads only the render contracts relevant to
  the current request.
- `render-contracts/` — Focused shared, category, and workflow contracts used by
  the render router.
- `render-contracts/EQUIPMENT-RESEARCH.md` — Mandatory authoritative-reference,
  handle-construction, grip, socket, shield-back, and crossbow-hand research
  gate for any armed character.
- `art-catalog/REVIEW-LEARNINGS.md` — Distilled, confirmed lessons from the
  user's bulk render review (weapon rules, prohibited spell effects, current
  positive anchors, cleared-out directions). Mandatory reading before writing
  any generation prompt. The adjacent `RENDER-FEEDBACK.md` and
  `render-feedback.jsonl` are machine exports — never hand-edit them.

## Non-negotiable project rules

1. Every future original full-quality generated render uses a square `1:1`
   canvas in every category, including characters, creatures, bosses,
   environments, and narrative scenes. State `square 1:1 canvas; output width
   must equal output height` in every generation prompt, select a `1:1` output
   setting when the generator exposes one, and verify the returned PNG's actual
   pixel width equals its height before saving. Reject and regenerate a
   non-square result; do not crop, stretch, or pad it into compliance.
   Historical renders are not retroactively altered. Deliberately authored
   native sprites, animation sheets, environment plates, and review composites
   may use their specified production dimensions; they are derived production
   artifacts, not exceptions for a generated source render.
2. Every future isolated concept render and opaque preview uses one perfectly
   uniform warm-charcoal background: `#171311`. Do not substitute another
   near-black, tint, gradient, vignette, floor, or cast shadow. Native
   production sprites remain transparent, and intentionally illustrated
   environments or narrative scenes are exempt. Never use a green background.
3. Generate each distinct asset separately rather than placing multiple concepts
   in one generated image.
4. After the normal viability checks, save the original full-quality render
   once at `public/art/<category>/<collection>/<NN>-<slug>.png` so it is
   immediately available in the review website. Do not put new generations in
   a `drafts/` folder.
5. Website availability is not approval. A newly saved render remains
   unapproved until the user reviews it; do not promote it to lore, approval
   manifests, canonical counts, or production-ready status beforehand.
6. Do not create separate catalog `-source` or `-reference-256` copies. The
   ordered raw files under `archive/render-attempts/` are the intentional
   non-catalog exception for distinct generator attempts.
7. A catalog render is not automatically a native game sprite.
8. Review anatomy, silhouette, palette, and artifacts at 256 pixels before marking
   an asset retained.
9. Do not add rejected or deleted generations to the lore or canonical counts.
10. Do not copy the Penitent One's costume, pose, proportions, helmet, or
   silhouette. It is a pixel-treatment reference only.
11. Before prompting any weapon, shield, or weapon-like tool, complete the
   authoritative-reference gate in `render-contracts/EQUIPMENT-RESEARCH.md`.
   Never guess a handle, hilt, socket, strap system, or trigger mechanism.
   Render researched dimensions and construction with visible, mechanically
   correct hand contacts. Any unverifiable, hidden, invented, bent, misaligned,
   or incorrectly held handle is an automatic rejection. For longswords,
   greatswords, zweihänders, and other oversized swords, every gripping hand
   must remain entirely on the researched grip between guard and pommel. Reject
   blade, forte, or ricasso gripping, half-swording, mordhau poses, a hand
   crossing the guard, or a grip too short to contain both hands.
12. Never generate visible spells or spell-like effects. This is a project-wide
    hard prohibition: no floating magic, auras, sigils, orbs, magical
    projectiles, elemental emissions, droplets, threads, smoke wisps, or
    ambient particles. A caster or supernatural role must read through physical
    design, equipment, posture, materials, and silhouette instead.
13. Adult female characters use tall but plausible feminine proportions:
    approximately 7.5–8 heads high, long realistic legs, a balanced torso,
    moderately defined waist, and hips only modestly wider than the shoulders.
    Keep the chest naturally proportionate—never oversized—and avoid
    sexualized anatomy, extreme hourglass shapes, pin-up posture, cleavage
    emphasis, or vacuum-sealed clothing and armor.
14. Female characters must not reuse the same face. Vary facial structure and
    hairstyle independently across every batch. Short hair is allowed when it
    retains a clearly feminine silhouette. Because the setting is war-torn,
    hairstyles must be simple, low-maintenance, and battle ready: tied, pinned,
    braided, wrapped, tucked, or cut short enough to stay clear of the eyes,
    armor joints, weapon hands, shield grips, and crossbow mechanisms. Avoid
    elaborate braided crowns, towering or sculpted buns, cascading salon curls,
    ornate hair jewelry, flowers, ribbons, excessive pins, dramatic windblown
    volume, buzz cuts, shaved-side undercuts, mohawks, high-and-tight cuts,
    graphic shaved patterns, neon or multicolor fantasy dyes, and other
    impractical or overtly contemporary statement styling. Do not assign or
    infer sexual orientation from appearance; isolated character concepts
    default to no romantic or relationship signaling.
15. Every female character must read as an attractive, unmistakably adult young
    woman, normally with an apparent age of approximately 21–35. Build
    attractiveness through harmonious but individually varied facial
    structure, clear readable eyes, well-formed features, groomed
    setting-compatible hair, and a composed or character-appropriate
    expression—not sexualized anatomy, glamour-filter sameness, or juvenile
    cues. Her face must read as distinctly feminine through its overall
    combination of jaw, chin, brow, eyes, cheeks, mouth, and neck. Reject a
    deliberately masculine or heavily androgynous construction dominated by a
    pronounced brow ridge, very broad square jaw, oversized blocky chin, heavy
    low brows, coarse angular planes, or thick masculine neck. Preserve varied
    varied brief-appropriate facial structures, skin tones, noses, and eye
    shapes rather than forcing one generic feminine face or ethnicity. Reject
    any teenager, schoolgirl coding, childlike head-to-body ratio, immature
    facial structure, or age-ambiguous result.
16. Never treat the fixed `#171311` background as permission to tint the
    subject. Do not apply any global color filter or grade, especially a
    yellowish, sepia, tobacco-brown, bronze, copper, amber, grey-black,
    desaturated, or uniformly warm/cool cast. Default to a neutral color
    balance and vibrant, clearly separated local color ramps for metal, cloth,
    leather, wood, skin, and accents. Blackened metal, soot cloth, brown
    leather or wood, tiny bronze highlights, and warm rim lighting are one
    optional palette family, not the default gallery look.
17. Every future directional subject has a slight screen-right bias from the
    viewer's perspective. `Right-facing` means a mostly frontal, shallow
    **front** three-quarter view—not a complete side profile or a view from
    behind. Keep the camera-facing facial plane readable. When the face is not
    intentionally covered, show both eyes, the nose, mouth, chin, and
    expression; the gaze may glance right without turning the face away. Turn
    the head and upper torso only enough for the leading action, locomotion,
    attack, and carried equipment to favor the right edge. Do not use a
    90-degree profile, rear three-quarter view, back-of-head view, ear-only
    view, far-cheek sliver, or edge-on torso unless explicitly requested. Hair,
    cloth, or a cape may trail toward screen-left. Do not accept the wording
    `right-facing` as proof by itself: the forward knee and leading foot,
    weight transfer, attack line, and weapon head or active end must visibly
    favor screen-right, while the rear leg and loose cloth may trail
    screen-left. Reject and regenerate any result whose dominant locomotion or
    equipment cue still leads left. Do not mirror a result to repair facing;
    preserve asymmetric shoulders, scars, garments, handed props, and
    ornaments on their original screen sides. This project-wide
    clarification supersedes every older screen-left or stronger side-profile
    instruction. A genuinely
    non-directional prop, environment, or abstract composition must record why
    facing is not applicable in its QA plan.
18. Preserve every raw generator output before evaluating or retrying it. Use
    `npm run render:save-attempt` so attempts receive ordered, non-overwriting
    `attempt-01.png`, `attempt-02.png`, and later filenames under
    `archive/render-attempts/`. A failed or superseded attempt stays available
    for comparison but never enters the catalog, lore, or canonical counts
    unless it is later selected and passes the normal render gate.
19. A redo, regeneration, correction, or reference-based revision preserves the
    same character identity. Match the source character's visible skin tone and
    undertone, facial structure, hair texture, age, and culturally or
    ethnically specific appearance. Do not lighten, darken, or change racial or
    ethnic appearance unless the user explicitly requests that change. When
    the source conceals or leaves those traits ambiguous, preserve the
    ambiguity; do not invent a new identity from the character's name, role,
    costume, faction, or setting. This identity lock applies to redos and does
    not impose a racial exclusion or default on newly designed characters.
20. Redos use fresh whole-image generation from a self-contained, complete
    visual description of the source. Do not mirror, composite, recolor,
    replace backgrounds, script-inpaint, or otherwise manipulate pixels to
    repair a render. The prompt must lock face covering, identity, build,
    proportions, unaffected pose, silhouette, garment topology, local palette,
    materials, accessories, footwear state, equipment outside the named
    correction, framing, and pixel treatment. Change only the confirmed defect;
    reject every unrelated redesign.

## Continuing work

Read the selected collection's `STATUS.md` and manifest before resuming it.
Collection records are located at
`collections/<category>/<collection>/`.
Collection status files take precedence over older continuation notes elsewhere.
When a collection contains `POSITIVE-REFERENCE-NOTES.md` or
`REJECTION-NOTES.md`, both are mandatory continuation reading. Follow their
visual anchors, guardrails, and approval checkpoints before generating new
assets.

## Using the gallery

The gallery has two directly accessible views:

- **Catalog** contains active review renders under `public/art/`.
- **History** contains every preserved raw generator attempt, including failed
  and superseded attempts under `archive/render-attempts/`.

Every generator result must appear in History immediately after it is saved;
do not wait for the rest of the wave. `npm run render:save-attempt` normally
refreshes the generated attempt index. Run `npm run sync:attempts` if a new
attempt is missing, and keep `npm run dev` running so the website can refresh.
History visibility is not approval. A selected render appears in Catalog only
after it passes the executable render gate and is saved at the collection root.

Install dependencies and start the local gallery from this directory:

```bash
npm install
npm run dev
```

The catalog refreshes when PNGs are added, changed, moved, or removed under
`public/art/`. It can also be refreshed manually:

```bash
npm run sync:art
npm run build
```

`sync:art` rejects version siblings that would create duplicate review items.
Activate a staged redo with `npm run redo:activate` instead of copying another
version into `public/art`.

The Review view supports ratings, keep/reject/delete decisions, defects,
correction notes, duplicate links, and keyboard navigation. Confirmed review
memory is exported to:

- `art-catalog/RENDER-FEEDBACK.md`
- `art-catalog/render-feedback.jsonl`

Apply confirmed deletion marks with a dry run first:

```bash
npm run delete:marked
npm run delete:marked -- --apply
```

The command validates that every live target is a unique, tracked PNG below
`public/art/` and refuses modified, untracked, non-file, symlink, or unsafe
paths. It removes only live catalog files through Git; already-absent files and
machine-maintained review history remain untouched.

The contact sheet defaults to active renders. Lifecycle-rejected history is
available through the `Rejected history` filter and is excluded from the
Unreviewed queue, so archived versions never require another manual review.
