# Infernal Demons Batch 11 — Fresh-Session Generation Prompt

**Workflow:** Built-in image generation, one separate call per design  
**Status:** Prompt-only; no assets generated or approved  
**Prepared:** 2026-07-28

Paste the following prompt into a fresh Codex session:

---

Work in `/Users/franz/Work/Personal/me`.

Before generating anything, read these files completely:

1. `pixel-art/README.md`
2. `pixel-art/ENEMY-ASSET-SPEC.md`
3. `pixel-art/enemies/infernal-demons-batch-11/GENERATION-PROMPTS.md`
4. `pixel-art/enemies/infernal-demons-batch-11/STATUS.md`

Inspect these two approved references only for the project's warm-dark staging,
connected shapes, and small-character readability:

- `public/art/enemies/cultists-demons-batch-02/11-candlehorn-familiar-reference-256.png`
- `public/art/enemies/cultists-demons-batch-02/17-ashback-stag-reference-256.png`

Generate 15 original infernal demon enemies for a 2D gothic Metroidvania.
The desired mood is aggressive, grim, bestial, and hell-spawned: imps,
goat-headed demons, flesh-pink fiends, red-skinned hunters, blackened horns, and
ember-lit brutes. This is broad grimdark inspiration only. Do not reproduce or
closely imitate any recognizable Warhammer creature, faction, symbol, weapon,
armor, silhouette, name, or color arrangement. Do not use protected faction
names or direct equivalents such as Bloodletter, Pink Horror, Daemonette,
Nurgling, Khorne, Tzeentch, Slaanesh, or Nurgle.

Generate each design from scratch with one image-generation call per creature.
Do not place several designs in one generated image. If anatomy, palette,
silhouette, or equipment fails, regenerate that creature from the written
prompt rather than repeatedly editing a broken result.

## Shared art direction

Create genuine direct-to-grid pixel art, not a digital painting reduced through
a pixel filter. Use hard square pixels, clean stepped edges, large connected
clusters, readable shadow masses, deliberate negative space, and selective
one-pixel highlights. Use minimal purposeful dithering only where it clarifies
heat or rough hide.

Use a perfectly plain warm near-black `#171311` background. Never use a green
background. No scenery, ground plane, vignette, smoke-filled backdrop, border,
text, UI, logo, or watermark.

Keep the palette restrained:

- Base shadows: soot black, charcoal, dark burgundy, burnt umber
- Red hide: deep crimson, iron red, restrained scarlet
- Flesh-pink hide: bruised mauve, raw pink, pale salmon
- Ember: copper orange, hot orange, small gold-yellow cores
- Horns and claws: dirty bone, smoke grey, blackened tips
- Equipment: black iron, aged brass, charred wood

Use approximately 14–18 meaningful colors for physical creatures and no more
than 18–20 for magic-heavy creatures. Use only two or three shades per material.
Ember light may occupy 10–20% of a sprite. Do not shade every surface with a
smooth ramp, and do not make every demon bright red from head to toe.

Flesh-pink means intact supernatural hide, not exposed human anatomy. Use
stylized seams, folds, ribs, or taut skin only as large readable clusters. Avoid
exposed organs, intestines, flaying, realistic wounds, human victims, torture
imagery, or wet photorealistic gore. Small stylized blood or saliva accents are
allowed only when specified.

Every creature must have a complete coherent silhouette with exact anatomy as
stated in its individual prompt. Never add accidental heads, faces, arms,
hands, legs, feet, wings, horns, tails, weapons, chains, or flames. Horns must
attach clearly to the skull. Back-mounted wings must not replace arms. Held
weapons must have readable grips and must not grow from hands.

Face every creature toward screen-left in a clear side or three-quarter
gameplay pose. Keep horns, tails, wings, weapons, claws, and feet fully inside
the square source with generous padding.

Use variable implied native scale:

- Small imps: roughly 34–46 visible pixels high
- Medium demons: roughly 52–72 visible pixels high
- Large brutes and elites: roughly 76–92 visible pixels high
- Wide quadrupeds and flying creatures may use a wider native frame

