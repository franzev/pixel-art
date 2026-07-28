# Pixel-Art Asset Specification

**Status:** Canonical baseline  
**Version:** 2.0

## Reference Roles

### Primary character reference

`/Users/franz/Desktop/knight.png`

This image is authoritative for:

- Character identity and overall silhouette
- Tall body proportions
- Helmet shape
- Armor construction
- Sword type and scale
- Crimson fabric placement
- Cape length and mass
- Weary, controlled presence

### Pixel-treatment reference

`/Users/franz/Desktop/Penitent_One_Skin_09.webp`

This image is authoritative only for:

- In-game pixel density
- Connected cluster construction
- Selective highlights
- Restrained color ramps
- Readability at native size
- Clear weapon and limb separation

Do not copy its conical helmet, crouched proportions, teal-and-rust costume,
religious imagery, exact pose, or silhouette.

## Creative Direction

Create an original, tall dark-fantasy knight for a side-scrolling Metroidvania.
The knight should look like a production sprite derived from `knight.png`, not
like a redesign of the Penitent One and not like a reduced concept painting.

The character is:

- Tall and approximately 7–7.5 heads high
- Medium-armored rather than extremely bulky
- Upright with slightly bent knees and a wide stable stance
- Weary but vigilant
- Equipped with one long one-handed sword
- Empty-handed on the off side
- Draped in a long, torn crimson cape

## Native Canvas and Scale

| Property | Canonical value |
| --- | --- |
| Native frame | 96 × 96 pixels |
| Character height | 70–74 pixels |
| Starting target | 72 pixels |
| Helmeted head height | 9–10 pixels |
| Shoulder span | 24–27 pixels |
| Hip width | 13–16 pixels |
| Planted foot span | 28–34 pixels |
| Ground baseline | Row 90, consistently |
| Preview scale | 6× nearest-neighbor |
| Preview size | 576 × 576 pixels |
| Preview background | Warm charcoal `#171311` |
| Production background | Transparent |

The character must feel tall because of long legs, a compact helmet, a narrow
waist, and controlled shoulder width—not because of a decorative helmet crest.

## Body Proportions

- Use 7–7.5-head adult proportions.
- Keep the helmet compact relative to the body.
- Place the crotch slightly above the vertical midpoint.
- Legs from crotch to soles occupy approximately 38–41 pixels.
- Keep the waist visibly narrower than the shoulders.
- Hands end around upper-to-mid thigh.
- Keep gloves and boots proportional; do not enlarge them for readability.
- Use a wide but natural stance with slightly bent knees.
- Turn the torso three-quarters toward the viewer while directing attention
  screen-left.
- Preserve negative space between both legs and between the empty hand and hip.

Automatic proportion failures:

- Head larger than 10 pixels
- Character shorter than 68 pixels
- Crouched, compressed, or six-head anatomy
- Oversized pauldrons that make the torso look top-heavy
- Short legs or large boots

## Helmet

Use the primary reference's helmet language:

- Rounded closed sallet or armet
- Narrow horizontal eye slit
- Subtle central ridge
- Slightly extended rear plate
- No cone, horn, plume, crown, or religious ornament
- No oversized faceplate

The visor may contain one restrained warm highlight, but there should be no
large glowing eyes or magical aura.

## Armor

Use dark, weathered medium plate:

- Rounded breastplate
- One somewhat stronger sword-side pauldron
- Smaller opposite shoulder treatment
- Chainmail or deep shadow at joints
- Layered forearm guards
- Compact hip plates
- Knee and shin plates that keep leg anatomy readable
- Restrained dark leather belt and attachments

Simplify these components into large pixel clusters. Do not render every rivet,
chain link, scratch, seam, or overlapping plate.

## Cape and Crimson Fabric

The cape is a defining feature and must not be shortened into a shoulder mantle.

- Begin as a crimson scarf or mantle around both shoulders.
- Flow behind the body toward screen-right.
- End around the lower calf, approximately 42–48 pixels below its shoulder
  attachment.
- Use three or four broad torn tails.
- Keep a large readable crimson mass rather than many narrow strands.
- Allow parts of the cape to pass behind the rear leg.
- Do not cover the forward leg, both feet, sword hand, or off-hand silhouette.
- Include a restrained crimson front tabard ending around the upper thigh.

The cape should be large enough to produce visible secondary motion during an
idle loop, but it must not touch the ground.

## Sword

- Exactly one straight one-handed longsword
- Total weapon length: 48–54 pixels
- Visible blade length: 42–48 pixels
- Blade width: 2–3 pixels at native resolution
- Crossguard width: 7–9 pixels
- Held low and diagonally downward
- Sword tip approaches the lower frame boundary without touching it
- Bright edge, mid-steel center, and dark back edge

The sword must read as long and dangerous. Reject short swords, daggers,
greatswords, extremely broad blades, curved blades, and additional weapons.

## Palette

Target 12–14 character colors; hard maximum 16. Transparency and preview
background do not count.

Recommended roles:

| Role | Starting color |
| --- | --- |
| Deepest gap | `#100F12` |
| Cool shadow | `#1E222D` |
| Dark steel | `#343B48` |
| Mid steel | `#566170` |
| Light steel | `#8993A0` |
| Warm metal highlight | `#D1C7B5` |
| Deep crimson | `#40151D` |
| Mid crimson | `#762532` |
| Crimson highlight | `#AA3C45` |
| Dark leather | `#33231C` |
| Mid leather | `#62402C` |
| Chainmail shadow | `#272831` |
| Optional ember accent | `#B04A32` |
| Optional muted cloth | `#463B46` |

