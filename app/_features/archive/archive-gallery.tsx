"use client";

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AutoHideScrollArea } from "../../_components/ui/auto-hide-scroll-area";
import { expandGalleryCatalog } from "../../gallery-catalog";
import type { AttemptItem, GalleryItem } from "../../review-types";
import { ReviewDesk } from "../review/review-desk";
import type { ReviewQueue } from "../review/review-queue";
import { useReviewStore } from "../review/use-review-store";
import { ActiveFilterStrip } from "./active-filter-strip";
import type { FilterState } from "./archive-filters";
import { ArchiveHeader } from "./archive-header";
import { AttemptEmptyState } from "./attempt-empty-state";
import { AttemptInspector } from "./attempt-inspector";
import {
  AttemptToolbar,
  type AttemptSourceFilter,
} from "./attempt-toolbar";
import {
  DECISION_FILTER_OPTIONS,
  DECISION_QUEUES,
  FAVORITE_FILTER_OPTIONS,
  LIFECYCLE_FILTER_OPTIONS,
} from "./archive-config";
import type { ArchiveGalleryProps, ArchiveView } from "./archive-types";
import {
  latestSuccessfulCandidates,
  matchingAttemptHistory,
  matchingCatalogItem,
} from "./candidate-matching";
import { CandidateInspector } from "./candidate-inspector";
import { FilterDrawer } from "./filters/filter-drawer";
import { GalleryEmptyState } from "./gallery-empty-state";
import { GalleryHeading } from "./gallery-heading";
import { RenderGrid } from "./grid/render-grid";
import { useCatalogAutoRefresh } from "./hooks/use-catalog-auto-refresh";
import { useGalleryFilters } from "./hooks/use-gallery-filters";
import { useGalleryPreferences } from "./hooks/use-gallery-preferences";
import { MobileAttemptViewer } from "./mobile-attempt-viewer";
import { QuickFilterBar } from "./quick-filter-bar";
import { RenderInspector } from "./render-inspector";
import { summarizeReviewProgress } from "./review-summary";
import { matchesSavedTimeFilter } from "./saved-time";

