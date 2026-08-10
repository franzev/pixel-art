# Ashen Archive Render Router

Version: 3.10

Last updated: 2026-08-03

Status: Active project-wide entry point for new renders

## Purpose

Use this file to translate a terse brief into the smallest relevant render
contract. Do not load every category module.

The user may write:

> Use `RENDER-PROMPT.md`: 5 forest knights

That is sufficient. Infer the category, load the files routed below, create
distinct concepts, inspect the results, and save each viable full-quality
render directly at `public/art/<category>/<collection>/` for review on the
website. Do not use a `drafts/` folder for new generations. Catalog placement
does not grant approval: each render remains unapproved until the user reviews
it.

Before inspecting or retrying any generator result, preserve the raw PNG with
`npm run render:save-attempt`. Every first, second, third, and later attempt
must remain recoverable under `archive/render-attempts/`, even when an agent
initially prefers a later result. Attempt history is not catalog approval.

Every preserved generator result must also become available in the web gallery
immediately. `render:save-attempt` must update the attempt index, and the agent
must verify that the new item is visible in the gallery's **History** view
before inspecting it, retrying it, or starting another generation call. If the
development gallery is not running, start it with `npm run dev`; if the watcher
has not refreshed, run `npm run sync:attempts`. Do not postpone indexing until
the end of a wave. A raw result belongs in History immediately; a viable
selected result belongs in Catalog only after the normal render gate passes.

## Gallery-Wide Style Freedom

The gallery supports multiple settings, cultures, periods, and visual
directions. Filipino, Philippine, Filipina, 1970s, colonial, folklore, banig,
abaca, capiz, and other regional or period cues are never automatic
project-wide requirements.

Use a cultural, historical, or material influence only when at least one of
these sources explicitly selects it:

1. The user's current brief.
2. The active collection's current specification or status.
3. A positive reference deliberately named for the current request.

Do not inherit a style from the repository name, the Ashen Provinces label, an
unrelated collection, an older prompt, or a nearby gallery asset. Do not give
knights woven folk motifs or give creatures Philippine folklore features
unless the current request or collection calls for them. A collection named
for a culture or decade keeps that local identity without setting a precedent
for other collections.

When no cultural or period direction is supplied, use an original grounded
gothic or dark-fantasy treatment that fits the requested subject. Cultural
neutrality does not mean visual blandness: create specificity through
silhouette, construction, role, materials, wear, anatomy, and encounter
behavior.

## Always Load

1. `render-contracts/CORE.md` — shared visual and pixel-art rules.
2. `render-contracts/WORKFLOW.md` — preflight, review, saving, and approval.
3. `art-catalog/REVIEW-LEARNINGS.md` — current lessons from confirmed reviews.
4. The active collection's `STATUS.md`, `POSITIVE-REFERENCE-NOTES.md`, and
   `REJECTION-NOTES.md`, when they exist.
5. `render-contracts/EQUIPMENT-RESEARCH.md` whenever the render contains a
   weapon, shield, or weapon-like tool.

Only include visual instructions from these files in the generation prompt.
Workflow, file-management, and response instructions guide the agent but must
not be pasted into the image-generation prompt.

## Project-Wide 1:1 Canvas Lock

Every future original full-quality generated render must use a square `1:1`
canvas, regardless of category. This includes isolated characters, creatures,
props, bosses, environment concepts, and narrative scenes.

Every generation prompt must explicitly say:

> Square 1:1 canvas; output width must equal output height.

When the generation system exposes an aspect-ratio or output-size control,
select `1:1` there as well as stating it in the prompt. Prompt wording alone is
not proof of compliance: inspect the returned file metadata and require exact
pixel equality (`width == height`) before the render can pass viability checks
or be saved under `public/art/`.

A non-square generated result is a failed attempt. Preserve the raw result in
the attempt archive, then reject and regenerate it; do not crop, stretch,
squash, or add padding merely to make the file square. This lock is
future-facing and does not require retroactive changes to historical renders.

Deliberately authored native production sprites, animation sheets, environment
plates, UI composites, and review sheets may use their named target dimensions.
They are derived production or review artifacts, not original full-quality
generated renders, and do not waive the `1:1` generation requirement.

## Project-Wide Slight Right-Facing Lock

