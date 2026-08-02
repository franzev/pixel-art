# Shared Render Contract

Load this file for every routed gallery render.

## World and Mood

The gallery supports multiple worlds and collection-specific art directions.
It is not globally Filipino, Philippine, 1970s, colonial, folkloric, or tied
to any one regional craft tradition. The Ashen Provinces is one available
setting label, not permission to import a fixed cultural style into every
asset.

Build horror from grief, mourning, ritual obligation, possession, unfinished
duties, religious decay, strange behavior, weathered materials, absence,
silence, shadow, smoke, roots, rain, floodwater, and restrained fire.

Follow the culture, place, period, and material language named in the current
brief or active collection. Western medieval, Eastern European, Philippine,
East Asian, Middle Eastern, ancient, modern, invented, or mixed influences are
all valid when deliberately requested and coherently researched. Do not add
banig, abaca, capiz, Filipino dress, Philippine folklore, colonial details, or
1970s styling by default, and do not use a different culture as an equally
automatic substitute.

When a brief supplies no cultural or period direction, use an original,
grounded gothic or dark-fantasy language and keep culture-specific motifs out
of the design. Build specificity from role, silhouette, construction,
materials, weathering, anatomy, and behavior rather than borrowed decoration.
Keep horror non-graphic unless explicitly requested; prefer suggestion and
consequence over gore or victim tableaux.

## Visual Priorities

- Strong readable silhouettes, broad value organization, and clear negative
  spaces.
- One immediately understandable visual or gameplay idea.
- Restrained ornament and coherent materials.
- Severe, mournful, occult, weathered, historically grounded character.
- Material-specific local color ramps with enough hue and value separation to
  distinguish metal, cloth, leather, wood, skin, bone, and accents.
- Recognition at 256 pixels and likely gameplay scale.

The target is restrained but specific: never plain, but never dependent on
excess decoration for identity.

## Palette and Global-Grade Independence

Dark fantasy does not require one universal black, brown, and bronze palette.
Black, charcoal, soot, dirty ivory, dull metal, bronze, copper, dirty gold, and
ember-orange remain available materials, but they are not a mandatory shared
foundation.

Never apply any global color filter or grade. In particular, reject every
yellowish, sepia, tobacco-brown, bronze, copper, amber, grey-black, uniformly
desaturated, or uniformly warm/cool cast. Do not use brown haze, photographic
grading, a vignette, edge falloff, or one shared shadow hue to collapse
unrelated materials into the same look.

Default to a neutral color balance. Make renders vibrant through clear local
hue separation, readable saturation, and crisp value contrast—not through a
global wash or blanket oversaturation.

Keep color local to material:

- steel may be bright worn, neutral, blue-grey, heat-darkened, russeted,
  painted, or blackened when the brief supports it;
- cloth keeps a readable garment hue rather than becoming generic soot;
- leather and wood remain distinct from cloth and metal;
- skin, bone, shell, enamel, lacquer, corrosion, and patina retain their own
  hue families;
- lighting changes selected planes and edges without tinting the whole figure.

The canonical `#171311` background must remain perfectly uniform and separate
from the subject's color script. Its warm-charcoal hue must not leak into
shadows, highlights, or a surrounding glow.

Before prompting a wave of two or more comparable characters, record a palette
matrix for every concept with these axes:

- dominant material and color family;
- secondary garment hue and value;
- metal finish and temperature;
- leather or wood hue;
- accent role and coverage;
- lighting direction and temperature.

Every concept must differ from every other concept in the wave on at least
three of these axes. It must also differ on at least three axes from each of the
ten most recent comparable renders, or from all comparable renders when fewer
than ten exist. Small hue shifts inside the same black-grey-brown family do not
count.

Family cohesion may share at most one anchor color and one trim or material
token. Do not reuse an entire palette-and-lighting script as the family
identity.

