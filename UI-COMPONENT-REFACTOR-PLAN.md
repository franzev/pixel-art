# UI Component Extraction Refactor Plan

## Purpose

Break the existing React/Next.js UI into smaller, focused modules without
intentionally changing behavior, business logic, styling, accessibility
semantics, persistence, performance characteristics, or user-facing
functionality.

This is a pure extraction and organization refactor. The application should
behave exactly as it does before the work begins.

## Non-goals

Do not use this refactor to:

- Fix unrelated bugs.
- Redesign the interface.
- Change review, queue, filtering, favorite, or persistence behavior.
- Change keyboard shortcuts or focus behavior.
- Optimize catalog filtering or rendering.
- Change CSS class names, selector specificity, or responsive behavior.
- Introduce React Context, reducers, or another state-management library.
- Change catalog, API, database, or review data models.
- Reconcile stale documentation with current behavior.
- Migrate to CSS Modules.
- Introduce a new test framework.
- Reorganize the repository into `src/`.
- Add route groups.
- Deploy the application.

Record unrelated findings for separate work rather than repairing them inline.

## Repository cautions

- Read `AGENTS.md`, `README.md`, and `PRODUCT.md` before starting.
- The worktree was already heavily modified when this plan was written.
  Preserve all existing user work and never revert unrelated changes.
- `art-index.json` is generated catalog data. Avoid hand-editing it.
- Never edit the review export files by hand:
  - `art-catalog/RENDER-FEEDBACK.md`
  - `art-catalog/render-feedback.jsonl`
- Do not move, rename, delete, or rewrite files under `public/art/` as part of
  this work.
- Keep implementation steps small enough that the application remains
  buildable after each extraction cluster.

## Current architecture

| Current file | Role | Main concern |
| --- | --- | --- |
| `app/ArchiveGallery.tsx` | Entire gallery interface, filtering, preferences, virtualization, inspection, and review launching | Approximately 1,844 lines with many independent UI regions and effects |
| `app/ReviewDesk.tsx` | Review workflow, keyboard controls, queue navigation, image stage, and every review control | Approximately 779 lines with workflow logic interleaved with a large JSX tree |
| `app/globals.css` | Foundation, gallery, inspector, review, and responsive styling | Approximately 2,444 lines and strongly dependent on exact DOM nesting |
| `app/useReviewStore.ts` | Review loading, optimistic updates, offline outbox, and synchronization | Already reasonably focused |
| `app/AutoHideScrollArea.tsx` | Shared scrolling primitive | Already reasonably focused |
| `app/page.tsx` | Server entry and compact catalog preparation | Already an appropriate server/client seam |

## Behavior contracts that must remain unchanged

The implementation AI must preserve all of the following:

1. The server renders exactly 24 initial contact-sheet tiles.
2. The initial grid changes to bounded row virtualization only after hydration.
3. Virtualization retains:
   - Overscan of `3`.
   - Current row sizing and gap calculations.
   - Anchor retention when tile size changes.
   - Reset-to-top behavior when filters change.
   - Selected-item scrolling.
4. The first 12 grid images remain eager/high-priority.
5. Grid and inspector images continue using responsive image transforms.
6. The review surface continues loading the exact source PNG after its
   transformed preview.
7. A review session snapshots the currently filtered gallery with behavior
   equivalent to `setReviewItems(filteredItems)`.
8. Decisions made inside Review Desk must not remove the current render during
   its detail step or reshuffle the in-progress review queue.
9. Favorites continue using stable `renderId` values in local storage.
10. Tile-size preference continues using the current storage key, range, and
    validation.
11. Gallery filter state remains bookmarkable in the URL.
12. URL filter restoration remains hydration-safe and occurs once.
13. Development catalog polling remains suppressed while the filter drawer or
    Review Desk is busy.
14. Review writes remain optimistic and buffered through the existing local
    outbox.
15. Review shortcuts, gallery shortcuts, and their precedence remain unchanged.
16. Five-star ratings continue auto-keeping and advancing.
17. Delete continues bypassing the rating requirement and advancing.
18. Reject continues entering detail mode before advancing.
19. Notes continue saving before navigation, on blur, and when completing a
    detail review.
20. Undo continues retaining at most 30 prior review values.
21. Current DOM hierarchy, elements, ARIA attributes, roles, IDs, and class
    names remain unchanged unless a test proves the resulting markup is
    equivalent.
22. Existing responsive layouts and touch-target rules remain unchanged.

## Organization strategy

Use feature-first private folders under `app/`:

- `app/_features/archive/` for the interactive archive/gallery feature.
- `app/_features/review/` for Review Desk and review persistence.
- `app/_components/ui/` for genuinely shared UI primitives.
- `app/_styles/` only for the optional final mechanical stylesheet split.