Every future render with a directional subject must have a subtle screen-right
bias from the viewer's perspective. `Right-facing` does not mean a complete
side profile. Keep the subject mostly frontal in a shallow **front**
three-quarter view, never a rear three-quarter view. The camera-facing facial
plane must remain readable: when the face is unobscured, show both eyes, nose,
mouth, chin, and expression. The gaze may look slightly right without turning
the face away from the viewer. Turn the head and upper torso only enough for the
leading action, locomotion, weapon use, and primary directional action to favor
the right edge. Preserve both shoulders when the design permits. Do not rotate
the subject into a 90-degree profile, back-of-head view, ear-only view,
far-cheek sliver, or edge-on torso unless the user explicitly requests it.

Every applicable generation prompt must explicitly say:

> Subject is mostly frontal in a shallow front three-quarter view, turned
> slightly toward screen-right from the viewer's perspective. Keep the
> camera-facing facial plane visible; when unobscured, show both eyes, nose,
> mouth, chin, and expression. The gaze, leading torso action, locomotion,
> attack, and equipment direction favor the right edge without turning the
> face away. The forward knee and leading foot, weight transfer, attack line,
> and weapon head or active end visibly lead toward screen-right; the rear leg
> and loose cloth may trail toward screen-left. Do not use a complete side
> profile, rear three-quarter view, back-of-head view, ear-only view,
> far-cheek sliver, or edge-on torso. Do not mirror the result; preserve every
> asymmetric character trait on its original screen side.

Hair, loose cloth, banners, or capes may trail toward screen-left when the pose
implies forward motion to the right. Do not mirror the complete output after
generation merely to repair the direction; regenerate it with correct anatomy,
handed equipment, asymmetrical costume details, and lighting.

Do not rely on the words `right-facing` or `screen-right bias` alone. Every
directional prompt must make the screen-space evidence agree: the forward knee
and leading foot, weight transfer, weapon head or attack end, gaze, and trailing
cloth must collectively read toward screen-right. Never preserve a
screen-left-leading leg or weapon angle while simultaneously asking for a
right-facing result. Before accepting a render, inspect those concrete cues.
If any dominant cue still leads screen-left, preserve the raw attempt and
regenerate it. When correcting direction, explicitly lock every asymmetrical
character trait to its original screen side so the generator does not solve the
request by mirroring the costume or anatomy.

This lock supersedes every older prompt, collection note, canonical pose, or
reference direction that says screen-left, facing left, or interprets
screen-right as a mandatory full side profile. A genuinely non-directional
prop, empty environment, or abstract composition may record facing as not
applicable, but its QA plan must explain why no directional subject or action
exists.

## Project-Wide Redo Identity Lock

A redo, regeneration, correction, or reference-based revision depicts the same
character—not a recast. Preserve every identity trait visible in the source:
skin tone and undertone, facial structure, eye and nose shape, lips, hair
texture, age, gender presentation, and culturally or ethnically specific
appearance. Do not lighten, darken, or change the character's racial or ethnic
appearance unless the user explicitly requests that exact change.

If the source fully covers or leaves an identity trait ambiguous, preserve the
covering or ambiguity. Do not infer or invent an ethnicity from the character's
name, role, costume, faction, culture, location, or fantasy species. Correct
only the defects and attributes named by the current redo brief.

Every redo prompt must explicitly say:

> Identity preservation: this is the same character, not a recast. Preserve
> the source character's visible skin tone and undertone, facial structure,
> hair texture, age, and culturally or ethnically specific appearance. Do not
> lighten, darken, or change racial or ethnic appearance. If a trait is covered
> or ambiguous in the source, preserve that ambiguity. Change only the defects
> explicitly named in this redo brief.

This lock governs source-based revisions only. New characters follow the
current brief and collection direction without any prohibited or preferred
race.

## Project-Wide Full-Description Redo Lock

A redo is a fresh generator output driven by a complete source-reconstruction
prompt. It is never repaired through mirroring, compositing, recoloring,
background replacement, inpainting by local scripts, or other pixel
manipulation.

Before generating, describe every visually meaningful source trait in the
prompt even when the source image is also supplied:

- exact face visibility or covering, head angle, apparent age, visible skin
  tone, facial structure, hair, scars, and expression;
- body build, proportions, posture, limb placement, stance, and bare-foot or
  footwear state;
