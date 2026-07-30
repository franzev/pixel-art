# Pixel-Art Render Review System — Session Handoff

Date: 2026-07-30  
Workspace: `/Users/franz/Work/Personal/me/pixel-art`  
Location: workspace root  
Local app: `http://localhost:3000/`

## Objective

Continue building and validating a fast, local-first system for reviewing a growing pixel-art render archive. The user needs to rate renders, record defects and correction guidance, distinguish salvageable work from rejected concepts, identify duplicates, queue files for later deletion, and carry confirmed art-direction knowledge into future generation sessions.

## Product decisions

- The primary interface is a desktop-first, keyboard-first local web app that presents one render at a time.
- A 1–5 overall rating is required for review decisions except deletion. Pressing `D` marks for deletion, saves, and advances immediately without requiring a rating or feedback. The unused concept, execution, and direction-fit rating controls were removed after all three recorded zero use across 996 reviews; their compatibility fields remain in storage.
- Supported decisions are: Keep, Correct, Rerender same concept, Redesign, Reference-only, Duplicate, Reject concept, and Mark for deletion.
- Defects are structured and have minor, major, or fatal severity. The active quick-failure list contains proportions, anatomy/limbs, hands/fingers, weapon handling, weapon too short, bent/crooked weapon, wrong weapon design, unwanted magic/effects, silhouette/pose, duplication/repetition, costume, and technical issues. Hands/fingers, weapon too short, bent/crooked weapon, and wrong weapon design were promoted from recurring free-text feedback and backfilled without deleting the original notes. Four zero-use options—art-direction mismatch, composition/background, pixel treatment, and generic/derivative—were removed from the interface after auditing 996 reviews; the database remains flexible enough to preserve older defect keys.
- “Correct” means the concept should be preserved and repaired. “Rerender” preserves the concept but starts a new execution. “Redesign” and “Reject concept” signal deeper conceptual failure.
- Feedback includes free-form notes plus explicit “preserve” and “change in next attempt” guidance.
- Duplicate records should link to the earlier/better render and support comparison.
- Marking for deletion is deliberately non-destructive. No source image is physically deleted.
- Automatically derived tags remain suggestions until the user confirms them. Only confirmed user feedback should influence future art direction.
- The database is the organization layer. Existing folders remain the storage/provenance layer; do not reorganize the live archive while generation is active.
- Lifecycle state remains internal provenance only. The gallery no longer exposes a retained/draft/rejected filter or badges because the user reviews every render together.
- Collection filtering uses autocomplete-backed checkbox results and removable chips rather than rendering the full collection list.
- Originals stay in their collection folders. Browser-ready 256 px references live under `site/public/art`; high-resolution sources should not be placed there.
- Render IDs and asset hashes are content-based and stable.
- This remains local-only for now: no deployment, authentication, or cloud storage.
- Importing is incremental and skips incomplete PNG files so active image generation can continue safely.
- Navigation should feel immediate through preloading, optimistic local updates, and background persistence.

## Implemented system

The existing gallery now includes a Review entry point and a full-screen review desk.

Important files:

- `/Users/franz/Work/Personal/me/pixel-art/site/app/ReviewDesk.tsx`
- `/Users/franz/Work/Personal/me/pixel-art/site/app/useReviewStore.ts`
- `/Users/franz/Work/Personal/me/pixel-art/site/app/review-types.ts`
- `/Users/franz/Work/Personal/me/pixel-art/site/app/ArchiveGallery.tsx`
- `/Users/franz/Work/Personal/me/pixel-art/site/app/globals.css`

Keyboard controls:

- `1–5`: overall rating
- `K`: keep and advance
- `C`: correct
- `R`: rerender
- `G`: redesign
- `V`: reference-only
- `U`: duplicate
- `X`: reject concept
- `D`: mark for deletion, save, and advance immediately; no rating required
- `N`: focus feedback
- Left/Right arrows: navigate
- Space: zoom
- Cmd/Ctrl+Z: undo
- Enter: save and advance from detailed issue mode

The app offers queues for unreviewed, all, correction, rerender, redesign, duplicates, deletion, and favorites. It preloads nearby renders, saves optimistically to a local outbox, and syncs in the background.

## Catalog and persistence

Catalog sync:

- `/Users/franz/Work/Personal/me/pixel-art/site/scripts/sync-art.mjs`

The sync process validates the PNG end marker, ignores files still being written, computes SHA-256 hashes and stable `rnd_…` IDs, and derives conservative tag suggestions from paths and filenames.

Local database and API:

- `/Users/franz/Work/Personal/me/pixel-art/site/db/schema.ts`
- `/Users/franz/Work/Personal/me/pixel-art/site/db/runtime.ts`
- `/Users/franz/Work/Personal/me/pixel-art/site/db/catalog.ts`
- `/Users/franz/Work/Personal/me/pixel-art/site/app/api/catalog/route.ts`
- `/Users/franz/Work/Personal/me/pixel-art/site/app/api/reviews/route.ts`
- `/Users/franz/Work/Personal/me/pixel-art/site/app/api/export/route.ts`
- `/Users/franz/Work/Personal/me/pixel-art/site/drizzle/0000_optimal_jackal.sql`

Tables cover renders, reviews, tags, defects, and review events. `.openai/hosting.json` declares the logical local database binding as `DB`. Do not deploy unless the user changes the local-only requirement.

## Cross-session feedback memory