Next.js supports private folders inside `app` for colocated non-route
implementation details. Keep `app/page.tsx` as the Server Component entry and
keep interactive behavior below focused client entry modules.

References:

- <https://nextjs.org/docs/app/getting-started/project-structure>
- <https://nextjs.org/docs/app/getting-started/server-and-client-components>
- <https://react.dev/learn/sharing-state-between-components>
- <https://react.dev/learn/preserving-and-resetting-state>
- <https://react.dev/learn/reusing-logic-with-custom-hooks>

## Naming conventions

- React module files: PascalCase, with a matching named export.
- Hooks: `useX.ts`.
- Pure model/configuration modules: lowercase kebab-case.
- Feature-local files stay in their feature folder.
- Keep prop types local to the module unless another module genuinely consumes
  them.
- Prefer direct imports during the refactor.
- Do not add barrel `index.ts` files; they can obscure the client seam and
  introduce dependency cycles.
- Prefer one meaningful React UI module per file.
- Do not extract tiny pass-through wrappers merely to shorten a file.

## Proposed target structure

```text
app/
├── _components/
│   └── ui/
│       └── AutoHideScrollArea.tsx
├── _features/
│   ├── archive/
│   │   ├── ArchiveGallery.tsx
│   │   ├── ArchiveHeader.tsx
│   │   ├── QuickFilterBar.tsx
│   │   ├── ActiveFilterStrip.tsx
│   │   ├── GalleryHeading.tsx
│   │   ├── GalleryEmptyState.tsx
│   │   ├── RenderInspector.tsx
│   │   ├── MobileRenderViewer.tsx
│   │   ├── archive-config.ts
│   │   ├── archive-filters.ts
│   │   ├── archive-types.ts
│   │   ├── filters/
│   │   │   ├── FilterDrawer.tsx
│   │   │   ├── FilterGroup.tsx
│   │   │   ├── CollectionFilter.tsx
│   │   │   └── RaceFilter.tsx
│   │   ├── grid/
│   │   │   ├── RenderGrid.tsx
│   │   │   ├── InitialRenderGrid.tsx
│   │   │   ├── VirtualizedRenderGrid.tsx
│   │   │   ├── RenderTile.tsx
│   │   │   └── PreviewImage.tsx
│   │   └── hooks/
│   │       ├── useGalleryPreferences.ts
│   │       ├── useGalleryFilters.ts
│   │       └── useCatalogAutoRefresh.ts
│   └── review/
│       ├── ReviewDesk.tsx
│       ├── ReviewDeskHeader.tsx
│       ├── ReviewCompleteState.tsx
│       ├── ReviewStage.tsx
│       ├── ReviewCanvasImage.tsx
│       ├── ReviewPanel.tsx
│       ├── RatingControl.tsx
│       ├── DecisionControl.tsx
│       ├── SuggestedTagsControl.tsx
│       ├── DefectControl.tsx
│       ├── FeedbackEditor.tsx
│       ├── FinishReviewButton.tsx
│       ├── review-config.ts
│       ├── review-model.ts
│       ├── review-queue.ts
│       └── useReviewStore.ts
├── _styles/
│   ├── foundation.css
│   ├── scroll-area.css
│   ├── archive.css
│   ├── review.css
│   └── responsive.css
├── api/
├── art-index.json
├── catalog-version.ts
├── gallery-catalog.ts
├── review-types.ts
├── globals.css
├── layout.tsx
└── page.tsx
```

The `_styles` split is optional and must happen only after the React extraction
is stable. `catalog-version.ts`, `gallery-catalog.ts`, and `review-types.ts`
remain at their current logical level during this refactor to avoid turning a
UI extraction into a cross-runtime domain reorganization.

---

## Change 1: Extract the archive filter model

### Current code

`app/ArchiveGallery.tsx`, primarily:

- Category and decision labels.
- Queue mapping.
- Tag group and storage constants.
- `FilterState` and defaults.
- URL serialization.
- Active-filter counting.
- Tag extraction.
- Item filtering.
- Tag option construction.

### Modules to extract

#### `app/_features/archive/archive-config.ts`

Responsibility:

- Category labels.
- Decision labels.
- Decision-to-review-queue mapping.
- Gender and race tag group constants.
- Favorite and tile preference storage keys.
- Initial render count.
- Grid geometry constants.
- Static lifecycle, decision, rating, and favorite options.

Why:

- These values define archive behavior and labels across several UI regions.
- Centralizing them avoids scattering them as files are split.

Dependencies:

- `ReviewDecision`.
- `ReviewQueue`.

Risks:

- Preserve exact labels, values, option order, storage keys, and numeric
  constants.
- Do not rename `"reject"` to match the displayed `"Redo"` label.

#### `app/_features/archive/archive-filters.ts`

Responsibility:

- `FilterState`.
- `DEFAULT_FILTER_STATE`.
- Copying filter state.
- URL filter key list.
- `filtersToSearchParams`.
- `activeFilterDimensionCount`.
- `tagValueFor`.
- `filterGalleryItems`.
- `tagFilterOptions`.

Why:

- These operations form one coherent pure archive-filter interface.
- They can be inspected and tested without rendering React.

Dependencies:

- `GalleryItem`.
- `ReviewMap`.
- Gender and race group constants from `archive-config.ts`.

Risks:

- Preserve locale-sensitive matching.
- Preserve collection OR behavior.
- Preserve lifecycle-rejected behavior.
- Preserve `"untagged"` behavior.
- Preserve decision and rating fallback rules.
- Preserve URL key and repeated collection parameter order.
- Do not optimize the repeated catalog scans during this task.

#### `app/_features/archive/archive-types.ts`

Responsibility:

- `ArchiveGalleryProps`.
- `FilterToken`.
- Empty-result recovery descriptor types.

Why:

- These types are local to the archive feature and should not remain buried in
  the large container.

---

## Change 2: Extract archive stateful hooks

### Current code

`app/ArchiveGallery.tsx`, primarily its state, effects, and derived filter
values.

### Modules to extract

#### `app/_features/archive/hooks/useGalleryPreferences.ts`

Responsibility:

- Favorite render IDs.
- Derived favorite ID set.
- Tile-size state.
- Post-hydration local-storage restoration.
- Validation of stored favorite IDs against the current catalog.
- Favorite and tile-size persistence.

Suggested interface:

```ts
type GalleryPreferences = {
  favoriteIds: Set<string>;
  tileSize: number;
  toggleFavorite: (renderId: string) => void;
  setTileSize: (size: number) => void;
};
```

Dependencies:

- Current `GalleryItem[]`.
- Existing storage keys.

Risks:

- Keep initialization hydration-safe.
- Keep stored favorites based on stable `renderId`.
- Keep the tile-size range and validation unchanged.
- Keep storage failures non-fatal.

#### `app/_features/archive/hooks/useGalleryFilters.ts`

Responsibility:

- Search query.
- Collection search query.
- Race search query.
- Filter state.
- Conditioned facet pools.
- Counts and options.
- Matching collections and races.
- Filtered items.
- Hidden rejected count.
- Active filter count.
- Filter tokens.
- Empty-result recovery.
- Grid reset key.
- One-time URL restoration.
- URL mirroring after restoration.
- Clear-all and filter update operations.

Dependencies:

- `GalleryItem[]`.
- `ReviewMap`.
- Favorite IDs.
- Pure operations from `archive-filters.ts`.
- Static options from `archive-config.ts`.

Risks:

- The hook must be called unconditionally by `ArchiveGallery`.
- Preserve effect order and the one-time URL restoration guard.
- Do not duplicate state in both the hook and the container.
- Keep collection/race search queries controlled so Clear All resets them.
- Do not change facet conditioning: each count excludes only its own active
  dimension.

#### `app/_features/archive/hooks/useCatalogAutoRefresh.ts`

Responsibility:

- Development-only `/api/catalog` polling.
- Catalog version comparison.
- Reload when the version changes.
- Avoid reload while the filter drawer or Review Desk is busy.
- Abort and interval cleanup.

Suggested interface:

```ts
useCatalogAutoRefresh({
  currentVersion: catalog.version,
  busy: filtersOpen || reviewOpen,
});
```

Risks:

- Remain disabled outside development.
- Preserve two-second polling.
- Preserve no-store requests and silent restart failures.
- Do not change busy behavior into a queued immediate reload.

### State that must remain in `ArchiveGallery`

- `selectedId`.
- Filter drawer visibility.
- Review Desk visibility.
- Review session item snapshot.
- Initial review queue.
- Gallery viewport element.
- Filter button and search refs.
- Viewer dialog ref.
- Gallery-level keyboard coordination.
- Review-store instance.

---

## Change 3: Extract the archive header and filter interface

### Current code

`app/ArchiveGallery.tsx`, mainly the JSX beginning at the root archive
application.

### React modules to extract

#### `app/_features/archive/ArchiveHeader.tsx`

Responsibility:

- Brand lockup.
- Search input.
- Search shortcut hint.
- Tile-size range control.

Props/dependencies:

- Search value and change callback.
- Search input ref.
- Tile size and change callback.

Risks:

- Preserve header grid structure.
- Preserve the input’s accessible name and placeholder.
- Preserve the ref required for the `/` shortcut.
- Preserve the range min, max, and step.

#### `app/_features/archive/QuickFilterBar.tsx`

Responsibility:

- Favorites quick filter.
- Unreviewed, keep, and redo quick filters.
- Five-star quick filter.
- Filter drawer toggle and active-filter count.

Props/dependencies:

- Current favorite, decision, and rating filters.
- Toggle callbacks.
- Drawer visibility.
- Drawer button ref.
- Active filter count.
- Open/close callback.

