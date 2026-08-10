# The Ashen Archive — UI Design Contract

The gallery is an art-first working archive. Its interface should feel like a
quiet contact sheet: dense, deliberate, and subordinate to the renders.

## Information architecture

- **Library** contains canonical catalog renders only. Selecting a tile inspects
  it; entering Review is always an explicit action.
- **Review** is the workflow hub for New candidates, Needs redo, Waiting for
  replacement, and Marked for deletion.
- **Attempts** groups preserved outputs by generation series. A series opens to
  a chronological filmstrip instead of adding every attempt to the main grid.

Do not mix workflow queues into Library filters. Do not treat an Attempt as a
canonical catalog render.

## Interaction rules

- Desktop uses a master-detail Library and Attempts layout.
- Tablet and mobile open the selected item in a focused viewer.
- Rating and decision are separate actions. A five-star rating never makes an
  automatic Keep decision.
- Before/after comparison is shown only for a replacement candidate with a real
  catalog counterpart. Preserved raw attempts use a single-image review stage.
- Review keeps the favorite action visible immediately above the overall rating,
  followed by outcome. Tags, defects, and notes live under **Details & notes**
  until needed.
- Search is global to the active browsing workspace. Typing from Review returns
  to Library search.

## Reusable components

- `ActionButton`: primary, secondary, ghost, and segment variants; compact and
  regular sizes.
- `SegmentedControl`: mutually exclusive compact filters with optional counts.
- `LibraryToolbar`: quick Library views, filter entry points, sort, and tile
  density.
- `FilterSection`: expanded on tablet/desktop and collapsible on mobile.
- `RenderViewer`: focused catalog inspection with explicit Review action.
- `ReviewWorkspace`: actionable queue destination and decision ledger.

New controls should extend these components before introducing another local
button treatment or segmented selector.

## Visual language

- Preserve the charcoal, bone, brass, and muted-crimson palette in
  `app/_styles/foundation.css`.
- Use rules, spacing, and tonal surfaces for hierarchy. Avoid decorative cards,
  gradients used as ornament, and competing accent colors.
- Render imagery stays uncropped (`object-fit: contain`) with pixel rendering
  preserved where appropriate.
- Uppercase mono labels are reserved for navigation, state, metadata, and short
  actions. Titles and explanatory copy use normal sentence casing.
- Keep borders square and motion restrained. Every hover treatment must have a
  corresponding keyboard focus state.

## Responsive contract

- **Desktop (1024px+)**: fixed inspector, dense contact sheet, three-column
  expanded filter drawer.
- **Tablet (640–1023px)**: no fixed inspector; tile selection opens a viewer;
  workspace navigation remains in the header.
- **Mobile (<640px)**: two-column grid, bottom workspace navigation, horizontally
  scrollable compact toolbars, collapsed filter sections, and filter actions
  fixed above the bottom navigation.

The page must never widen beyond the viewport. Dialog content must constrain
native scroll-area intrinsic sizing so Close and primary actions remain
reachable.

## Terminology

Use these labels consistently:

| Avoid | Use |
| --- | --- |
| Catalog (as a workspace) | Library |
| History | Attempts |
| Unreviewed outputs | New candidates |
| Redo originals | Needs redo |
| Awaiting generation | Waiting for replacement |
| Successful output | Candidate |
| Current catalog | In Library |

Internal data names may retain legacy values where changing persisted formats
would be unsafe; visible UI copy follows this table.
