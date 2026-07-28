# The Balete Moon Garden — Balanced Detail and Transparency

## Correction

The v02 simplification removed more environmental and character information
than intended. This revision returns to the richer generated grove source while
keeping the 384 × 216 native game grid and genuine spectral transparency.

## Environment treatment

- Preserve the earlier grove composition, vegetation, root architecture,
  moonlight, fireflies, shrine, platforms, water, and reflections.
- Resize once to 384 × 216 with nearest-neighbor sampling.
- Use 48 environment colors without dithering. This preserves distinct forest
  greens, moss, bark browns, moonlit blues, stone, water, and gold accents.
- Do not apply the 14-color broad-shape simplification from v02.

## White Lady treatment

- Use the richer Balete Bride redraw as the identity and detail source.
- Preserve the face, hair, veil folds, layered dress, woven sash, remembrance
  beads, bare feet, and exactly three pale root wisps.
- Prepare one 96 × 96 mockup cutout using 24 RGBA colors.
- Apply partial alpha to every visible sprite pixel. The nonzero alpha range is
  133–181 of 255, so no White Lady pixel is fully opaque.
- Keep the original pearl, ivory, silver, charcoal, and cold blue-grey palette.
  Do not tint the White Lady green.

## Draft status

The balanced room, translucent cutout, and populated mockup remain unapproved
drafts and are not canonical production assets.
