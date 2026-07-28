# The Starless Observatory Cloister — Tile-Scale Enemy Fit Test

## Workflow

1. Generate a completely empty environment plate with no people, enemies,
   creatures, statues, or supernatural silhouettes.
2. Treat the environment as a 384 × 216 native pixel-art canvas.
3. Reduce the empty environment to 14 flat colors without dithering.
4. Prepare transparent 96 × 96 mockup cutouts from the approved v04 redraws of
   the Lantern-Faced Novice, Starless Astrologer, and Blind Standard-Bearer.
5. Composite the exact cutouts over the native environment. Do not ask the
   image-generation model to recreate the enemies inside the scene.
6. Review the result against an implied 24 × 24 gameplay grid.

## Empty environment prompt

Use case: stylized-concept

Asset type: empty side-scrolling game environment plate and tile-scale mockup
base

Primary request: Create a completely character-free 16:9 side-view room called
the Starless Observatory Cloister for a dark gothic Metroidvania. It must look
like native low-resolution game pixel art, not cinematic concept art.

Scene/backdrop: A ruined open-air ritual observatory at night. A broad stone
processional floor crosses the lower middle with one short jumpable gap. At
left, a squat roofed lantern alcove and three large stone steps. At center rear,
one enormous broken circular brass eclipse instrument is embedded into a simple
masonry arch, shown as a bold silhouette with only a few thick braces and
exactly three large black discs. At right, a raised stone platform stands above
the main floor and is reached by a short broken stair. The distant background
contains two simple ruined tower silhouettes, a low ridge, and a starless
near-black sky. Include only two hanging chains, three broad fallen stone
blocks, and two tiny dull amber lamps. No people, cultists, creatures, ghosts,
statues, faces, body-like silhouettes, banners, or magical figures.

Style/medium: Work as though authored directly on a virtual 384 × 216 pixel
canvas. Use coarse, consistent hard square pixels, large connected clusters,
stepped edges, broad flat shapes, approximately 14 meaningful colors, and two
shades per material with an optional highlight. Use simple tile-friendly
construction on an implied 24 × 24 grid.

Composition/framing: Strict orthographic side view with a playable horizontal
layout, a clear traversal gap, uncluttered combat space, and no perspective
floor plane.

Lighting/mood: Dim, solemn, dry, and moonless, with only two restrained amber
practical lights. No bloom or volumetric lighting.

Color palette: Warm near-black sky, soot charcoal, ash grey, brown-black stone,
dusty taupe, muted umber, aged dull brass, and tiny ochre and amber accents.
Never use green. Avoid bright blue, cyan, purple, or red magical replacement
colors.

Constraints: Environment only. Preserve large areas of negative space where
96 × 96 sprites can stand. Platform thickness and architectural pieces should
suggest 24-pixel tile modules. Every logical pixel cell should appear consistent
in size, and the room must remain readable at actual 384 × 216.

Avoid: Characters, enemies, human silhouettes, decorative figure carvings,
green backgrounds, microtexture, individual bricks everywhere, noisy stone
speckles, tiny star fields, elaborate filigree, dense rubble, smooth gradients,
blur, anti-aliasing, painterly rendering, soft edges, excessive dithering,
isolated noise pixels, fog, bloom, UI, text, labels, borders, and watermarks.

## Enemy placement

- Starless Astrologer: main floor at left
- Lantern-Faced Novice: main floor at center
- Blind Standard-Bearer: raised platform at right

Each enemy remains inside its original 96 × 96 frame. The composed scene is a
scale and readability study, not a finalized production room, animation set, or
canonical tileset.