Risks:

- Preserve `aria-pressed`, `aria-expanded`, and `aria-controls`.
- Preserve quick-filter toggle-to-`"all"` behavior.
- Preserve the exact displayed labels.

#### `app/_features/archive/ActiveFilterStrip.tsx`

Responsibility:

- Render removable filter tokens.
- Render the keyboard shortcut hint when there are no tokens.

Props/dependencies:

- `FilterToken[]`.

Risks:

- Preserve token order.
- Preserve removal labels and accessible names.

#### `app/_features/archive/filters/FilterDrawer.tsx`

Responsibility:

- Drawer section layout.
- Escape handling.
- Composition of collection, subject, review, rating, and lifecycle filters.
- Footer clear, count, and done controls.

Props/dependencies:

- Controlled values, counts, options, and callbacks supplied by the container
  or filter hook.
- `AutoHideScrollArea`.

Risks:

- Do not add wrapper elements.
- Preserve `.filter-drawer-columns > .filter-section` nesting.
- Escape must stop propagation and close only the drawer.
- Preserve footer control order and disabled behavior.

#### `app/_features/archive/filters/FilterGroup.tsx`

Responsibility:

- Existing counted radio-group rendering.

Dependencies:

- `useId`.

Risks:

- Preserve fieldset/legend semantics.
- Preserve generated radio-group names.
- Preserve active and empty class calculations.

#### `app/_features/archive/filters/CollectionFilter.tsx`

Responsibility:

- Selected collection chips.
- Collection search input.
- Matching collection choices with counts.
- Status/hint copy.

Risks:

- Keep the search controlled.
- Preserve checkbox roles and `aria-checked`.
- Preserve the top-eight behavior and count sorting.
- Preserve search clearing after selecting an option.

#### `app/_features/archive/filters/RaceFilter.tsx`

Responsibility:

- Selected race chip.
- Race search.
- Matching race choices with counts.
- Status/hint copy.

Risks:

- Keep the search controlled.
- Preserve radio roles and toggle-back-to-all behavior.
- Preserve the top-eight behavior and count sorting.

#### `app/_features/archive/GalleryHeading.tsx`

Responsibility:

- Contact-sheet heading and total.
- Rejected-hidden note.
- Screen-reader status.
- Clear search/filter action.

Risks:

- Preserve clear-button label selection.
- Preserve screen-reader announcement text.

#### `app/_features/archive/GalleryEmptyState.tsx`

Responsibility:

- Favorites-only empty state.
- Best-constraint recovery state.
- Fully empty state.

Props/dependencies:

- Favorite filter status.
- Active-filter count.
- Query status.
- Empty recovery descriptor.
- Clear callbacks.

Risks:

- Preserve branch order.
- Preserve `freed > 0` behavior.
- Preserve pointer-fine and pointer-coarse instructional copy.

---

## Change 4: Extract the render grid

### Current code

`app/ArchiveGallery.tsx`:

- `PreviewImage`.
- `RenderTile`.
- `InitialRenderGrid`.
- `VirtualizedRenderGrid`.
- Post-hydration switch.

### React modules to extract

#### `app/_features/archive/grid/PreviewImage.tsx`

Responsibility:

- Responsive preview rendering.
- Eager/lazy behavior.
- Inspector/grid sizing.
- Loaded-state class.

Dependencies:

- `next/image`.
- `GalleryItem`.
- Grid preview sizes from `archive-config.ts`.

Risks:

- Preserve quality `82`.
- Preserve `objectFit: "contain"` as an inline style.
- Preserve eager `loading` and `fetchPriority`.
- Preserve inspector and grid `sizes` strings.

#### `app/_features/archive/grid/RenderTile.tsx`

Responsibility:

- One contact-sheet tile.
- Tile numbering.
- Title and metadata.
- Selection appearance.
- Open action.
- ARIA list metadata.

Risks:

- Preserve `data-render-index`.
- Preserve `aria-posinset` and `aria-setsize`.
- Preserve `aria-pressed` and accessible name.
- Preserve selection comparison using the item’s `id`.

#### `app/_features/archive/grid/InitialRenderGrid.tsx`

Responsibility:

- Server/hydration-safe first 24 items.

Risks:

- Render only `items.slice(0, INITIAL_RENDER_COUNT)`.
- Keep the first 12 eager.
- Preserve list role, ID, and CSS custom property.

#### `app/_features/archive/grid/VirtualizedRenderGrid.tsx`

Responsibility:

- Grid width and scroll-margin measurement.
- Column and row geometry.
- TanStack row virtualization.
- Render anchoring during tile-size changes.
- Reset-to-top behavior.
- Selection scrolling.

Dependencies:

- `@tanstack/react-virtual`.
- `ResizeObserver`.
- Layout and standard effects.
- Grid geometry constants.

Risks:

- Preserve overscan `3`.
- Preserve gap and tile chrome calculations.
- Preserve `window.resize` and element observer behavior.
- Preserve mutable virtualizer measurement behavior and lint suppression.
- Preserve anchor capture from the first virtual row.
- Preserve actual-selection-change tracking.
- Preserve row and tile keys.
- Preserve `data-row-index`, `data-index`, transforms, and scroll margin.

#### `app/_features/archive/grid/RenderGrid.tsx`

Responsibility:

- Render `InitialRenderGrid` during server render and hydration.
- Switch to `VirtualizedRenderGrid` after mount.

Dependencies:

- Local `gridVirtualized` state and mount effect.

Risks:

- Do not initialize virtualization from a browser check during render.
- Keep the server and first client render identical.

---

## Change 5: Extract the render inspector

### Current code

`Inspector` and its desktop/mobile compositions in `app/ArchiveGallery.tsx`.

### React modules to extract

#### `app/_features/archive/RenderInspector.tsx`

Responsibility:

- Empty selected-render state.
- Selected-render toolbar.
- Favorite and close actions.
- Inspector art.
- Previous/next navigation.
- Metadata list.
- Existing feedback and next-attempt text.
- Review/edit action.
- Filename.

Dependencies:

- `GalleryItem`.
- Optional `RenderReview`.
- `PreviewImage`.
- Archive labels.

Risks:

- Preserve exact `<dl>` structure.
- Preserve class hierarchy.
- Preserve desktop and compact class behavior.
- Preserve favorite keyboard hint and accessible names.
- Keep all optional controls conditional as they are now.

#### `app/_features/archive/MobileRenderViewer.tsx`

Responsibility:

- Existing `<dialog>`.
- Mobile scroll-area wrapper.
- Compact `RenderInspector` composition.

Risks:

- Preserve current behavior exactly.
- Do not add a call to `showModal()`.
- Do not fix focus handling during this extraction.

### Avoid over-extraction

Do not make separate files for:

- One metadata row.
- The filename block.
- The inspector toolbar.
- The library note.

Those would be shallow modules with no independent behavior.

---

## Change 6: Extract the review model and configuration

### Current code

The configuration and helper region at the top of `app/ReviewDesk.tsx`.

### Modules to extract

#### `app/_features/review/review-config.ts`

Responsibility:

- Queue labels.
- Decision definitions.
- Defect definitions.
- Detail-decision set.
- Sync-state labels.

Risks:

- Preserve ordering, values, labels, shortcut letters, and detail flags.
- Preserve the queue label currently called `"favorites"` even though its
  behavior is based on five-star reviews.

#### `app/_features/review/review-queue.ts`

Responsibility:

- `ReviewQueue`.
- Exact `queueMatches` behavior.

Dependencies:

- `GalleryItem`.
- `RenderReview`.

Risks:

- Preserve active-only unreviewed behavior.
- Preserve deletion matching by `deletionState`.
- Preserve five-star matching for the favorites queue.

#### `app/_features/review/review-model.ts`

Responsibility:

- `defaultSeverity`.
- `nextSeverity`.
- `mergeDrafts`.

Risks:

- Preserve delete’s fatal default.
- Preserve the minor → major → fatal → minor cycle.
- Preserve draft merging without modifying other review fields.

---

## Change 7: Break up the Review Desk UI

### Current code

The render tree and image module inside `app/ReviewDesk.tsx`.

### React modules to extract

#### `app/_features/review/ReviewDeskHeader.tsx`

Responsibility:

- Review Desk title and current name.
- Queue selector and queue counts.
- Progress.
- Sync state.
- Close action.

Dependencies:

- `ReviewQueue`.
- Sync state.
- Queue counts.
- Save-before-queue-change callback supplied by the parent.

Risks:

- Preserve select option order.
- Preserve queue-change ordering: save, set queue, clear current ID, leave
  detail mode.
- Preserve responsive header structure.

#### `app/_features/review/ReviewCompleteState.tsx`

Responsibility:

- Empty/complete queue screen.
- Review All and Return to Gallery actions.

Risks:

- Preserve existing copy and button order.
- Do not generalize the duplicate empty-state topbar during this refactor.

#### `app/_features/review/ReviewCanvasImage.tsx`

Responsibility:

- Transformed responsive preview.
- Exact source PNG.
- Original-loaded transition.
- Aspect-ratio custom property.
- Loading announcement.

Risks:

- Keep the raw `<img>` intentionally.
- Keep its source equal to `item.url`.
- Preserve `key={current.renderId}` at the call site.
- Preserve preview/original class names and load-state attribute.

#### `app/_features/review/ReviewStage.tsx`

Responsibility:

- Scrollable/zoomable image canvas.
- Zoom toggle.
- Previous/next navigation.
- Collection and dimensions.
- Shortcut display.
- Status message.