The app exports reviewed records to:

- `/Users/franz/Work/Personal/me/pixel-art/art-catalog/RENDER-FEEDBACK.md`
- `/Users/franz/Work/Personal/me/pixel-art/art-catalog/render-feedback.jsonl`

Exporter:

- `/Users/franz/Work/Personal/me/pixel-art/site/scripts/export-feedback.mjs`

The development process refreshes these exports approximately every three seconds. Only rated/reviewed records are exported. The export preserves user decisions, ratings, confirmed or rejected tag states, defects, feedback, next-attempt guidance, duplicate relationships, deletion status, and user-review provenance.

As of 2026-07-30 the user has completed a bulk review of 996 renders (203 keep, 86 reject, 707 delete). Both export files now contain the full record, and the confirmed lessons have been distilled into `art-catalog/REVIEW-LEARNINGS.md` and folded into `RENDER-PROMPT.md` and `enemies/ENEMY-ART-DIRECTION-FEEDBACK.md`. Notable: the Flesh-Veil Oracle positive reference was reversed (rated 1/5, marked for deletion); weapon correctness and default-off spell effects are now codified generation rules.

The parent agent instructions were updated at:

- `/Users/franz/Work/Personal/me/AGENTS.md`

Future pixel-art sessions are instructed to read `art-catalog/REVIEW-LEARNINGS.md` (the human-authored distillation) and `art-catalog/RENDER-FEEDBACK.md`, treat confirmed feedback as direct evidence, avoid treating unconfirmed tag suggestions as approved, and read collection-level `REJECTION-NOTES.md` files.

## Art-direction sources

Do not recreate the project’s art-direction history from memory. Read the source documents:

- `/Users/franz/Work/Personal/me/pixel-art/README.md`
- `/Users/franz/Work/Personal/me/pixel-art/ASSET-SPEC.md`
- `/Users/franz/Work/Personal/me/pixel-art/ENEMY-ASSET-SPEC.md`
- `/Users/franz/Work/Personal/me/pixel-art/enemies/ENEMY-ART-DIRECTION-FEEDBACK.md`
- `/Users/franz/Work/Personal/me/pixel-art/angels/corrupted-angels-v01/REJECTION-NOTES.md`
- `/Users/franz/Work/Personal/me/pixel-art/art-catalog/RENDER-FEEDBACK.md`

Collection folders also contain `STATUS.md`, generation prompts, manifests, and sometimes rejection notes. Confirmed review exports should gradually become the highest-value source for future generation prompts.

## Validation state

- Lint passes with zero errors and five intentional raw `<img>` warnings for crisp pixel-art rendering.
- Review tests pass: 2/2.
- Production build passes and includes `/`, `/api/catalog`, `/api/reviews`, and `/api/export`.
- Catalog import and review API roundtrip were tested. The synthetic review was removed afterward, returning the real review count to zero.
- The legacy server-render test passes.
- The archive continued growing during implementation; the last recorded production build indexed 461 renders, but the live count may now be higher.

## Known archive-integrity issues

The older full archive-integrity suite has one passing and three failing checks caused by ongoing generation and pre-existing archive state:

1. Some collection folders now contain website-ready reference copies that duplicate files under `site/public/art`.
2. The hash-duplicate check detects the same copies.
3. At least one active manifest contains an unqualified path such as `drafts/01-stag-crown-lancer-source.png`, which is interpreted incorrectly from the repository root.

These are not failures in the review app. No live render was moved, renamed, deleted, or rewritten. Repair these only after generation finishes and the user explicitly authorizes archive cleanup.

## Repository cautions

- The main pixel-art repository is dirty with user work and active generation output.
- `site` is a nested Git repository and also contains many untracked generated assets.
- Do not stage, revert, rename, or delete active render files broadly.
- No commit, staging, push, or deployment was performed.
- The parent `/Users/franz/Work/Personal/me/AGENTS.md` is outside the nested repositories.
- Never expose credentials or tokens that may appear in local hosting configuration or tool output.

## Recommended continuation

1. Ask the user to review a handful of real images in the local app and observe whether rating, defect entry, decisions, and keyboard navigation feel fast.
2. Confirm that the first real review appears promptly in both feedback export files.
3. Refine the interface based on actual reviewing friction before expanding the data model.
4. If requested, add a view that turns confirmed feedback into generation-ready art-direction and correction briefs.
5. Rich visual or AI pre-tagging is optional future work and requires a model/provider decision; current suggestions are deterministic filename/path metadata.
6. Leave physical deletion and archive repair for a separately authorized cleanup workflow.

## Suggested skills

- `sites:sites-building` for changes to the web app. Read `.openai/hosting.json` first and preserve the local-only decision.
- `sites:sites-hosting` only if the user explicitly asks to deploy.
- `gsd-explore` if the review workflow needs further product exploration.
- `gsd-code-review` or `gsd-verify-work` for a formal implementation review or user-acceptance pass.
- `browser:control-in-app-browser` when the user explicitly requests interactive browser testing.
- `handoff` for the next transfer between sessions.

## Resume instruction

Start by reading `/Users/franz/Work/Personal/me/AGENTS.md`, this handoff, and `/Users/franz/Work/Personal/me/pixel-art/art-catalog/RENDER-FEEDBACK.md`. Preserve all active generation work. The immediate goal is to validate the one-by-one review experience with real user feedback, not to reorganize or delete the archive.