The combined blackened-steel, soot/charcoal-cloth, dark-brown wood/leather,
dirty-ivory, tiny bronze/copper, and warm-rim-lighting look is fatigue-locked.
An isolated component is still allowed; the complete recurring grade is not.

## Reference Handling

- Inspect a named positive reference at full size and at 256 pixels.
- Use the actual image reference when the generation system supports it.
- Identify it as a visual reference, not an edit target.
- Preserve approved high-level qualities, never its exact pose, costume,
  anatomy, prop placement, effects, or silhouette.
- Compare the result with the reference and current batch side by side.
- Treat an existing image as an edit target only when the user asks for an edit.
- Do not copy the Penitent One or another copyrighted character. References may
  guide pixel treatment, weight, or atmosphere, not protected design elements.

## Pixel-Art Treatment

Require deliberately pixel-authored art:

- Crisp hard square pixels and clean silhouette edges.
- Connected clusters, broad value masses, and restrained color ramps.
- Selective highlights and consistent pixel density.
- Enough density for mature anatomy, facial planes, hair, cloth, armor joints,
  and important props.

Reject anti-aliasing, blur, soft focus, smooth painterly gradients, airbrushing,
pixel-filtered paintings, excessive dithering, confetti pixels, noisy
microtexture, mixed pixel sizes, and unnecessary tiny surface marks. Do not use
extremely chunky, chibi, toy-like, mitten-handed, or oversimplified treatment.

Prompt-construction lock: state the pixel-art medium near the beginning and
again in the final style line of every generation prompt. Never positively
describe an isolated asset as `concept art`, `digital painting`, `illustration`,
`painterly`, `cinematic render`, `studio render`, or `photorealistic`; those
phrases compete with and often erase the pixel-art requirement. `High-detail`
or `full-quality` may describe pixel art only when immediately joined to
`deliberately pixel-authored`, `hard square pixels`, `connected clusters`, and
`no anti-aliasing or smooth gradients`.

## Universal Composition

- Every original full-quality generated render uses a square `1:1` canvas in
  every category. State `square 1:1 canvas; output width must equal output
  height` in the prompt.
- Keep every required subject, limb, attachment, prop, and effect fully inside
  the canvas with generous padding.
- Maintain coherent anatomy unless the brief specifies another anatomy.
- State and verify exact counts for repeated anatomy, props, and effects.
- Keep overlaps and attachment points readable.
- Every directional subject is mostly frontal in a shallow **front**
  three-quarter view, turned slightly toward screen-right from the viewer's
  perspective.
  `Right-facing` means a subtle bias, not a complete side profile. Face, gaze,
  leading torso action, locomotion, attack, and equipment use favor the right
  edge while the camera-facing facial plane remains readable. For an
  unobscured face, show both eyes, nose, mouth, chin, and expression; the gaze
  may glance right without turning the face away. Preserve both shoulders when
  the anatomy and costume permit. Do not use a 90-degree profile, rear
  three-quarter view, back-of-head view, ear-only view, far-cheek sliver, or
  edge-on torso unless explicitly requested. Hair, cloth, or capes may trail
  toward screen-left. The forward knee and leading foot, weight transfer,
  weapon head or active end, and attack line must concretely favor
  screen-right. Reject any result whose dominant locomotion or equipment cue
  still leads left. Do not mirror a correction; regenerate it while locking
  asymmetric costume, scars, handed props, and ornaments to their original
  screen sides. This supersedes older collection-specific, screen-left, and
  mandatory full-profile directions.
- Do not add text, typography, or decorative frames unless requested.
- Never use a flat green background, green fog, magical green wash, or global
  green character tint. Natural green remains valid where materially relevant.

## Redo Identity Preservation

A redo, regeneration, correction, or reference-based revision must remain the
same depicted person. Preserve the source character's visible skin tone and
undertone, facial structure, eye and nose shape, lips, hair texture, age, gender
presentation, and culturally or ethnically specific appearance. Never lighten,
darken, or change racial or ethnic appearance unless the user explicitly asks
for that exact identity change.