These measurements are gameplay comparison targets, not a requirement that the
source or final sprite use a universal 96×96 canvas.

## Fifteen separate designs

### 01 — Cinder Imp Scout

Create one small wiry scarlet imp in a low sneaking pose. Exact anatomy: one
head, two arms, two hands, two digitigrade legs, two feet, two short swept-back
horns, one thin pointed tail, and no wings. It holds exactly one small black-iron
sickle in the forward hand. Use blackened hands and feet, a burgundy body
shadow, and three or four ember-orange cracks across the upper back.

Gameplay silhouette: quick ground scout and ankle-level slasher.

Save as:

- `drafts/01-cinder-imp-scout-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/01-cinder-imp-scout-reference-256.png`

### 02 — Pink Ashwing Imp

Create one compact flesh-pink flying imp hovering toward screen-left. Exact
anatomy: one head, two arms, two hands, two tucked legs, two feet, two small
black horns, exactly two back-mounted batlike wings, one short tail, and no
weapon. It cups exactly one ember orb between both hands. Keep the wings
charcoal with pink membranes and a controlled orange glow beneath the face.

Gameplay silhouette: fragile flying caster with a clearly telegraphed projectile.

Save as:

- `drafts/02-pink-ashwing-imp-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/02-pink-ashwing-imp-reference-256.png`

### 03 — Hooktail Ember Thief

Create one small burgundy imp leaning away as if stealing heat from a dying
fire. Exact anatomy: one head, two arms, two hands, two legs, two feet, two
uneven bone horns, one long tail ending in a natural hook shape, and no wings.
It carries exactly one closed brass ember jar under one arm; the free hand is
open. The jar emits one narrow copper-orange seam of light.

Gameplay silhouette: evasive support enemy that steals or relocates fire.

Save as:

- `drafts/03-hooktail-ember-thief-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/03-hooktail-ember-thief-reference-256.png`

### 04 — Goat-Headed Censer Raider

Create one lean humanoid demon with one natural black-goat head, two backward
curving horns, two horizontal goat ears, two arms, two hands, two digitigrade
legs, two cloven feet, and one short tail. It swings exactly one black-iron
censer on exactly one chain held in both hands. Use dark red hide, a dirty-bone
muzzle, charred waist cloth, and a tight ember cloud around the censer only.

Gameplay silhouette: medium-range swinging weapon with delayed ember bursts.

Save as:

- `drafts/04-goat-headed-censer-raider-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/04-goat-headed-censer-raider-reference-256.png`

### 05 — Ram-Skull Pyromancer

Create one upright medium demon whose single head has the natural form of a
weathered ram skull, with exactly two heavy curled horns. Give it two arms, two
hands, two legs, two cloven feet, no wings, and no tail. It holds exactly one
charred forked staff vertically in the rear hand while the forward palm creates
exactly one compact ember flame. Use flesh-pink shoulders, burgundy robes, dirty
bone, and a small gold-orange face glow inside the skull.

Gameplay silhouette: stationary fire caster with a tall horn-and-staff profile.

Save as:

- `drafts/05-ram-skull-pyromancer-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/05-ram-skull-pyromancer-reference-256.png`

### 06 — Emberhorn Brute

Create one large, broad, red-skinned brute in a forward-heavy stance. Exact
anatomy: one head, two massive arms, two hands, two thick legs, two cloven feet,
two forward-pointing black horns, one short tail, and no wings. It grips exactly
one asymmetrical basalt maul with both hands. Use deep crimson hide, soot-black
forearms, dirty-bone teeth, and ember-orange fissures confined to the horns,
shoulders, and maul head.

Gameplay silhouette: slow armor-breaking elite with obvious heat-cycle weak
points. Do not give it armor, a cape, or a heroic knight stance.

Save as:

- `drafts/06-emberhorn-brute-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/06-emberhorn-brute-reference-256.png`

### 07 — Furnace Ram

