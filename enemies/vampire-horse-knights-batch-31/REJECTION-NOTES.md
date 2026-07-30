# Vampire Horse Knights Batch 31 — Rejection Notes

**Recorded:** 2026-07-30  
**Applies to:** Every continuation or revision after drafts 01–10  
**Status:** Mandatory active collection guidance

## Direct user feedback

The first ten drafts have good render quality, but they do not unmistakably read
as **vampire horse knights**. Their weapons also read as too short or weird.

Do not interpret praise for rendering quality as approval of the concepts,
vampire identity, weapons, or weapon handles.

## What went wrong

### 1. Vampire identity was too weak

- Most riders concealed the entire face behind a generic closed knight helmet.
- The palette relied on black, iron, and dirty ivory with only tiny burgundy
  accents.
- High collars, pallid faces, red irises, restrained fangs, blood-court
  heraldry, and predatory aristocratic shapes were absent or too subtle at
  256 pixels.
- The horses and tack read as ordinary dark-fantasy cavalry rather than part of
  a vampire court.
- Several designs could be renamed as ordinary funeral knights without changing
  the image.

### 2. Generic black-knight cues replaced the requested family

- Closed sallets, plain dark plate, neutral caparisons, and conventional riding
  poses established “armored cavalry” but not “vampire cavalry.”
- The designs were restrained to the point of losing their specific identity.
- The family needs stronger vampire hierarchy through pale faces, severe
  aristocratic profiles, high collars, oxblood cape lining, controlled
  blood-drop or chalice heraldry, and funeral tack—not more armor decoration.

### 3. Mounted weapons were underscaled

- The Wave 2 sword, mace, and axe read like compact foot-soldier sidearms when
  compared with the horse and mounted silhouette.
- Describing a weapon as “human-scale” or “normal one-handed length” was not
  enough; the image generator shortened the visible weapon.
- A weapon can be historically recognizable and still fail if it does not read
  clearly at mounted scale and at 256 pixels.

### 4. Weapon forms drifted into fantasy shapes

- Draft 05's hammer developed a crescent-like secondary form.
- The first attempt for Draft 08 produced a spiked star-shaped mace and had to
  be rejected.
- Repeated negative prompting about “weird handles” encouraged overdescribed
  weapon construction without guaranteeing a clean silhouette.
- Ornamental or ambiguous heads, hooks, extra blades, back spikes, sculptural
  grips, curved shafts, rings, and oversized pommels must not return.

### 5. The quality gate accepted technical correctness without identity

- Correct anatomy, padding, background, and pixel treatment did not compensate
  for a weak vampire read.
- Weapon plausibility was judged too generously when the weapon was visually
  short or ambiguous.
- Future drafts must pass subject identity and weapon silhouette at 256 pixels
  before they are saved as viable.

## Mandatory correction locks

### Unmistakable vampire read

Every new design must have at least **two strong vampire cues** visible at
256 pixels, and at least one must be carried by the rider rather than only by
horse cloth:

- A visible pallid adult face or clearly open visor.
- Two short readable upper fangs; restrained, not grotesque.
- Deep red or ember-red irises without a large magical glow.
- A high black or oxblood court collar.
- A long black cape with clearly visible oxblood lining.
- One simple blood-drop, chalice, or coffin-nail heraldic mark.
- Funeral-court horse tack or caparison using black, dirty ivory, and oxblood.

Use these cues selectively and coherently. Do not pile all of them onto every
character, add bat wings, turn the horse into a monster, or use graphic gore.

### Mounted weapon scale

Do not use another mace, hammer, or hand axe in the next correction wave.

- A cavalry lance or long spear must extend clearly beyond the horse's muzzle
  and use a visible straight shaft roughly 1.25–1.5 times the horse's
  nose-to-rump length.
- A straight sword or cavalry saber must have a clearly readable blade roughly
  35–45 percent of the horse's nose-to-rump length; its tip should reach to
  about the horse's chest, foreleg, or lower when held down.
- A bow must be a familiar full-sized recurved cavalry bow with a plain central
  grip and exactly one nocked arrow.
- All weapons must remain completely inside the square with padding.

### Plain weapon construction

- Use only familiar historical forms: plain cavalry lance, plain long spear,
  plain long cavalry saber, plain long straight sword, or plain recurve bow.
- Use a continuous straight wooden shaft for lances and spears.
- Use a simple straight crossguard and ordinary leather-wrapped grip for swords.
- Use a plain central wood grip for a bow.
- No hooks, forks, side blades, double heads, back spikes, serrations, bone
  handles, branch handles, curved shafts, rings, sculpted grips, creature
  motifs, crescent attachments, chains, or fantasy extensions.

### Horse and rider presentation

- Keep exactly one complete adult vampire rider and one complete natural horse.
- Preserve coherent saddles, stirrups, reins, tack, human anatomy, horse anatomy,
  full padding, and the left-facing three-quarter mounted presentation.
- The horse may carry vampire-court cloth and heraldry but must remain a
  believable living horse with no fangs, exposed bone, extra anatomy, or glowing
  body.

## Reference handling

- Drafts 01–10 are positive references only for render quality, deliberate pixel
  clustering, mounted framing, rider-and-horse anatomy, and near-black isolation.
- Drafts 01–10 are negative references for vampire clarity and weapon
  proportion. Do not copy their weak family cues or short weapon presentation.
- `enemies/spanish-colonial-corruption-batch-09/drafts/17-blood-starved-vampire-officer-source.png`
  and `07-night-vampire-bayonet-cazador-source.png` may guide pallid skin, red
  irises, and readable fangs only. Do not copy their uniforms, poses, anatomy,
  weapons, or feral body language.

## Acceptance test for the next wave

At 256 pixels, a reviewer must be able to answer both questions immediately:

1. “Is this unmistakably a mounted vampire knight?”
2. “Is the weapon long enough, ordinary, and mechanically understandable?”

If either answer is no, reject and regenerate the concept before saving it.