When the source covers or leaves an identity trait ambiguous, preserve that
covering or ambiguity rather than inventing a new identity. A role, name,
costume, faction, location, or fantasy species is not evidence for assigning an
ethnicity. Change only the defects and traits named in the redo brief. This
lock does not impose a racial exclusion or default on new character concepts.

## Canonical Canvas

For every future original full-quality generated render, require exact square
pixel dimensions (`width == height`).

- Use a `1:1` generator setting when available and retain the explicit `1:1`
  instruction in the prompt.
- Verify the returned file's actual pixel dimensions; visual appearance and
  prompt wording are not sufficient.
- Reject and regenerate any non-square output before saving or presentation.
  Do not crop, stretch, squash, or pad a failed output into compliance.
- Apply the requirement to characters, creatures, props, bosses, environment
  concepts, and narrative scenes.
- Do not alter historical renders solely to enforce this future-facing rule.
- Deliberately authored native production sprites, animation sheets,
  environment plates, UI composites, and review sheets may use their specified
  target dimensions because they are derived artifacts, not generated source
  renders.

## Canonical Background

For every future isolated asset concept and opaque preview, use a perfectly
uniform warm-charcoal background of exactly `#171311`.

- State `#171311` explicitly in the image-generation prompt.
- Keep every background pixel the same color; no alternate near-black, tint,
  gradient, vignette, glow field, texture, scenery, floor plane, horizon, cast
  shadow, or atmosphere.
- Describe it only as a `perfectly flat, perfectly uniform solid-color
  #171311 field from edge to edge`. Never request a radial field, studio
  falloff, light falloff, spotlight, halo, soft backdrop, photographic
  background, paper/canvas/grain texture, mist, haze, or ambient shadow. Do not
  light or shade the background; lighting applies to the subject only.
- Older prompts or collection notes that specify `#120F0E`, `#1A1513`, a range
  of warm near-blacks, or an unspecified warm near-black are superseded.
- Do not recolor historical renders solely to conform to this future-facing
  rule.
- Native production sprites and animation frames remain transparent.
- Environment plates and narrative scenes are exempt because their background
  is the requested artwork. Any isolated actor or prop generated separately
  for them still uses `#171311`.

## No Visible Spells

Visible spells and spell-like effects are prohibited in every render. Never add
floating magic, auras, sigils, runes, orbs, magical projectiles, elemental
emissions, summoned geometry, droplets, threads, smoke wisps, or ambient
particles.

This rule also applies to casters, magical enemies, angels, bosses,
environments, and narrative scenes. Treat supernatural power as lore or
gameplay identity and communicate it through physical design, conventional
equipment, posture, materials, corruption, and silhouette. A subject being
described as magical is not permission to show a spell.

## Physical Equipment

For any weapon, shield, or weapon-like tool:

- Load and complete `EQUIPMENT-RESEARCH.md`. Do not generate equipment from
  memory or from a text label alone.
- Use an authoritative measured full-profile reference and a separate usable
  handle, socket, trigger, or shield-back view. Never invent hidden
  construction.
- Identify the exact real-world type and establish its realistic total length
  and component proportions before prompting.
- Convert the real-world measurement to a handler-relative ratio:
  `rendered weapon length / rendered handler height ≈ real weapon length / real handler height`.
- Preserve that ratio at full resolution and confirm that the weapon still
  reads at 256 pixels. Foreshortening must be deliberate, mechanically
  coherent, and must not make the weapon read as shortened.
- Keep every straight blade, shaft, stick, haft, and handle on one continuous
  straight centerline. Keep connected components aligned through their guard or
  socket, with no accidental bend, kink, lateral offset, or broken join.
- Use only equipment appropriate to the handler's anatomy, body size, strength,
  usable hands, vision, role, training, culture, clothing, armor, posture, and
  implied attack.
- Avoid bows, arrows, quivers, and loose or floating ammunition. Crossbows are
  allowed only when their stock, support hand, firing hand, trigger finger, and
  string path are mechanically coherent.
