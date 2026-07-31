# Equipment Research and Handle Contract

Last researched: 2026-07-31

Load this file whenever a character carries a weapon, shield, or weapon-like
tool. Handle and grip research is a blocking prerequisite, not an optional
quality improvement.

## Research Gate

Before writing the image-generation prompt:

1. Identify the exact equipment type, subtype, culture, period, and intended
   use. Do not prompt with a generic label such as `sword`, `axe`, `shield`, or
   `crossbow`.
2. Find at least one authoritative object record with measurements and clear
   full-profile images. Prefer museum collections, surviving artifacts,
   digitized historical manuals, or an official manufacturer manual for modern
   equipment.
3. Obtain at least two usable equipment views:
   - a complete side or three-quarter profile;
   - a close handle, hilt, socket, trigger, or shield-back view.
4. When one record does not show the hidden construction, find a second
   authoritative source. Never invent the reverse of a shield, the interior of a
   socket, or a trigger mechanism from an exterior view.
5. Record an `Equipment research` note before the exact generation prompt in
   the active collection's `GENERATION-PROMPTS.md`:

   ```text
   Equipment research
   - Exact type, culture, and period:
   - Authoritative sources:
   - Overall and component dimensions:
   - Handle, hilt, socket, or strap construction:
   - Correct hand count and contact points:
   - Intended pose and load path:
   ```

6. Use the authoritative equipment images directly as construction references
   when the generation system supports multiple image inputs. Label them as
   equipment references only, not edit targets or character-design references.
7. Put only the extracted visual facts in the image prompt. Do not paste URLs,
   research workflow, approval instructions, or source commentary into it.

If the handle construction or grip cannot be established, do not generate that
equipment. Research a better-documented conventional type or use a simpler
appropriate weapon. Never guess.

## Required Construction Facts

Every equipment prompt must specify:

- Exact overall length and handler-relative scale.
- Handle or grip length, shape, cross-section, and intended hand count.
- The components joined by the handle and their exact mechanical relationship.
- Which parts remain straight and which documented curves are intentional.
- Each hand's contact point, thumb side, finger closure, wrist direction, and
  forearm alignment.
- The weight path from the weapon or shield through the hand, wrist, forearm,
  stance, and body.
- Which handle and attachment details must remain visible for review.

Do not hide every hand-to-handle contact or the only blade/head-to-handle join
behind the body, cloth, shield face, or another prop. If the construction cannot
be inspected in the finished render, it cannot pass.

## Weapon-Specific Handle Rules

### Swords and daggers

- The exact researched subtype controls the hilt and grip; do not attach a
  generic crossguard and handle to every blade.
- For a typical European sword, the integral blade tang continues through the
  guard, grip, and pommel. These elements share a mechanically coherent axis,
  and the pommel locks and balances the assembly.
- The grip must be long enough for the researched one- or two-handed use.
  Hands stay between guard and pommel and never touch the blade.
- If the researched hilt includes finger rings, arms-of-the-hilt, or another
  specialized control feature, show the documented finger placement. Do not
  invent a finger loop or apply one type's grip to another type.
- The project prohibition on gripping the blade remains absolute even if an
  external historical source depicts half-swording.

### Longswords, greatswords, and oversized swords

- Treat the hand-to-grip arrangement as a blocking construction problem before
  selecting the pose. Record the usable grip length between guard and pommel
  and confirm that it can visibly contain the required one or two closed hands.
- For a two-handed oversized sword, both hands must close around the researched
  handle behind the guard. No finger, thumb, palm, glove, or gauntlet may cross
  the guard or touch the blade, forte, shoulder, or ricasso.
- Half-swording, ricasso gripping, blade gripping, mordhau, and a support hand
  placed on the blade flat are prohibited even when historically documented.
  This project always chooses a handle-only pose.
- Keep a clear visible gap or guard boundary between the forward hand and the
  blade. Do not disguise blade contact with a gauntlet, cloth wrap, shadow,
  overlap, or cropped hand.
- If both hands do not fit between guard and pommel, the generated hilt is
  structurally wrong. Lengthen it to the researched dimension, choose another
  documented subtype, or change the pose; never move a hand onto the blade to
  make the composition fit.
- Pose and frame the sword so a focused crop can show the complete guard, both
  hands, full usable grip, and pommel together. A dramatic oversized blade does
  not justify hiding its handle contacts.