- complete silhouette and negative spaces;
- every garment layer from head to foot, including topology, openings, sleeve
  coverage, hems, wear, damage, fasteners, devotional objects, and which body
  areas remain exposed;
- exact local colors and materials without a global filter;
- exact equipment type, dimensions, components, attachment, hand contacts,
  orientation, and load path;
- original composition, scale in frame, padding, pixel treatment, lighting,
  and background;
- the one named defect authorized to change;
- an explicit list of all source traits that must not change.

Do not summarize the source as a character archetype such as “nun,” “knight,”
or “priestess.” Those labels are too broad and invite a redesign. Reconstruct
the observed image in concrete visual language.

Every redo prompt must explicitly say:

> Generate a new complete render from this full description and the supplied
> source reference. Do not manipulate or reuse source pixels. Change only the
> named defect. Preserve the source character's face visibility or covering,
> identity, body build, proportions, pose outside the corrected area,
> silhouette, garment topology, palette, materials, accessories, equipment
> identity outside the corrected component, framing, and pixel-art treatment.
> Do not improve, modernize, beautify, reinterpret, simplify, or redesign any
> unlisted trait.

If the requested correction cannot be made without changing an unrelated
trait, preserve the raw attempt and reject it. Do not broaden the correction
scope after generation.

## Project-Wide Background Lock

Every future isolated asset concept and opaque preview must use exactly one
perfectly uniform warm-charcoal background: `#171311`.

State the hex value explicitly in every applicable generation prompt. Do not
substitute `#120F0E`, `#1A1513`, another near-black, a transparent background,
scenery, floor plane, cast shadow, gradient, vignette, glow field, texture, or
atmospheric variation. This lock supersedes older collection prompts, status
notes, and specification ranges that permit other background colors.

Use this exact positive construction: `perfectly flat, perfectly uniform
solid-color #171311 background from edge to edge; every background pixel is the
same color; lighting affects the subject only`. Never use `radial`, `studio
falloff`, `soft falloff`, `spotlight`, `halo`, `soft backdrop`, `cinematic
background`, `grain`, `paper`, `canvas`, `mist`, or `haze` as positive
background language. Those terms are defects even when the result still looks
near-black.

## Project-Wide Pixel-Art Prompt Lock

Every isolated asset prompt must declare `deliberately pixel-authored
high-density pixel art` near the beginning and repeat the medium in its final
style line. Require hard square pixels, connected clusters, broad readable
value masses, restrained color ramps, selective highlights, consistent pixel
density, and clean silhouette edges readable at 256 pixels.

Never positively call the requested output `concept art`, `digital painting`,
`illustration`, `painterly`, `cinematic render`, `studio render`, or
`photorealistic`. Do not use a generic `high-resolution fantasy game concept
art` ending: it can override the pixel-art medium. Explicitly reject smoothing,
anti-aliasing, blur, airbrushing, smooth gradients, painterly brushwork,
pixel-filtered paintings, noisy microtexture, and mixed pixel sizes.

A result that reads as a smooth painting or has any background texture,
gradient, vignette, halo, falloff, floor, or cast shadow is a failed attempt.
Archive it before judgment, do not pixel-edit it, and regenerate from the full
visual prompt. It cannot be the selected review candidate merely because its
character design is otherwise strong.

Do not recolor historical renders merely to enforce this future-facing rule.
Native production sprites and animation frames remain transparent. Intentionally
illustrated environments and narrative scenes use their requested environment
rather than a flat color field, but any separately generated isolated actor or
prop for those compositions still uses `#171311`.

## Project-Wide Palette and Global-Grade Lock

The fixed `#171311` background is a catalog field, not a color-grading
instruction. Keep it perfectly flat and prevent its warm-charcoal hue from
contaminating the subject.

Never apply any global color filter or grade. In particular, reject every
yellowish, sepia, tobacco-brown, bronze, copper, amber, grey-black, uniformly
desaturated, or uniformly warm/cool cast. Do not use a vignette, edge
darkening, brown haze, photographic grade, or one shared shadow tint to push
every material into the same color family.

Default to a neutral color balance and make the render vibrant through clear
local hue separation, readable saturation, and crisp value contrast. Vibrant
does not mean placing one colored wash over the image; materials must retain
their own hues under the selected lighting.

Build palettes from local material color:

- metal finish and temperature;
- garment hue and value;
- leather and wood hue;
- skin, bone, shell, or other exposed material;
- one controlled accent role;
- an intentional lighting temperature that does not recolor the entire figure.

Blackened steel, charcoal or soot cloth, dark-brown wood or leather, dirty
ivory, tiny bronze or copper highlights, and warm rim lighting are one optional
palette family. Do not combine them as the automatic gothic or knight default.
That complete bundle is fatigue-locked until the user explicitly requests it
again.

For a wave of two or more comparable characters, load the palette-diversity
rules in `CORE.md` and the routed category contract. A changed weapon, pose,
name, or ornament cannot satisfy palette diversity.

## Project-Wide No-Spell Lock

Never generate visible spells or spell-like effects in any category. This
includes casters, magical enemies, angels, bosses, environments, and narrative
scenes. Treat spell-related wording in a brief as gameplay or lore identity,
then express it through physical design, conventional equipment, posture,
materials, corruption, and silhouette.

Do not include floating magic, auras, sigils, runes, orbs, magical projectiles,
elemental emissions, summoned geometry, droplets, threads, smoke wisps, or
ambient particles. Do not treat a request for a caster or supernatural subject
as permission to add them. This lock supersedes every older spell-positive
collection prompt, status note, reference description, and effect palette. A
future request must explicitly reverse this project-wide lock before any
visible spell can be generated.

## Project-Wide Weapon Geometry Lock

When a render includes a weapon, shield, or weapon-like tool, complete
`render-contracts/EQUIPMENT-RESEARCH.md` before writing its generation prompt.
Research is a blocking gate: never generate from memory or guess a handle,
hilt, socket, shield back, strap system, or trigger mechanism.

Identify the exact real-world type and establish a realistic total length and
component proportions from an authoritative object record. Obtain both a full
equipment profile and a close handle, hilt, socket, trigger, or shield-back
view. If the hidden construction cannot be verified, select a better-documented
conventional weapon instead.

The rendered weapon must preserve that measured proportion. Straight blades,
shafts, sticks, hafts, and handles must have one continuous straight centerline.
The blade, guard, grip, and pommel—or head, socket, shaft, and butt—must join on
the intended mechanical axis without bends, offsets, or broken connections.

Shield grips and straps must be on the interior, placed to support the shield's
center of mass, and aligned with the gripping hand, wrist, and forearm. Avoid
bows, arrows, quivers, and loose or floating ammunition. Crossbows are allowed,
but require a correctly supported stock, a mechanically plausible firing-hand
grip, and a properly placed trigger finger clear of the string path.

Every weapon must be appropriate to the handler's anatomy, body size, strength,
number of usable hands, vision, role, training, culture, clothing, armor,
posture, and implied attack. Reject a weapon that is geometrically sound but
implausible for its wielder.

At least one hand-to-handle contact and every blade/head-to-handle join must be
visible enough to inspect. A hidden or unverifiable handle cannot pass.

For longswords, greatswords, zweihänders, and other oversized swords, this
contact rule becomes stricter: show both hands completely on the researched
grip, behind the guard and between guard and pommel, with visible separation
from the blade. Do not depict half-swording, ricasso or forte gripping, mordhau,
a hand crossing the guard, or any armored or gloved hand touching the blade.
The grip must be visibly long enough for both closed hands without overlap. If
the handle cannot fit both hands or the pose hides the contact, change the
subtype, grip dimensions, pose, or framing before generation.

## Project-Wide Female Proportion and Identity Direction

For adult female characters, use the user's 2026-07-30 proportion reference
only for broad anatomy. Do not copy its pose, costume, hairstyle, face, weapon,
green palette, pedestal, or exact silhouette.

Use an attractive, unmistakably adult young woman with an apparent age of
approximately 21–35. She must look youthful, not juvenile or age-ambiguous.
Use a figure approximately 7.5–8 heads high, not an elongated nine-head fashion
figure. Give her long but plausible legs, a balanced ribcage and pelvis, natural
shoulder width, a moderately defined waist without pinching, and hips only
modestly wider than the shoulders. Keep the chest naturally proportionate to
the torso and never oversized.