Dependencies:

- `ReviewCanvasImage`.
- `AutoHideScrollArea`.

Risks:

- Preserve zoom class placement.
- Preserve button hierarchy and labels.
- Preserve shortcut order and responsive hiding behavior.

#### `app/_features/review/RatingControl.tsx`

Responsibility:

- Current rating display.
- Five rating buttons.

Risks:

- Keep rating labels and active state.
- Delegate all rating behavior to the parent.

#### `app/_features/review/DecisionControl.tsx`

Responsibility:

- Current decision display.
- Decision buttons and shortcuts.

Risks:

- Do not embed rating validation here.
- Delegate decision behavior to the parent.

#### `app/_features/review/SuggestedTagsControl.tsx`

Responsibility:

- Suggested tag buttons.
- State attributes.
- Confidence/source title.

Risks:

- Preserve suggested → confirmed → rejected → suggested cycling in the parent
  workflow.

#### `app/_features/review/DefectControl.tsx`

Responsibility:

- All defect options.
- Selected state.
- Severity controls.

Risks:

- Preserve option order and shortcuts.
- Preserve nested button structure required by CSS.
- Delegate toggle and severity mutation to the parent.

#### `app/_features/review/FeedbackEditor.tsx`

Responsibility:

- Feedback textarea.
- Next-attempt textarea.
- Draft change events.
- Blur-save event.
- Note focus ref.

Risks:

- Keep both fields controlled.
- Preserve rows, placeholders, labels, and blur timing.
- Preserve the note ref required by the `N` shortcut.

#### `app/_features/review/FinishReviewButton.tsx`

Responsibility:

- Detail-mode save-and-next action.

Risks:

- Render only in detail mode.
- Preserve Enter shortcut copy.

#### `app/_features/review/ReviewPanel.tsx`

Responsibility:

- Compose rating, decision, tag, defect, feedback, and finish modules inside
  the existing scrolling panel.

Risks:

- Do not own review state.
- Preserve section order and conditional defect rendering.
- Do not add wrappers that change direct-child CSS selectors.

### Logic that remains in `ReviewDesk.tsx`

Keep the workflow together:

- Queue state.
- Current render ID.
- Detail mode.
- Zoom.
- Message.
- Note and correction drafts.
- Undo history.
- Queue item and current-item derivation.
- Queue counts.
- Reset-on-current-render effect.
- Review application and undo recording.
- Draft saving.
- Navigation and post-review advancement.
- Rating.
- Decision.
- Defect and severity mutation.
- Tag mutation.
- Detail completion.
- Undo.
- Global keyboard handling.

Do not create a broad `useReviewDeskController` hook. It would only move the
monolith and expose a nearly equally complicated interface.

### Critical review risks

- Save-before-navigation ordering must not change.
- The rejected item must remain pinned while detail mode is open.
- Five stars must auto-keep and advance.
- Delete must work without a rating.
- Non-delete decisions must still require a rating.
- Finish detail must save drafts before leaving detail mode and advancing.
- Undo must restore the previous render and review.
- Keyboard precedence must remain:
  1. Undo.
  2. Typing-field Escape/Shift+Enter behavior.
  3. Ratings.
  4. Arrow navigation.
  5. Space zoom.
  6. Escape.
  7. Detail Enter.
  8. Note focus.
  9. Detail defects or normal decisions.

---

## Change 8: Move the shared scroll module

### Current file

`app/AutoHideScrollArea.tsx`.

### New path

`app/_components/ui/AutoHideScrollArea.tsx`.

### Responsibility

Keep the implementation unchanged:

- Base UI ScrollArea composition.
- Optional horizontal scrollbar.
- Optional viewport/content class names.
- Optional viewport ref.
- Auto-hide classes.

### Risks

- Update archive and review imports.
- Preserve markup and class names exactly.
- Do not add new abstraction layers around it.

---

## Change 9: Optional mechanical stylesheet split

Perform only after all React modules are extracted and stable.

### Current file

`app/globals.css`.

### Proposed files

| File | Existing contiguous responsibility |
| --- | --- |
| `app/_styles/foundation.css` | Tokens, resets, global controls, screen-reader and skip-link rules |
| `app/_styles/scroll-area.css` | Auto-hide scroll-area rules |
| `app/_styles/archive.css` | Header, filters, gallery, tiles, inspector, empty state, mobile viewer |
| `app/_styles/review.css` | Review Desk base styles |
| `app/_styles/responsive.css` | Existing media queries and final global overrides |

`app/globals.css` should remain the root stylesheet and import Tailwind plus
these files in the exact current cascade order.

### Risks

- Preserve every selector and declaration.
- Preserve rule order.
- Preserve media query order.
- Do not rename classes.
- Do not convert to CSS Modules.
- Do not move responsive declarations beside their components in this task.
- Do not delete apparently unused styles in this task.
- Verify that Tailwind/PostCSS accepts the final import ordering.

