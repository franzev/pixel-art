# Environment Contract

Load this instead of `CHARACTERS.md` for rooms, areas, markets, gardens,
crossings, and other playable environment plates.

Default to an empty playable side-scrolling room:

- Generate the original full-quality environment concept on a square `1:1`
  canvas with output width equal to output height.
- Strict side view.
- Plan for a separately authored 384 × 216 native production plate unless the
  collection specifies another size. The native plate may be rectangular; it
  is not the original generated render and must not be produced by merely
  cropping, stretching, or padding a failed non-square generation.
- 24-pixel tile modules where appropriate.
- A clear traversable baseline and negative space for 96 × 96 actors.
- Readable platforms, hazards, entrances, and exits.
- Lower saturation and contrast than actors.
- Broad connected value masses without perspective floors or cinematic angles.
- No generated characters unless explicitly requested. Generate exact
  transparent character cutouts separately for populated mockups.

Natural green is allowed for vegetation, moss, vines, and living roots, but not
as a flat background, fog, magical wash, or character tint.

Avoid individual-leaf noise; excessive fern, bark, stone, vine, brick, rain,
reflection, or debris microtexture; accidental faces or ghost silhouettes in
scenery; and over-reduction that removes useful material detail.
