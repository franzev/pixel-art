# The Balete Moon Garden — Simplified Translucent Correction

## Problems corrected

- The first room contained too many individual fern leaflets, bark marks,
  stones, vines, reflections, and small color transitions.
- The first populated mockup used a fully opaque White Lady.

## Corrected workflow

1. Use the earlier empty room only as a biome and layout reference.
2. Redraw the environment from scratch with large connected shapes.
3. Treat the result as a native 384 × 216 room.
4. Reduce the room to exactly 14 flat colors without dithering.
5. Keep the existing 96 × 96 Balete Bride design and palette unchanged.
6. Convert every nontransparent White Lady pixel to partial spectral alpha.
   Dark pixels use lower opacity and pearl highlights use slightly higher
   opacity. The resulting nonzero alpha range is 113–167 of 255.
7. Composite that exact translucent cutout over the empty room.

## Empty environment prompt

Use case: style-transfer

Asset type: corrected empty side-scrolling game environment plate

Input image role: Layout and biome reference only. Preserve the same broad
traversal layout—left balete trunk and shrine, central root arch and open combat
space, main causeway with one short gap, shallow water, and raised root platform
at right—but redraw the entire environment from scratch at a much simpler
native game-pixel level.

Primary correction: The reference contains too many leaf clusters, fern teeth,
bark marks, stones, vines, highlights, and small color changes. Replace them
with large, clean, connected pixel masses. The corrected room must look authored
directly at 384 × 216, not like a detailed illustration reduced afterward.

Style/medium: Strict low-resolution side-scroller pixel art with hard square
logical pixels and an exact maximum of 14 flat colors across the environment.
Use large connected clusters at least 3–8 logical pixels wide. Use two shades
per material, with one optional highlight only on the main gameplay edge. No
gradients, anti-aliasing, blur, dithering, or one-pixel texture noise.

Vegetation simplification: Use exactly four major foliage clumps. Each clump is
one broad silhouette made from 3–5 large leaves; do not draw individual fern
leaflets. Render each balete trunk as three broad value bands with no bark
scratches. Render moss only as continuous solid strips on walkable edges. Use no
more than six hanging vines, each a thick stepped line. The distant jungle is
two flat overlapping silhouette bands rather than hundreds of leaves.

Architecture simplification: The shrine is a plain blocky doorway made from five
stone rectangles. The causeway is a solid dark slab with one lighter walkable
edge strip and only six large stone divisions across the screen. The right
platform and steps are broad root-and-stone blocks without brick lines or small
crevices. Water uses three wide horizontal color bands and exactly four broad
reflection clusters.

Composition: Strict orthographic 16:9 side view. Preserve one central gap and
one raised platform at right. Keep the central play space quiet and empty for
one 96 × 96 actor. No perspective floor.

Palette: Consolidate vegetation to four colors: deep forest green, rich leaf
green, moss green, and one restrained yellow-green highlight. Add warm
near-black, dark blue night, moonlit blue, two bark browns, two stone greys,
pale moonlight, and muted gold. The sky remains dark blue and warm near-black,
never a flat green background. Greens belong only to vegetation.

Constraints: Environment only. No people, White Lady, ghosts, creatures,
statues, faces, or body-like silhouettes. Preserve empty negative space around
the future actor position.

Avoid individual leaflets, repeated fern teeth, bark grain, brick texture, tiny
flowers, scattered grass pixels, many small branches, detailed reflections,
green fog, green magical glow, dense color transitions, microtexture, painterly
shading, gradients, blur, anti-aliasing, excessive dithering, text, UI, borders,
and watermarks.

## Draft status

The simplified room, translucent character cutout, and populated mockup remain
unapproved drafts. They are not canonical tiles or production animation assets.