---

## Change 10: Retarget tests without weakening them

### Affected tests

- `tests/gallery-performance.test.mjs`
- `tests/favorites-ui.test.mjs`
- `tests/review-catalog.test.mjs`
- `tests/rendered-html.test.mjs`

### Required changes

- Point virtualization assertions at:
  - `app/_features/archive/grid/RenderGrid.tsx`
  - `app/_features/archive/grid/InitialRenderGrid.tsx`
  - `app/_features/archive/grid/VirtualizedRenderGrid.tsx`
- Point responsive preview assertions at `PreviewImage.tsx`.
- Point exact-source review assertions at `ReviewCanvasImage.tsx`.
- Point favorite persistence assertions at `useGalleryPreferences.ts`.
- Keep the review-snapshot assertion against the new
  `ArchiveGallery.tsx`.
- Update imports and source paths after moving modules.
- Keep rendered-HTML assertions unchanged unless the same markup is serialized
  differently for a harmless framework reason that is independently verified.

### Do not

- Delete an assertion because its source string moved.
- Weaken the server-rendered tile-count assertion.
- Replace exact-source review checks with transformed-image checks.
- Add a new test framework during this refactor.

---

## Recommended execution order

Use one small commit or independently verifiable change cluster per numbered
step.

### Phase 0: Establish the baseline

- [ ] Read repository instructions and product documentation.
- [ ] Record `git status` and preserve the existing dirty worktree.
- [ ] Record current lint, build, and relevant test results.
- [ ] Record current server-rendered HTML tile count.
- [ ] Manually note current gallery and review behavior on desktop and mobile.

### Phase 1: Move pure modules

- [ ] Create `archive-config.ts`.
- [ ] Create `archive-filters.ts`.
- [ ] Create `archive-types.ts`.
- [ ] Create `review-config.ts`.
- [ ] Create `review-queue.ts`.
- [ ] Create `review-model.ts`.
- [ ] Update imports without changing implementation.
- [ ] Run lint/type validation and relevant tests.

### Phase 2: Move shared UI

- [ ] Move `AutoHideScrollArea.tsx`.
- [ ] Update all imports.
- [ ] Verify scroll markup is unchanged.

### Phase 3: Extract the grid

- [ ] Extract `PreviewImage`.
- [ ] Extract `RenderTile`.
- [ ] Extract `InitialRenderGrid`.
- [ ] Extract `VirtualizedRenderGrid`.
- [ ] Add the `RenderGrid` hydration adapter.
- [ ] Confirm server output still contains exactly 24 tiles.
- [ ] Confirm virtualization and selected-item navigation.

### Phase 4: Extract the inspector

- [ ] Extract `RenderInspector`.
- [ ] Extract the existing `MobileRenderViewer`.
- [ ] Verify desktop and mobile DOM/class equivalence.
- [ ] Do not activate or repair the mobile dialog.

### Phase 5: Extract archive controls

- [ ] Extract `ArchiveHeader`.
- [ ] Extract `QuickFilterBar`.
- [ ] Extract `ActiveFilterStrip`.
- [ ] Extract `FilterGroup`.
- [ ] Extract `CollectionFilter`.
- [ ] Extract `RaceFilter`.
- [ ] Extract `FilterDrawer`.
- [ ] Extract `GalleryHeading`.
- [ ] Extract `GalleryEmptyState`.
- [ ] Verify URL filters, counts, clear actions, and keyboard focus.

### Phase 6: Extract Review Desk leaf UI

- [ ] Extract `ReviewCanvasImage`.
- [ ] Extract `ReviewStage`.
- [ ] Extract rating, decision, tag, defect, and feedback controls.
- [ ] Extract `FinishReviewButton`.
- [ ] Extract `ReviewPanel`.
- [ ] Extract `ReviewDeskHeader`.
- [ ] Extract `ReviewCompleteState`.
- [ ] Keep all workflow mutations in `ReviewDesk`.
- [ ] Verify all shortcuts and save/advance behavior.

### Phase 7: Extract archive hooks

- [ ] Extract `useGalleryPreferences`.
- [ ] Extract `useGalleryFilters`.
- [ ] Extract `useCatalogAutoRefresh`.
- [ ] Confirm state ownership has not moved into conditional children.
- [ ] Confirm hydration has no mismatch warnings.

### Phase 8: Move feature entry modules

- [ ] Move `ArchiveGallery.tsx` into `app/_features/archive/`.
- [ ] Move `ReviewDesk.tsx` and `useReviewStore.ts` into
  `app/_features/review/`.
- [ ] Update `app/page.tsx`.
- [ ] Remove old pass-through files rather than keeping shallow re-export
  modules, once all imports are updated.

### Phase 9: Retarget tests