Steel and near-black dominate. Crimson is the only strong color family. Use the
optional ember accent for no more than a few isolated seam pixels.

## Pixel Technique

- Draw directly for the 96 × 96 native frame.
- Use hard square pixels and connected clusters.
- Use nearest-neighbor scaling only.
- No anti-aliasing, blur, gradients, or soft digital painting.
- No automatic black outline around every internal plate.
- Use one-pixel highlights only where they clarify major planes.
- Avoid noisy isolated pixels and surface texture.
- Use no dithering by default.
- Judge every sprite at 1× size before approval.

The artwork must look intentionally drawn at native resolution. Pixelating or
downscaling a detailed concept illustration is not acceptable.

## Canonical Idle Pose

- Face and sword direction: screen-left
- Torso: three-quarter view
- Weight: mostly on screen-right leg
- Knees: slightly bent, not crouched
- Feet: widely but naturally planted
- Sword: low diagonal guard
- Off-hand: empty and relaxed near hip
- Cape: trailing toward screen-right
- Head: level or very slightly bowed

The resulting silhouette should combine:

1. A tall armored vertical body
2. A long diagonal sword
3. A large trailing crimson cape

It must remain recognizable when filled with one solid color.

## Canonical Idle Animation

**Asset name:** `knight_idle_v01`  
**Frames:** 6  
**Native sprite sheet:** 576 × 96 pixels  
**Loop duration:** approximately 1,000–1,200 ms

Animation rules:

- Keep both boots and the ground baseline fixed.
- Raise the chest and shoulders by no more than one pixel.
- Keep the hips stable.
- Keep the helmet fixed or allow a single one-pixel response.
- Limit sword-tip movement to one or two pixels.
- Let the cape respond one frame after the shoulders.
- Send a slow wave from the cape attachment toward the torn tails.
- Allow the final cape tail to settle one or two frames after the torso.
- Avoid reversing all body and cloth motion simultaneously.
- Ensure the final frame loops cleanly into the first.

## Generation Prompt

> Use `knight.png` as the authoritative reference for the character's tall
> proportions, rounded closed sallet, dark layered armor, long one-handed sword,
> empty off-hand, crimson front tabard, and long torn crimson cape. Use the
> Penitent One WebP only as a reference for native in-game pixel clustering,
> restrained shading, and readability; do not copy its helmet, costume, colors,
> crouched anatomy, pose, or silhouette. Create one original production-scale
> Metroidvania knight directly on an implied native 96 × 96 grid. The knight is
> 70–74 pixels tall with a 9–10-pixel helmeted head, 7–7.5-head proportions,
> long legs, narrow waist, 24–27-pixel shoulders, and a wide upright combat
> stance with slightly bent knees. Give him one 42–48-pixel visible straight
> sword blade held diagonally downward and a long crimson cape flowing behind
> him to the lower calf with three or four broad torn tails. Use 12–14 colors,
> large connected clusters, selective one-pixel highlights, and no
> anti-aliasing, gradients, painterly detail, microtexture, extra weapon,
> shield, text, logo, scenery, or copied game character. Present the preview at
> 6× nearest-neighbor on warm charcoal, never green.

## Deliverables

For an approved animation:

- Transparent 96 × 96 PNG frames
- Transparent 576 × 96 PNG sprite sheet
- Square 256 × 256 PNG reference image, centered and exported with
  nearest-neighbor scaling
- 6× nearest-neighbor preview on warm charcoal
- Animated preview
- Palette swatch
- Frame-timing data
- Ground anchor

## Acceptance Checklist

- [ ] Frame is 96 × 96 pixels.
- [ ] Character is 70–74 pixels tall.
- [ ] Helmeted head is no more than 10 pixels tall.
- [ ] Body reads as 7–7.5 heads high.
- [ ] Legs occupy more than half the body height.
- [ ] Character is upright with only slightly bent knees.
- [ ] Sword blade is 42–48 pixels long.
- [ ] Cape reaches the lower calf without touching the ground.
- [ ] Cape has three or four broad readable tails.
- [ ] Off-hand is empty and separated from the hip.
- [ ] Design matches `knight.png` rather than the Penitent One.
- [ ] Palette uses no more than 16 character colors.
- [ ] Pixel clusters read clearly at 1×.
- [ ] No anti-aliasing, gradients, blur, or texture noise.
- [ ] Production asset has transparency.
- [ ] A centered 256 × 256 PNG reference image is saved alongside the
      production asset.
- [ ] Preview uses warm charcoal and nearest-neighbor scaling.

## Automatic Rejection Conditions

Reject or revise an asset when:

- The character is short, crouched, compressed, or copied from the Penitent
  reference.
- The head or helmet is oversized.
- The cape ends above the knee or reads as a small shoulder mantle.
- The sword is short, excessively broad, curved, or two-handed.
- The output looks like a large concept illustration that was pixelated.
- Armor detail creates noise or exceeds the palette budget.
- The cape hides both legs or touches the ground.
- The pose loses the tall-body, diagonal-sword, trailing-cape silhouette.