Create one powerful demonic ram quadruped facing screen-left. Exact anatomy: one
ram head, exactly four legs, four cloven hooves, exactly two curled horns, two
ears, one short tail, no arms, and no wings. Its intact charcoal hide resembles
cooled furnace stone, with restrained ember cracks along the shoulders and
horns. Hot hoofprints are implied by two or three tiny orange clusters directly
beneath the feet, not by a ground plane.

Gameplay silhouette: fast horizontal charge and brief overheated recovery.

Save as:

- `drafts/07-furnace-ram-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/07-furnace-ram-reference-256.png`

### 08 — Coal-Maw Hellhound

Create one low, long demonic hound preparing to spring left. Exact anatomy: one
canine head, exactly four legs, four clawed feet, two ears, one long tail, no
horns, no arms, and no wings. Use black-charcoal hide with burgundy undersides,
a compact orange glow visible only inside the open mouth, and two small ember
vents on the ribcage. No extra mouths or heads.

Gameplay silhouette: rapid leap attacker that leaves a short-lived ember bite.

Save as:

- `drafts/08-coal-maw-hellhound-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/08-coal-maw-hellhound-reference-256.png`

### 09 — Ragwing Flesh Harrier

Create one tall, lean, flesh-pink aerial hunter in a diving pose toward
screen-left. Exact anatomy: one head, two arms, two hands, two digitigrade legs,
two feet, exactly two long back-mounted wings, two small brow horns, one thin
tail, and exactly one short black-iron spear. The torn-looking wings are intact
supernatural membranes, not stitched human skin. Use bruised mauve shadows and
thin scarlet wing veins with a few ember tips.

Gameplay silhouette: wide aerial dive with strong separation between arms,
spear, legs, and wings.

Save as:

- `drafts/09-ragwing-flesh-harrier-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/09-ragwing-flesh-harrier-reference-256.png`

### 10 — Flesh-Bell Fiend

Create one hunched pink-skinned demon carrying exactly one cracked bronze hand
bell almost as large as its torso. Exact anatomy: one head, two arms, two hands,
two bent legs, two feet, two tiny horn nubs, no wings, and no tail. Both hands
grip one coherent bell handle. Use large pale-pink flesh clusters, mauve
shadows, aged brass, and exactly three visible ember notes or sound marks
leaving the bell toward screen-left.

Gameplay silhouette: slow sonic area-denial enemy. The bell is equipment, not
fused anatomy.

Save as:

- `drafts/10-flesh-bell-fiend-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/10-flesh-bell-fiend-reference-256.png`

### 11 — Soot-Tongue Hexer

Create one thin red-pink spellcaster crouched over exactly one crooked
black-wood wand. Exact anatomy: one head, two normal eyes, two arms, two hands,
two legs, two clawed feet, four short crown-like horns, one narrow tail, and no
wings. A single long charcoal tongue curls visibly from the mouth without
becoming a second limb. Exactly three ember glyphs hover in a shallow arc over
the wand.

Gameplay silhouette: curse caster with three clearly countable delayed bolts.

Save as:

- `drafts/11-soot-tongue-hexer-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/11-soot-tongue-hexer-reference-256.png`

### 12 — Sinew Crawler

Create one low flesh-pink crawling demon with intentional six-limb anatomy:
exactly four weight-bearing legs and exactly two smaller grasping arms attached
high on the chest, plus one head, two eyes, two short horns, and one short tail.
The intact hide uses broad pink and burgundy bands that suggest taut muscle
without showing exposed tissue. It carries no weapon and has no wings. Keep all
six limbs separated and countable.

Gameplay silhouette: wall-and-floor ambusher that grabs before the four legs
surge forward.

Save as:

- `drafts/12-sinew-crawler-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/12-sinew-crawler-reference-256.png`

### 13 — Pyre Beetle Fiend

Create one broad demonic beetle facing left. Exact anatomy: one horned insect
head, exactly six jointed legs, six feet, two mandibles, two short antennae, one
continuous shell, no arms, no wings, and no tail. Use a blackened crimson shell,
dirty-bone mandibles, and three connected ember-orange seams across the back.
Do not add a humanoid face or extra legs.