### Axes, maces, hammers, spears, and polearms

- Research whether the head uses an eye, socket, langets, rivets, bindings, or a
  tang. Render the actual attachment method and enough insertion depth to read
  as load-bearing.
- A head may not float beside, merely touch, or sit laterally offset from its
  haft. The socket or eye must visibly receive the handle on the documented
  axis.
- Use straight shafts and handles by default. A shaped or angled haft is allowed
  only when the exact authoritative reference documents it and the prompt names
  that intentional geometry. Any unexplained bow, kink, wobble, or sudden
  direction change is a rejection.
- Match handle length and hand count to the researched weapon. Do not pair a
  two-handed axe or polearm with a shield or occupied off-hand.

### Shields

- Identify the shield as center-grip, enarmes/strapped, or another documented
  system before prompting.
- A center-grip shield places one handle on the reverse, normally behind or
  associated with the boss; the hand closes around that handle inside the
  protected space.
- A strapped shield uses the documented interior hand grip and forearm strap
  arrangement. Do not combine a center-grip boss with arbitrary exterior or
  outer-rim handles.
- Show the reverse-side attachment logic clearly enough to verify it. The
  handle, rivets, straps, hand, wrist, and forearm must form one plausible
  load-bearing system.
- Never place a usable handle on the decorated front face merely because that
  side is visible to the viewer.

### Crossbows

- Research the exact period and mechanism. A medieval or early-modern tiller,
  long release lever, nut, set trigger, safety, and spanning device must not be
  replaced with an invented modern pistol grip and trigger.
- Match the pose to the researched design. Some historical straight stocks were
  held lightly against the cheek rather than shouldered like a modern rifle.
- For a modern-style trigger pose, keep the support hand and every finger and
  thumb below the flight deck and outside the bowstring's release path.
- Until the character is actively firing, place the trigger finger straight
  along the side of the stock above the trigger. Only an explicitly firing pose
  places the fingertip on the trigger.
- The firing hand must wrap the documented stock, tiller, or grip without
  intersecting the trigger, guard, lever, safety, rail, string, or bolt.
- Bows, arrows, quivers, and loose or floating ammunition remain prohibited. If
  a loaded crossbow is specifically required, show exactly one correctly scaled
  short bolt or quarrel seated in the documented groove.

## Focused Review Gate

Before a render can be presented or saved as viable:

1. Compare the complete weapon profile with the authoritative full-profile
   reference.
2. Inspect a close crop of every hand-to-handle contact.
   For an oversized sword, the crop must show the guard, both complete hands,
   the full grip between them, and the pommel in one readable view.
3. Inspect a close crop of every blade/head-to-handle join, socket, or shield
   attachment.
4. For crossbows, inspect the support hand, firing hand, trigger finger, release
   mechanism, rail, and string path together.
5. Reject the render if a handle is hidden, invented, disconnected, bent,
   misaligned, incorrectly sized, or held with the wrong fingers.
6. Reject an oversized sword immediately if any hand touches or appears to
   touch the blade, forte, or ricasso; crosses the guard; overlaps the other
   hand implausibly; or does not fit completely on the grip.

Do not save or present a character whose body works but whose handle or grip is
wrong. Regenerate the equipment or the complete character first.

## Authoritative Research Baselines

These are construction examples and research starting points, not universal
templates:

- [Metropolitan Museum: sword and dagger pommel construction](https://resources.metmuseum.org/resources/metpublications/pdf/The_Metropolitan_Museum_Journal_v_46_2011.pdf)
- [Metropolitan Museum: Spanish smallsword hilt and finger-control features](https://www.metmuseum.org/art/collection/search/788276)
- [British Museum: Bronze Age shield with a riveted reverse handle](https://www.britishmuseum.org/collection/object/H_1888-0719-1)
- [British Museum: Italian buckler with an interior wooden hand-grip](https://www.britishmuseum.org/collection/object/H_1884-0410-2)
- [British Museum: two-handed battle-axe head, socket, and haft scale](https://www.britishmuseum.org/collection/object/H_1838-0110-2)
- [Metropolitan Museum: early-modern crossbow stock and release mechanism](https://www.metmuseum.org/art/collection/search/33739)
- [TenPoint official crossbow manual: foregrip, string-path, and trigger-finger safety](https://www.tenpointcrossbows.com/wp-content/uploads/2021/01/Tenpoint_2021_GeneralManual_Final.pdf)