The result must read as feminine, capable, and grounded rather than sexualized.
Avoid an extreme hourglass, wasp waist, oversized breasts, emphasized cleavage,
exaggerated hips, thighs, or buttocks, arched-back pin-up posture, chest-forward
posing, fetishized camera angles, or clothing and armor molded around each
breast. Clothing and armor must follow functional construction and sit
believably over the body.

Female faces must remain individually recognizable even when hair, clothing,
and palette are ignored. For every wave containing more than one woman, assign
each concept a different combination of:

- face shape and facial length;
- jaw width and chin shape;
- brow weight and eyebrow arc;
- eye shape, spacing, and lid structure;
- nose bridge, length, and tip;
- mouth width, lip shape, and resting expression;
- cheek structure, age cues, hairline, and visible profile.

Make every face visibly attractive through coherent proportions, readable eyes,
well-formed features, setting-compatible grooming, and a composed, severe, or
character-appropriate expression. Do not turn “attractive” into one generic
beauty template, glossy modern glamour, heavy beauty-filter styling, or
sexualized presentation. Different face shapes, noses, eyes, mouths, jaws, and
skin tones can all be attractive.

The overall face must read as distinctly feminine. Use varied feminine
combinations of tapered, oval, heart-shaped, or softly rounded-square facial
structure; a balanced jaw and refined chin; readable cheek structure; gently
shaped brows; mature feminine eyes; and a clearly formed mouth. Do not combine
multiple strongly masculine-coded traits into the result: pronounced brow
ridge, very broad square jaw, oversized blocky chin, heavy low brows, coarse
angular planes, or a thick masculine neck. Preserve varied,
brief-appropriate facial diversity; femininity does not require one ethnicity,
narrow nose, skin tone, eye shape, or repeated doll-like face.

Do not reuse one face template with different hair. At least four structural
facial axes must differ between any two women, and hairstyle cannot count as one
of those four.

Reject any face or body that could be mistaken for a minor. Do not use
teenager or schoolgirl cues, a childlike head-to-body ratio, disproportionately
oversized childlike eyes, undeveloped facial planes, an immature jaw and chin,
or childlike posture or clothing. Youthfulness must always remain clearly
adult.

The setting is war-torn, so keep female hairstyles restrained, practical, and
battle ready rather than fancy. Prefer a single secured braid, low braided bun,
plain low bun, simple wrapped or pinned hair, low tied ponytail,
shoulder-length hair tucked behind the ears or partly secured, a chin-length
bob, soft pixie, side-swept crop, or short layered cut with a feminine contour.
Hair should look self-maintained under difficult conditions, with limited
volume and only a few natural loose strands.

Keep hair clear of the eyes, mouth, armor joints, hood or helmet fit, weapon
hands, shield grips, and crossbow rail, string, trigger, and stock. Do not use
long loose combat hair, elaborate braided crowns, multiple decorative braids,
towering or sculpted buns, cascading salon curls, ornate hair jewelry, flowers,
ribbons, excessive pins, ceremonial hair architecture, or dramatic windblown
volume. Short hair is allowed, but it must not become a buzz cut, shaved-side
undercut, mohawk, fauxhawk, high-and-tight, graphic shaved pattern, neon or
multicolor fantasy dye, or another overtly contemporary statement style that
conflicts with the setting.

Do not assign or infer sexual orientation from facial features, hairstyle,
clothing, or body type. Unless a narrative brief explicitly requires a
relationship, present each woman as an isolated individual with no romantic,
couple, courtship, or sexual signaling.

## Category Routing

Load only the matching category modules:

| Brief | Load |
| --- | --- |
| Knight, armored humanoid, soldier, warrior nun | `CHARACTERS.md` + `KNIGHTS.md`; when it is an enemy, also load the relevant enemy specification sections |
| Crimson Knight, player, protagonist | `CHARACTERS.md` + `KNIGHTS.md` + `CRIMSON-KNIGHT.md` + `ASSET-SPEC.md` |
| Demon or infernal humanoid | `CHARACTERS.md` + `DEMONS.md` + relevant parts of `ENEMY-ASSET-SPEC.md` |
| Angel or corrupted angel | `CHARACTERS.md` + `ANGELS.md` |
| Other isolated enemy, NPC, creature, or person | `CHARACTERS.md` + relevant parts of `ENEMY-ASSET-SPEC.md` |
| Boss | `CHARACTERS.md` + `BOSSES.md` |
| Environment, room, area, market, garden, crossing | `ENVIRONMENTS.md` |
| Scene, redemption, anthology | `SCENES.md` |