Gameplay silhouette: armored ground enemy whose back opens briefly to vent heat.

Save as:

- `drafts/13-pyre-beetle-fiend-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/13-pyre-beetle-fiend-reference-256.png`

### 14 — Scarlet Chain Warden

Create one tall, narrow scarlet demon standing in a severe forward lean. Exact
anatomy: one elongated head, two arms, two hands, two long legs, two cloven
feet, two upright black horns, one tail, and no wings. It holds exactly one
length of black chain between both hands; the far end terminates in exactly one
small hooked weight resting clear of the feet. Use restrained ember light on
five chain links only.

Gameplay silhouette: long-range pull and spacing controller. No armor, sword,
shield, or cape.

Save as:

- `drafts/14-scarlet-chain-warden-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/14-scarlet-chain-warden-reference-256.png`

### 15 — Crowned Gatefiend

Create one imposing elite demon in a planted three-quarter stance, clearly
larger than the Crimson Knight but not a screen-filling boss. Exact anatomy: one
goatlike head, two massive outward horns, two arms, two hands, two digitigrade
legs, two cloven feet, one heavy tail, and no wings. A broken ring of exactly
five floating ember stones forms a loose crown behind the horns. It grips
exactly one black-iron polearm with a broad crescent head in both hands. Use
dark burgundy hide, flesh-pink chest planes, soot-black extremities, bone horns,
and controlled orange-gold OSL from the floating stones.

Gameplay silhouette: gatekeeping elite with polearm sweeps and five staged ember
projectiles. Keep the ring detached from the head and the stones clearly
countable.

Save as:

- `drafts/15-crowned-gatefiend-source.png`
- `public/art/enemies/infernal-demons-batch-11/drafts/15-crowned-gatefiend-reference-256.png`

## Saving and review workflow

After every successful generation:

1. Immediately copy the complete generated PNG to its exact `*-source.png` path.
2. Create its exact 256×256 `*-reference-256.png` using nearest-neighbor
   reduction only.
3. Inspect both files for anatomy, palette, pixel treatment, silhouette, crop,
   and weapon coherence.
4. Record rejected passes in `STATUS.md`, but do not keep them in the canonical
   batch folder.

Keep all unapproved images under:

`pixel-art/enemies/infernal-demons-batch-11/drafts/`

Never leave the only copy in `.codex/generated_images`. The 256 reference is a
comparison image, not automatically a native 256×256 game sprite.

Reject and regenerate any result with:

- smooth painted rendering or excessive color ramps
- extra or missing limbs, wings, horns, tails, heads, or weapons
- green background
- cropped horns, wings, tails, weapons, or feet
- realistic exposed anatomy or graphic gore
- unreadable black-on-black silhouette
- accidental Crimson Knight resemblance
- recognizable Warhammer-specific creature, insignia, armor, or weapon design

After all 15 valid drafts are saved, create:

- `infernal-demons-draft-review-sheet-01-05.png`
- `infernal-demons-draft-review-sheet-06-10.png`
- `infernal-demons-draft-review-sheet-11-15.png`
- `infernal-demons-draft-review-sheet.png` as a 5×3 master comparison
- `infernal-demons-gameplay-scale-test-640x360.png` showing the Crimson Knight,
  one imp, one medium demon, one quadruped, and one elite at intended relative
  scale

Update `STATUS.md` with exact filenames, generation dates, rejected passes,
visible-pixel height measurements, and review results. Keep retention at zero
until the user explicitly approves individual designs. Do not update the
canonical manifest, enemy lore compendium, retained counts, or README asset
counts for unapproved drafts.

---

## Batch design logic

The roster deliberately contains:

- three small imps
- three goat- or ram-headed demons
- two infernal quadrupeds
- two flying or wide-frame threats
- three magic or control enemies
- two large elite silhouettes

Its palette is divided between infernal scarlet, bruised flesh-pink, and
charred ember-black so the enemies feel related without becoming identical.