export function ArchiveGallery({
  catalog,
  attemptCatalog,
  redoCompletions,
  redoCompletionVersion,
}: ArchiveGalleryProps) {
  const catalogItems = useMemo(() => expandGalleryCatalog(catalog), [catalog]);
  const attempts = attemptCatalog.items;
  const candidates = useMemo(
    () => latestSuccessfulCandidates(attempts),
    [attempts],
  );
  const candidateOriginals = useMemo(() => {
    const originals = new Map<string, GalleryItem>();
    for (const candidate of candidates) {
      const original = matchingCatalogItem(candidate, catalogItems);
      if (original) originals.set(candidate.renderId, original);
    }
    return originals;
  }, [candidates, catalogItems]);
  const items = useMemo(
    () => [...catalogItems, ...candidates],
    [candidates, catalogItems],
  );
  const reviewableItems = useMemo(
    () => [...catalogItems, ...attempts],
    [attempts, catalogItems],
  );
  const [view, setView] = useState<ArchiveView>("catalog");
  const [selectedId, setSelectedId] = useState(catalogItems[0]?.id ?? "");
  const [selectedAttemptId, setSelectedAttemptId] = useState(
    attempts[0]?.id ?? "",
  );
  const [attemptQuery, setAttemptQuery] = useState("");
  const [attemptSourceFilter, setAttemptSourceFilter] =
    useState<AttemptSourceFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewItems, setReviewItems] = useState<GalleryItem[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueue>("unreviewed");
  const [reviewInitialRenderId, setReviewInitialRenderId] = useState("");
  const [galleryViewport, setGalleryViewport] =
    useState<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const attemptViewerRef = useRef<HTMLDialogElement>(null);
  const reviewStore = useReviewStore(reviewableItems);
  const { reviews } = reviewStore;
  const galleryViewportRef = useCallback(
    (node: HTMLDivElement | null) => setGalleryViewport(node),
    [],
  );

  const { favoriteIds, tileSize, toggleFavorite, setTileSize } =
    useGalleryPreferences(catalogItems);

  const {
    query,
    setQuery,
    collectionQuery,
    setCollectionQuery,
    raceQuery,
    setRaceQuery,
    filters,
    setFilterValue,
    updateQuickFilter,
    toggleCollection,
    clearEverything,
    collectionOptions,
    collectionCounts,
    matchingCollections,
    genderOptions,
    genderCounts,
    raceOptions,
    raceCounts,
    matchingRaceOptions,
    decisionCounts,
    ratingCounts,
    lifecycleCounts,
    favoriteCounts,
    filteredItems,
    hiddenRejectedCount,
    activeFilterCount,
    hasFilters,
    filterTokens,
    emptyRecovery,
    gridResetKey,
    timeAnchor,
  } = useGalleryFilters(
    items,
    favoriteIds,
    reviews,
  );

  useCatalogAutoRefresh({
    currentVersion: `${catalog.version}:${attemptCatalog.version}:${redoCompletionVersion}`,
    busy: filtersOpen || reviewOpen,
  });

  const selected =
    filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];
  const selectedCandidate =
    selected && "sourceKind" in selected ? (selected as AttemptItem) : undefined;
  const selectedCandidateOriginal = selectedCandidate
    ? matchingCatalogItem(selectedCandidate, catalogItems)
    : undefined;
  const selectedCandidateHistory = selectedCandidate
    ? matchingAttemptHistory(selectedCandidate, attempts)
    : [];

  const attemptsInSavedRange = useMemo(
    () =>
      attempts.filter((item) =>
        matchesSavedTimeFilter(
          item,
          filters.savedTime,
          filters.savedFrom,
          filters.savedTo,
          timeAnchor,
        ),
      ),
    [
      attempts,
      filters.savedFrom,
      filters.savedTime,
      filters.savedTo,
      timeAnchor,
    ],
  );
  const filteredAttempts = useMemo(() => {
    const needle = attemptQuery.trim().toLocaleLowerCase();
    return attemptsInSavedRange.filter((item) => {
      if (
        attemptSourceFilter === "successful" &&
        item.sourceKind !== "redo-staging"
      ) {
        return false;
      }
      if (attemptSourceFilter === "raw" && item.sourceKind !== "archive") {
        return false;
      }
      if (!needle) return true;
      return [
          item.concept,
          item.collection,
          item.category,
          item.filename,
          item.series,
          item.sourcePath,
          `attempt ${item.attempt}`,
          `successful v${String(item.attempt).padStart(2, "0")}`,
          String(item.attempt).padStart(2, "0"),
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(needle);
    });
  }, [attemptQuery, attemptSourceFilter, attemptsInSavedRange]);
  const selectedAttempt =
    filteredAttempts.find((item) => item.id === selectedAttemptId) ??
    filteredAttempts[0];
  const attemptSeriesCount = useMemo(
    () => new Set(attemptsInSavedRange.map((item) => item.series)).size,
    [attemptsInSavedRange],
  );
  const successfulAttemptCount = useMemo(
    () =>
      attemptsInSavedRange.filter((item) => item.sourceKind === "redo-staging")
        .length,
    [attemptsInSavedRange],
  );
  const rawAttemptCount = attemptsInSavedRange.length - successfulAttemptCount;
  const unreviewedCandidateCount = useMemo(
    () =>
      candidates.filter((item) => !reviews[item.renderId]?.decision).length,
    [candidates, reviews],
  );
  const unreviewedAttemptCount = useMemo(
    () => attempts.filter((item) => !reviews[item.renderId]?.decision).length,
    [attempts, reviews],
  );
  const reviewProgress = useMemo(
    () =>
      summarizeReviewProgress(
        reviews,
        catalogItems,
        candidates,
        redoCompletions,
      ),
    [candidates, catalogItems, redoCompletions, reviews],
  );
  const drawerDecisionCounts = useMemo(() => {
    const counts = new Map(decisionCounts);
    counts.set("unreviewed", unreviewedCandidateCount);
    counts.set("reject", reviewProgress.queue.redoSourcesAvailable);
    counts.set("delete", reviewProgress.queue.deletionAwaitingApplication);
    return counts;
  }, [decisionCounts, reviewProgress, unreviewedCandidateCount]);

  const openFilters = () => {
    setFiltersOpen(true);
  };

  const closeFilters = () => {
    setFiltersOpen(false);
    filterButtonRef.current?.focus();
  };

  const moveSelection = (direction: -1 | 1) => {
    if (!selected || filteredItems.length < 2) return;
    const index = filteredItems.findIndex((item) => item.id === selected.id);
    const nextIndex =
      (index + direction + filteredItems.length) % filteredItems.length;
    setSelectedId(filteredItems[nextIndex].id);
  };

  const moveAttemptSelection = (direction: -1 | 1) => {
    if (!selectedAttempt || filteredAttempts.length < 2) return;
    const index = filteredAttempts.findIndex(
      (item) => item.id === selectedAttempt.id,
    );
    const nextIndex =
      (index + direction + filteredAttempts.length) % filteredAttempts.length;
    setSelectedAttemptId(filteredAttempts[nextIndex].id);
  };

  // The handler closes over frequently-changing values (view, selection,
  // filtered lists), so keep the latest one in a ref and subscribe the window
  // listener exactly once — instead of tearing it down and re-adding it on
  // every render.
  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    const isTyping =
      target?.tagName === "INPUT" ||
      target?.tagName === "SELECT" ||
      target?.tagName === "TEXTAREA";

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      searchRef.current?.focus();
    }

    if (!isTyping && !reviewOpen && view === "catalog" && selected) {
      if (
        event.key.toLocaleLowerCase() === "f" &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.repeat
      ) {
        event.preventDefault();
        toggleFavorite(selected.renderId);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(1);
      }
    }

    if (!isTyping && view === "attempts" && selectedAttempt) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveAttemptSelection(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveAttemptSelection(1);
      }
    }
  };
  const onKeyDownRef = useRef(onKeyDown);
  useEffect(() => {
    onKeyDownRef.current = onKeyDown;
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDownRef.current(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const openAttempt = (item: GalleryItem) => {
    const attempt = item as AttemptItem;
    setSelectedAttemptId(attempt.id);
    if (!attemptViewerRef.current?.open) {
      attemptViewerRef.current?.showModal();
    }
  };

  const openAttemptReview = (
    initialItem: AttemptItem | undefined,
    queue: ReviewQueue = "unreviewed",
  ) => {
    setReviewInitialRenderId(initialItem?.renderId ?? "");
    setReviewQueue(queue);
    setReviewItems(attempts);
    attemptViewerRef.current?.close();
    setReviewOpen(true);
  };

  const reviewQueueForAttempt = (item: AttemptItem): ReviewQueue => {
    const decision = reviews[item.renderId]?.decision;
    return decision ? (DECISION_QUEUES[decision] ?? "all") : "unreviewed";
  };

  const openItem = (item: GalleryItem) => {
    setSelectedId(item.id);
    if ("sourceKind" in item) {
      const candidate = item as AttemptItem;
      openAttemptReview(candidate, reviewQueueForAttempt(candidate));
      return;
    }
    setReviewInitialRenderId(item.renderId);
    setReviewQueue(DECISION_QUEUES[filters.decision] ?? "all");
    // Snapshot the current narrowed view: with instant filters, a decision
    // made inside the desk must not eject the render mid-review (losing the
    // What-failed detail step) or reshuffle the queue underfoot.
    setReviewItems(filteredItems);
    setReviewOpen(true);
  };

  const changeView = (nextView: ArchiveView) => {
    setView(nextView);
    setFiltersOpen(false);
    if (nextView === "catalog") {
      setSelectedId(selected?.id ?? catalogItems[0]?.id ?? "");
    } else {
      setSelectedAttemptId(selectedAttempt?.id ?? attempts[0]?.id ?? "");
    }
  };

  const openUnreviewedOutputs = () => {
    clearEverything();
    setFilterValue("decision", "unreviewed");
    changeView("catalog");
  };

  const openRedoSources = () => {
    clearEverything();
    setFilterValue("lifecycle", "all");
    setFilterValue("decision", "reject");
    changeView("catalog");
  };

  const viewSelectedCandidateHistory = () => {
    if (!selectedCandidate) return;
    setAttemptQuery(selectedCandidate.series);
    setAttemptSourceFilter("all");
    changeView("attempts");
  };

  const promoteCandidate = async (
    candidate: AttemptItem,
    placement: "variant" | "replace",
  ) => {
    const original = matchingCatalogItem(candidate, catalogItems);
    const response = await fetch("http://127.0.0.1:3010/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidatePath: candidate.sourcePath,
        sourcePath: original?.id ?? "",
        sourceRenderId: original?.renderId ?? "",
        mode: placement,
      }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(result.error || "Could not promote this candidate.");
    }
  };

  const promoteSelectedCandidate = async (placement: "variant" | "replace") => {
    if (!selectedCandidate) return;
    await promoteCandidate(selectedCandidate, placement);
    window.location.reload();
  };

  const setDrawerFilterValue = (key: keyof FilterState, value: string) => {
    if (key === "decision" && value === "unreviewed") {
      openUnreviewedOutputs();
      return;
    }
    if (key === "decision" && value === "reject") {
      openRedoSources();
      return;
    }
    setFilterValue(key, value);
  };

  const updateTileSize = (event: ChangeEvent<HTMLInputElement>) => {
    setTileSize(Number(event.target.value));
  };

  const decisionOptions = DECISION_FILTER_OPTIONS;
  const lifecycleOptions = LIFECYCLE_FILTER_OPTIONS;
  const favoriteOptions = FAVORITE_FILTER_OPTIONS;

  return (
    <div className="archive-app">
      <a className="skip-link" href="#render-grid">
        Skip to render grid
      </a>

      <ArchiveHeader
        query={view === "catalog" ? query : attemptQuery}
        onQueryChange={view === "catalog" ? setQuery : setAttemptQuery}
        searchRef={searchRef}
        tileSize={tileSize}
        onTileSizeChange={updateTileSize}
        view={view}
        catalogCount={catalogItems.length}
        attemptCount={attempts.length}
        onViewChange={changeView}
      />

      <div className="archive-shell">
        <section className="gallery-browser" aria-label="Render browser">
          {view === "catalog" ? (
            <>
              <QuickFilterBar
                favorite={filters.favorite}
                decision={filters.decision}
                rating={filters.rating}
                onUpdateQuickFilter={updateQuickFilter}
                unreviewedOutputCount={unreviewedCandidateCount}
                onOpenUnreviewedOutputs={openUnreviewedOutputs}
                redoAvailableCount={
                  reviewProgress.queue.redoSourcesAvailable
                }
                onOpenRedoSources={openRedoSources}
                filtersOpen={filtersOpen}
                filterButtonRef={filterButtonRef}
                activeFilterCount={activeFilterCount}
                onOpenFilters={openFilters}
                onCloseFilters={closeFilters}
              />

              {filtersOpen ? (
                <FilterDrawer
                  filters={filters}
                  query={query}
                  filteredCount={filteredItems.length}
                  hasFilters={hasFilters}
                  collectionQuery={collectionQuery}
                  onCollectionQueryChange={setCollectionQuery}
                  collectionOptions={collectionOptions}
                  collectionCounts={collectionCounts}
                  matchingCollections={matchingCollections}
                  raceQuery={raceQuery}
                  onRaceQueryChange={setRaceQuery}
                  raceOptions={raceOptions}
                  raceCounts={raceCounts}
                  matchingRaceOptions={matchingRaceOptions}
                  genderOptions={genderOptions}
                  genderCounts={genderCounts}
                  favoriteOptions={favoriteOptions}
                  favoriteCounts={favoriteCounts}
                  decisionOptions={decisionOptions}
                  decisionCounts={drawerDecisionCounts}
                  reviewProgress={reviewProgress}
                  onShowRedoSources={openRedoSources}
                  onShowGeneratedOutputs={openUnreviewedOutputs}
                  ratingCounts={ratingCounts}
                  lifecycleOptions={lifecycleOptions}
                  lifecycleCounts={lifecycleCounts}
                  onToggleCollection={toggleCollection}
                  onSetFilterValue={setDrawerFilterValue}
                  onClearEverything={clearEverything}
                  onClose={closeFilters}
                />
              ) : null}

              <ActiveFilterStrip tokens={filterTokens} />
            </>
          ) : (
            <AttemptToolbar
              attemptCount={attemptsInSavedRange.length}
              seriesCount={attemptSeriesCount}
              unreviewedCount={unreviewedAttemptCount}
              sourceFilter={attemptSourceFilter}
              successfulCount={successfulAttemptCount}
              rawCount={rawAttemptCount}
              savedTime={filters.savedTime}
              savedFrom={filters.savedFrom}
              savedTo={filters.savedTo}
              onSourceFilterChange={setAttemptSourceFilter}
              onSavedTimeChange={(value) =>
                setFilterValue("savedTime", value)
              }
              onSavedFromChange={(value) =>
                setFilterValue("savedFrom", value)
              }
              onSavedToChange={(value) => setFilterValue("savedTo", value)}
              onReviewUnreviewed={() =>
                openAttemptReview(selectedAttempt, "unreviewed")
              }
            />
          )}

          <AutoHideScrollArea
            className="gallery-scroll-area"
            viewportRef={galleryViewportRef}
          >
            <main className="gallery-region">
              {view === "catalog" ? (
                <>
                  <GalleryHeading
                    filteredCount={filteredItems.length}
                    totalCount={
                      filters.decision === "unreviewed"
                        ? candidates.length
                        : filters.decision === "reject"
                          ? reviewProgress.queue.redoSourcesAvailable
                          : catalogItems.length
                    }
                    hiddenRejectedCount={hiddenRejectedCount}
                    hasFilters={hasFilters}
                    query={query}
                    onClear={clearEverything}
                  />

                  {filteredItems.length ? (
                    <RenderGrid
                      items={filteredItems}
                      selectedId={selected?.id}
                      tileSize={tileSize}
                      scrollElement={galleryViewport}
                      resetKey={gridResetKey}
                      onOpen={openItem}
                    />
                  ) : (
                    <GalleryEmptyState
                      favorite={filters.favorite}
                      activeFilterCount={activeFilterCount}
                      query={query}
                      emptyRecovery={emptyRecovery}
                      onShowAllFavorites={() =>
                        setFilterValue("favorite", "all")
                      }
                      onClearEverything={clearEverything}
                    />
                  )}
                </>
              ) : (
                <>
                  <GalleryHeading
                    eyebrow="ATTEMPT SHEET"
                    noun="ATTEMPTS"
                    filteredCount={filteredAttempts.length}
                    totalCount={attempts.length}
                    hiddenRejectedCount={0}
                    hasFilters={
                      attemptSourceFilter !== "all" ||
                      filters.savedTime !== "all"
                    }
                    query={attemptQuery}
                    onClear={() => {
                      setAttemptQuery("");
                      setAttemptSourceFilter("all");
                      setFilterValue("savedTime", "all");
                    }}
                  />

                  {filteredAttempts.length ? (
                    <RenderGrid
                      items={filteredAttempts}
                      selectedId={selectedAttempt?.id}
                      tileSize={tileSize}
                      scrollElement={galleryViewport}
                      resetKey={`attempts:${attemptSourceFilter}:${filters.savedTime}:${filters.savedFrom}:${filters.savedTo}:${attemptQuery}`}
                      onOpen={openAttempt}
                    />
                  ) : (
                    <AttemptEmptyState
                      hasQuery={Boolean(attemptQuery.trim())}
                      onClear={() => {
                        setAttemptQuery("");
                        setAttemptSourceFilter("all");
                        setFilterValue("savedTime", "all");
                      }}
                    />
                  )}
                </>
              )}
            </main>
          </AutoHideScrollArea>
        </section>

        <aside
          className="desktop-inspector"
          aria-label={
            view === "catalog"
              ? "Selected render details"
              : "Selected attempt details"
          }
        >
          <AutoHideScrollArea>
            {view === "catalog" ? (
              selectedCandidate ? (
                <CandidateInspector
                  candidate={selectedCandidate}
                  original={selectedCandidateOriginal}
                  history={selectedCandidateHistory}
                  review={reviews[selectedCandidate.renderId]}
                  onPrevious={() => moveSelection(-1)}
                  onNext={() => moveSelection(1)}
                  onReview={() =>
                    openAttemptReview(
                      selectedCandidate,
                      reviewQueueForAttempt(selectedCandidate),
                    )
                  }
                  onViewHistory={viewSelectedCandidateHistory}
                  onPromote={promoteSelectedCandidate}
                />
              ) : (
                <RenderInspector
                  item={selected}
                  review={selected ? reviews[selected.renderId] : undefined}
                  isFavorite={
                    selected ? favoriteIds.has(selected.renderId) : false
                  }
                  onPrevious={() => moveSelection(-1)}
                  onNext={() => moveSelection(1)}
                  onToggleFavorite={
                    selected
                      ? () => toggleFavorite(selected.renderId)
                      : undefined
                  }
                  onEdit={selected ? () => openItem(selected) : undefined}
                />
              )
            ) : (
              <AttemptInspector
                item={selectedAttempt}
                review={
                  selectedAttempt
                    ? reviews[selectedAttempt.renderId]
                    : undefined
                }
                onPrevious={() => moveAttemptSelection(-1)}
                onNext={() => moveAttemptSelection(1)}
                onReview={
                  selectedAttempt
                    ? () =>
                        openAttemptReview(
                          selectedAttempt,
                          reviewQueueForAttempt(selectedAttempt),
                        )
                    : undefined
                }
              />
            )}
            <div className="library-note">
              <span>{view === "catalog" ? "LIBRARY" : "ATTEMPT ARCHIVE"}</span>
              <strong>{view === "catalog" ? catalogItems.length : attempts.length}</strong>
              <p>
                {view === "catalog"
                  ? "Reference renders indexed from the working repository."
                  : "Reviewable outputs preserved outside canonical catalog counts."}
              </p>
            </div>
          </AutoHideScrollArea>
        </aside>
      </div>

      {view === "attempts" ? (
        <MobileAttemptViewer
          viewerRef={attemptViewerRef}
          item={selectedAttempt}
          review={
            selectedAttempt ? reviews[selectedAttempt.renderId] : undefined
          }
          onPrevious={() => moveAttemptSelection(-1)}
          onNext={() => moveAttemptSelection(1)}
          onReview={
            selectedAttempt
              ? () =>
                  openAttemptReview(
                    selectedAttempt,
                    reviewQueueForAttempt(selectedAttempt),
                  )
              : undefined
          }
          onClose={() => attemptViewerRef.current?.close()}
        />
      ) : null}

      {reviewOpen ? (
        <ReviewDesk
          items={reviewItems}
          store={reviewStore}
          initialRenderId={reviewInitialRenderId}
          initialQueue={reviewQueue}
          comparisonItemsByRenderId={candidateOriginals}
          onPromoteCandidate={promoteCandidate}
          onClose={() => setReviewOpen(false)}
        />
      ) : null}
    </div>
  );
}