- Put shield grips and straps on the interior, positioned to support the
  shield's center of mass and aligned with the hand, wrist, and forearm.
- Keep at least one side of each hand-to-handle contact and every
  blade/head-to-handle join visible enough for focused review.

## Quality Gate

Inspect every result before presenting or saving it as viable.

At full resolution verify:

- Exact square pixel dimensions (`width == height`), plus correct subject
  count, framing, and facing.
- For an isolated concept or opaque preview, a perfectly uniform `#171311`
  background with no off-color corners, edge variation, floor, shadow,
  gradient, vignette, texture, or scenery.
- Deliberate pixel construction visible at full size and 256 px: hard square
  pixel edges, connected clusters, restrained ramps, and no smooth painted or
  anti-aliased passages. Preserve a failing raw attempt, but never select it as
  the review candidate; regenerate from the full prompt instead of filtering,
  resizing, recoloring, or manipulating its pixels.
- Complete silhouette, generous padding, coherent anatomy, and exact repeated
  element counts.
- No accidental extra face, hand, limb, weapon, wing, prop, or attachment.
- For multi-character or batch work, no repeated facial template disguised by
  different hair, clothing, or palette.
- For female characters, an attractive and unmistakably adult young-woman read,
  normally approximately 21–35 in apparent age, with no juvenile,
  teenager/schoolgirl, or age-ambiguous cues.
- A distinctly feminine overall female face, without a strongly
  masculine-coded combination of brow, jaw, chin, facial planes, and neck.
- For female characters, simple war-torn-era hair secured for action, with no
  ornate styling or strands obstructing vision, armor, hands, or equipment.
- For characters, five fingers on each visible hand with plausible thumb
  placement.
- Plausible weight and coherent joins; for characters, verify feet, clothing
  construction, and equipment use.
- Measured weapon scale, straight centerlines, aligned handles and sockets,
  plausible shield grips, and handler-appropriate equipment.
- For oversized swords, both hands entirely on the visible grip between guard
  and pommel, with no half-swording, ricasso/forte contact, blade contact, or
  hand crossing the guard.
- No arrows, quivers, loose ammunition, bent sticks, or malformed crossbow
  trigger-hand anatomy.
- Equipment matches the recorded authoritative references at the full profile,
  handle/contact, and attachment crops.
- No scenery, text, visible spells, spell-like effects, particles, or
  unrequested props.

For art direction verify:

- It belongs to the requested family, setting, and active collection.
- It has one clear primary idea without excessive decoration.
- It neither duplicates the batch nor imitates a rejected or external design.
- Every material retains a distinct, vibrant local color ramp under a neutral
  overall balance; no global filter or yellowish, sepia, brown, bronze,
  grey-black, desaturated, or uniformly warm/cool cast.
- The palette matrix differs on at least three axes from the current wave and
  the ten most recent comparable renders.
- The fixed background remains flat and does not create a vignette, warm halo,
  edge falloff, or tint on the subject.
- An attractive female face remains individually structured and
  setting-compatible rather than becoming a repeated glamour-filter template.
- Feminine facial construction preserves varied brief-appropriate features
  rather than collapsing into one ethnicity or repeated doll-like face.
- Female hair reads as low-maintenance and battle ready, not salon-styled,
  ceremonial, excessively voluminous, or used as ornate silhouette decoration.
- It satisfies current category prohibitions and collection decisions.

At 256 pixels and gameplay scale verify:

- Crisp pixels, connected clusters, broad readable values, and no smoothing.
- Readable silhouette, anatomy, equipment, and primary gameplay identity.
- Material colors remain distinguishable rather than collapsing into one
  black-grey-brown mass with tiny warm highlights.
- No noisy microtexture or detail that collapses into visual static.

Internally reject and regenerate any result that fails a mandatory criterion.
Do not repair structurally broken anatomy by compositing or painting over it
unless the user explicitly requests an edit.