Apply more than one category module only when the subject genuinely crosses
categories. For example, a demon knight loads `CHARACTERS.md`, `KNIGHTS.md`,
and `DEMONS.md`; a normal forest knight does not load `DEMONS.md`.

When loading a large specification such as `ASSET-SPEC.md` or
`ENEMY-ASSET-SPEC.md`, read only the sections relevant to the routed category
unless a project instruction explicitly requires the whole file.

For an enemy-category subject, the relevant current specifications are
`ENEMY-ASSET-SPEC.md` and
`collections/enemies/ENEMY-ART-DIRECTION-FEEDBACK.md`. Extract only the rules
that apply to the requested family; do not carry unrelated enemy families into
the generation prompt.

## Interpreting a Terse Brief

Read a request as:

`[total quantity] [subject or family] [optional modifiers]`

Examples:

- `5 forest knights`
- `3 corrupted river angels`
- `1 bell giant boss`
- `2 flooded market rooms`
- `4 crimson knight helmet orders`
- `1 redemption scene: a soldier protecting civilians`

If quantity is omitted, default to one. Generate one distinct asset per image
and use one generation call per concept. A requested quantity is the total
desired count, handled in review waves of no more than five.

### Retry budget

Token and generation cost are part of render quality. Do not spend an
open-ended number of calls trying to force one concept through a hard gate.

- Default to at most **two generator outputs per concept**: one initial
  generation and one targeted correction.
- Default to at most **two correction calls across an entire review wave**,
  even when the wave contains five concepts.
- Every returned output still enters ordered attempt history and counts against
  the budget, including obvious failures, near-duplicates, and outputs rejected
  before Catalog placement.
- When a concept still fails after its allowed correction, mark that concept
  failed for the wave and continue to the next distinct planned concept when
  safe. Do not keep regenerating the same identity.
- For an armed concept, reaching the retry cap closes the serial equipment gate
  as a failed/abandoned concept. It permits moving to the next concept but never
  permits accepting the malformed weapon.
- A repeated background, rendering-medium, anatomy, equipment, or direction
  failure does not create extra retries.
- Additional retries require the user's new, explicit approval for the named
  concept. Ask only after reporting the attempts already spent and the exact
  unresolved defect.

Attempt preservation is a history requirement, not permission to exhaust the
user's generation budget. A request for five characters means five distinct
concept slots—not five retries of one slot.

### Gender-neutral brief lock

A gender-neutral family name such as `knights`, `vampire knights`, `soldiers`,
`warriors`, or `cultists` does not authorize an all-woman or all-man wave.
Do not inherit a single-gender assumption from an older batch merely because
its subject name is the closest collection match. Inherit that direction only
when the user explicitly says to continue that collection, names a gender, or
the requested family name itself is gender-specific.

For a new plural gender-neutral brief with no gender instruction, use a mixed
adult cast while keeping gender secondary to gameplay role and design. For an
odd five-character wave, default to three adults of one gender and two of the
other, varying which gender has three across future waves. Do not make gender
the only difference between concepts, and do not turn the wave into a generic
demographic checklist.

When a term is mildly ambiguous, choose the safest interpretation, state it in
one sentence, and proceed. Ask only when different interpretations would
materially change the deliverable and no safe default exists.

## Instruction Precedence

When instructions conflict:

1. The user's newest direct instruction.
2. The newest active category or collection specification.
3. The routed render contracts.
4. Compatible traits from a positive reference named for the current request.
5. Older prompts and exploratory drafts.

Rejected work is evidence of what not to repeat, never a positive reference.
A new positive reference, category specification, or collection note controls
visual direction only where compatible with active project-wide locks. A
direct user instruction may explicitly reverse a lock.

## Prompt Assembly

Build each image-generation prompt from only:

1. The specific concept and gameplay role.
2. Applicable rules from `CORE.md`.
3. Applicable rules from the routed category module or modules.
4. Current collection decisions and compatible positive-reference traits.

Do not mention or negate unrelated categories. A knight prompt should not
contain angel, boss, environment, or anthology instructions.

Every assembled prompt must remain compatible with the project-wide `1:1`
canvas lock, background lock, no-spell lock, weapon geometry lock, and female
proportion-and-identity direction.