- [ ] Update source paths in the existing tests.
- [ ] Keep behavior assertions equally strong.
- [ ] Run the complete applicable suite.

### Phase 10: Optional CSS split

- [ ] Split only by the existing contiguous sections.
- [ ] Preserve import and cascade order.
- [ ] Compare representative desktop, tablet, and phone layouts.

### Phase 11: Final validation

- [ ] Lint passes.
- [ ] Type/build validation passes.
- [ ] Existing test suites pass.
- [ ] Server renders exactly 24 initial tiles.
- [ ] No hydration errors.
- [ ] Filter URLs survive reload.
- [ ] Favorites survive reload and invalid IDs are discarded.
- [ ] Tile size survives reload.
- [ ] Filter counts and empty recovery match the baseline.
- [ ] Review queues and counts match the baseline.
- [ ] Filtered review sessions remain snapshots.
- [ ] Rating, decision, defect, tag, feedback, and undo flows match the
  baseline.
- [ ] Offline review buffering and sync labels match the baseline.
- [ ] Full-resolution review source still loads.
- [ ] Arrow, `/`, `F`, `1–5`, `K`, `R`, `D`, `N`, Space, Enter, Escape, and
  Cmd/Ctrl+Z shortcuts match the baseline.
- [ ] Desktop, tablet, phone, coarse-pointer, reduced-motion, and forced-color
  layouts were spot-checked.
- [ ] No art, generated catalog, review export, API, database, or unrelated
  project files changed unintentionally.

---

## Explicitly out-of-scope findings

Create separate issues or plans for these findings. Do not repair them during
the extraction.

### Potential bugs

1. The mobile viewer appears unreachable. It is rendered and can close, but no
   `showModal()` call exists.
2. The metadata icon path in `app/layout.tsx` points to a file that does not
   currently exist.
3. `PreviewImage` loaded state may remain true when the inspector changes from
   one item to another.
4. `pendingCount` in `useReviewStore` is derived from a ref and is not
   reactive.
5. `normalizeDecision` casts unknown nonlegacy strings rather than validating
   them.

### Accessibility concerns

1. Review Desk uses `role="dialog"` and `aria-modal="true"` on a `<div>` but
   does not implement an explicit focus trap, initial-focus policy, or focus
   restoration.
2. Collection and race controls use combobox roles without complete listbox,
   active-descendant, and arrow-key behavior.
3. Opening the filter drawer does not explicitly move focus into it.

### Architectural and code-quality concerns

1. Filter/facet calculation repeatedly scans the full catalog.
2. The gallery keyboard effect is resubscribed on every render.
3. Source-text tests are tightly coupled to filenames and implementation
   strings.
4. There are no interaction-level React tests for focus, shortcut precedence,
   or draft-save timing.
5. `ReviewStore` is coupled to the hook implementation through
   `ReturnType<typeof useReviewStore>`.
6. Cross-runtime catalog and review types live under `app/`.
7. `gallery-catalog.ts` combines server-side compaction and client-side
   expansion in one module.
8. CSS contains apparently unused selectors such as `.brand-sigil` and
   `.utility-action`.
9. Desktop and mobile inspector call sites duplicate a large prop mapping.
10. Empty and populated Review Desk states duplicate topbar markup.

### Documentation drift

`RENDER-REVIEW-HANDOFF.md` conflicts with current code and current repository
rules in several areas, including:

- Supported review decisions.
- Whether lifecycle filtering is exposed.
- Whether `public/art` contains full-quality originals or browser references.

Correcting that document is a separate documentation task.

---

## Extractions to avoid

Do not extract:

- Individual metadata rows.
- Individual filter chips.
- Individual shortcut hints.
- Individual headings that contain no behavior.
- The library note.
- A generic button abstraction.
- Generic `Card`, `Panel`, or `Section` wrappers.
- A global archive or review Context.
- A reducer merely to group existing `useState` calls.
- A state-management library.
- A broad `useReviewDeskController`.
- A generic “filter engine” that changes current filter semantics.
- A server version of currently interactive modules.
- Route groups for the single page.
- CSS Modules.
- Barrel files.

The test for an extraction is whether deleting the new module would force
meaningful behavior and knowledge back into several call sites. If deleting it
would simply remove a filename and inline a few obvious elements, the module is
too shallow and should not be created.

## Expected end state

After the refactor:

- `app/page.tsx` remains a small Server Component.
- `ArchiveGallery.tsx` owns gallery orchestration and composes focused archive
  UI modules.
- `ReviewDesk.tsx` owns the review workflow and composes controlled review UI
  modules.
- Stateful browser integrations are contained in focused hooks.
- Grid virtualization remains a deep module behind one `RenderGrid`
  interface.
- Shared scrolling lives in one shared UI module.
- Styling and rendered markup remain behaviorally identical.
- Existing tests continue to verify the same contracts.
- Unrelated bugs and improvements remain documented but untouched.
