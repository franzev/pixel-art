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
import { ArchiveHeader } from "./archive-header";
import { AttemptEmptyState } from "./attempt-empty-state";
import { AttemptInspector } from "./attempt-inspector";
import { AttemptToolbar, type AttemptSourceFilter } from "./attempt-toolbar";
import { DECISION_QUEUES, LIFECYCLE_FILTER_OPTIONS } from "./archive-config";
import type { ArchiveGalleryProps, ArchiveView } from "./archive-types";
import { groupAttemptSeries, sortLibraryItems } from "./archive-workspaces";
import {
  latestSuccessfulCandidates,
  matchingAttemptHistory,
  matchingCatalogItem,
} from "./candidate-matching";
import { FilterDrawer } from "./filters/filter-drawer";
import { GalleryEmptyState } from "./gallery-empty-state";
import { GalleryHeading } from "./gallery-heading";
import { RenderGrid } from "./grid/render-grid";
import type { RenderTilePresentation } from "./grid/render-tile";
import { useCatalogAutoRefresh } from "./hooks/use-catalog-auto-refresh";
import { useGalleryFilters } from "./hooks/use-gallery-filters";
import { useGalleryPreferences } from "./hooks/use-gallery-preferences";
import { LibraryToolbar, type LibrarySort } from "./library-toolbar";
import { MobileAttemptViewer } from "./mobile-attempt-viewer";
import { RenderInspector } from "./render-inspector";
import { RenderViewer } from "./render-viewer";
import { ReviewWorkspace } from "./review-workspace";
import {
  isRedoAwaitingGeneration,
  summarizeReviewProgress,
} from "./review-summary";
import {
  formatSavedTimestampCompact,
  matchesGeneratedTimeFilter,
  matchesTimestampFilter,
} from "./saved-time";

export function ArchiveGallery({
  catalog,
  attemptCatalog: initialAttemptCatalog,
  redoCompletions: initialRedoCompletions,
  redoCompletionVersion: initialRedoCompletionVersion,
}: ArchiveGalleryProps) {
  const [archivePayload, setArchivePayload] = useState(() => ({
    attemptCatalog: initialAttemptCatalog,
    redoCompletions: initialRedoCompletions,
    redoCompletionVersion: initialRedoCompletionVersion,
  }));
  const { attemptCatalog, redoCompletions, redoCompletionVersion } =
    archivePayload;
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
  const completedRedoRenderIds = useMemo(
    () => new Set(redoCompletions.map((item) => item.sourceRenderId)),
    [redoCompletions],
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
  const [librarySort, setLibrarySort] = useState<LibrarySort>("catalog");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewItems, setReviewItems] = useState<GalleryItem[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueue>("unreviewed");
  const [reviewInitialRenderId, setReviewInitialRenderId] = useState("");
  const [galleryViewport, setGalleryViewport] = useState<HTMLDivElement | null>(
    null,
  );

  const searchRef = useRef<HTMLInputElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const renderViewerRef = useRef<HTMLDialogElement>(null);
  const attemptViewerRef = useRef<HTMLDialogElement>(null);
  const reviewStore = useReviewStore(reviewableItems);
  const { reviews } = reviewStore;
  const reviewedAtByRenderId = useMemo(
    () =>
      new Map(
        Object.values(reviews).map((review) => [
          review.renderId,
          review.reviewedAt,
        ]),
      ),
    [reviews],
  );
  const galleryViewportRef = useCallback(
    (node: HTMLDivElement | null) => setGalleryViewport(node),
    [],
  );
  const { favoriteIds, tileSize, toggleFavorite, setTileSize } =
    useGalleryPreferences(reviewableItems);

  useEffect(() => {
    if (initialAttemptCatalog.items.length) return;
    const controller = new AbortController();

    const loadArchive = async () => {
      try {
        const response = await fetch("/api/archive", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const payload = (await response.json()) as typeof archivePayload;
        setArchivePayload(payload);
      } catch {
        // The primary Library remains available if secondary archive data is
        // temporarily unavailable. A reload retries the request.
      }
    };

    void loadArchive();
    return () => controller.abort();
  }, [initialAttemptCatalog.items.length]);

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
    ratingCounts,
    lifecycleCounts,
    filteredItems,
    hiddenRejectedCount,
    activeFilterCount,
    hasFilters,
    filterTokens,
    emptyRecovery,
    gridResetKey,
    timeAnchor,
  } = useGalleryFilters(
    catalogItems,
    favoriteIds,
    reviews,
    completedRedoRenderIds,
  );

  useCatalogAutoRefresh({
    currentVersion: `${catalog.version}:${attemptCatalog.version}:${redoCompletionVersion}`,
    busy: filtersOpen || reviewOpen,
  });

  const sortedLibraryItems = useMemo(
    () => sortLibraryItems(filteredItems, reviews, librarySort),
    [filteredItems, librarySort, reviews],
  );
  const selected =
    sortedLibraryItems.find((item) => item.id === selectedId) ??
    sortedLibraryItems[0];

  const attemptsInTimeRange = useMemo(
    () =>
      attempts.filter(
        (item) =>
          matchesGeneratedTimeFilter(
            item,
            filters.generatedTime,
            filters.generatedFrom,
            filters.generatedTo,
            timeAnchor,
          ) &&
          matchesTimestampFilter(
            reviews[item.renderId]?.reviewedAt,
            filters.reviewedTime,
            filters.reviewedFrom,
            filters.reviewedTo,
            timeAnchor,
          ),
      ),
    [
      attempts,
      filters.generatedFrom,
      filters.generatedTime,
      filters.generatedTo,
      filters.reviewedFrom,
      filters.reviewedTime,
      filters.reviewedTo,
      reviews,
      timeAnchor,
    ],
  );
  const filteredAttempts = useMemo(() => {
    const needle = attemptQuery.trim().toLocaleLowerCase();
    return attemptsInTimeRange.filter((item) => {
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
        String(item.attempt).padStart(2, "0"),
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(needle);
    });
  }, [attemptQuery, attemptSourceFilter, attemptsInTimeRange]);
  const attemptSeries = useMemo(
    () => groupAttemptSeries(filteredAttempts),
    [filteredAttempts],
  );
  const allAttemptSeries = useMemo(
    () => groupAttemptSeries(attempts),
    [attempts],
  );
  const selectedAttemptSeries =
    attemptSeries.find((series) =>
      series.attempts.some((item) => item.id === selectedAttemptId),
    ) ?? attemptSeries[0];
  const selectedAttempt =
    selectedAttemptSeries?.attempts.find(
      (item) => item.id === selectedAttemptId,
    ) ?? selectedAttemptSeries?.latest;
  const attemptGridItems = useMemo(
    () => attemptSeries.map((series) => series.latest),
    [attemptSeries],
  );
  const attemptPresentationById = useMemo(() => {
    const presentations = new Map<string, RenderTilePresentation>();
    for (const series of attemptSeries) {
      const candidateLabel = series.candidateCount
        ? ` · ${series.candidateCount} candidate${series.candidateCount === 1 ? "" : "s"}`
        : "";
      const reviewedAt = reviews[series.latest.renderId]?.reviewedAt;
      const reviewedLabel = reviewedAt
        ? ` · Reviewed ${formatSavedTimestampCompact(reviewedAt)}`
        : " · Not reviewed";
      presentations.set(series.latest.id, {
        title: series.concept,
        label: `${series.attempts.length} attempt${series.attempts.length === 1 ? "" : "s"}`,
        meta: `${series.attempts.length} attempt${series.attempts.length === 1 ? "" : "s"}${candidateLabel} · Generated ${formatSavedTimestampCompact(series.latest.generatedAt)}${reviewedLabel}`,
      });
    }
    return presentations;
  }, [attemptSeries, reviews]);

  const successfulAttemptCount = useMemo(
    () =>
      attemptsInTimeRange.filter((item) => item.sourceKind === "redo-staging")
        .length,
    [attemptsInTimeRange],
  );
  const rawAttemptCount = attemptsInTimeRange.length - successfulAttemptCount;
  const unreviewedAttemptCount = useMemo(
    () =>
      filteredAttempts.filter((item) => !reviews[item.renderId]?.decision)
        .length,
    [filteredAttempts, reviews],
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
  const reviewCount =
    reviewProgress.queue.generatedOutputsAwaitingReview +
    reviewProgress.queue.redoSourcesAvailable +
    reviewProgress.queue.deletionAwaitingApplication;

  const openFilters = () => setFiltersOpen(true);
  const closeFilters = () => {
    setFiltersOpen(false);
    filterButtonRef.current?.focus();
  };
  const isCompactViewport = () =>
    window.matchMedia("(max-width: 1023px)").matches;

  const moveSelection = (direction: -1 | 1) => {
    if (!selected || sortedLibraryItems.length < 2) return;
    const index = sortedLibraryItems.findIndex(
      (item) => item.id === selected.id,
    );
    const nextIndex =
      (index + direction + sortedLibraryItems.length) %
      sortedLibraryItems.length;
    setSelectedId(sortedLibraryItems[nextIndex].id);
  };

  const moveAttemptSelection = (direction: -1 | 1) => {
    if (!selectedAttemptSeries || attemptSeries.length < 2) return;
    const index = attemptSeries.findIndex(
      (series) => series.series === selectedAttemptSeries.series,
    );
    const nextIndex =
      (index + direction + attemptSeries.length) % attemptSeries.length;
    setSelectedAttemptId(attemptSeries[nextIndex].latest.id);
  };

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

  const openReviewQueue = (
    scopedItems: GalleryItem[],
    queue: ReviewQueue,
    initialItem = scopedItems[0],
  ) => {
    if (!initialItem) return;
    setReviewInitialRenderId(initialItem.renderId);
    setReviewQueue(queue);
    setReviewItems(scopedItems);
    renderViewerRef.current?.close();
    attemptViewerRef.current?.close();
    setReviewOpen(true);
  };

  const reviewQueueForAttempt = (item: AttemptItem): ReviewQueue => {
    const decision = reviews[item.renderId]?.decision;
    return decision ? (DECISION_QUEUES[decision] ?? "all") : "unreviewed";
  };

  const selectLibraryItem = (item: GalleryItem) => {
    setSelectedId(item.id);
    if (isCompactViewport() && !renderViewerRef.current?.open) {
      renderViewerRef.current?.showModal();
    }
  };
  const openSelectedViewer = () => {
    if (selected && !renderViewerRef.current?.open) {
      renderViewerRef.current?.showModal();
    }
  };
  const openLibraryReview = (item: GalleryItem) => {
    const decision = reviews[item.renderId]?.decision;
    openReviewQueue(
      sortedLibraryItems,
      decision ? (DECISION_QUEUES[decision] ?? "all") : "all",
      item,
    );
  };

  const openAttemptSeries = (item: GalleryItem) => {
    const series = attemptSeries.find((entry) => entry.latest.id === item.id);
    setSelectedAttemptId(series?.latest.id ?? item.id);
    if (isCompactViewport() && !attemptViewerRef.current?.open) {
      attemptViewerRef.current?.showModal();
    }
  };
  const openAttemptReview = (
    initialItem: AttemptItem | undefined,
    queue: ReviewQueue = "unreviewed",
    scopedItems: AttemptItem[] = attempts,
  ) => {
    if (!initialItem) return;
    openReviewQueue(scopedItems, queue, initialItem);
  };
  const openRedoCandidateFromDesk = (candidate: AttemptItem) => {
    setReviewInitialRenderId(candidate.renderId);
    setReviewQueue(reviewQueueForAttempt(candidate));
    setReviewItems(matchingAttemptHistory(candidate, attempts));
  };

  const changeView = (nextView: ArchiveView) => {
    setView(nextView);
    setFiltersOpen(false);
    if (nextView === "catalog") {
      setSelectedId(selected?.id ?? catalogItems[0]?.id ?? "");
    }
    if (nextView === "attempts") {
      setSelectedAttemptId(selectedAttempt?.id ?? attempts[0]?.id ?? "");
    }
  };

  const openNewCandidates = () => {
    const items = candidates.filter(
      (item) => !reviews[item.renderId]?.decision,
    );
    openReviewQueue(items, "unreviewed");
  };
  const openRedoSources = () => {
    const items = catalogItems.filter(
      (item) => reviews[item.renderId]?.decision === "reject",
    );
    openReviewQueue(items, "rejected");
  };
  const openRedoAwaitingGeneration = () => {
    const items = catalogItems.filter((item) =>
      isRedoAwaitingGeneration(
        item,
        reviews[item.renderId],
        completedRedoRenderIds,
      ),
    );
    openReviewQueue(items, "rejected");
  };
  const openDeletionQueue = () => {
    const items = catalogItems.filter(
      (item) => reviews[item.renderId]?.deletionState === "marked",
    );
    openReviewQueue(items, "deletion");
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

  const discardCandidate = async (candidate: AttemptItem) => {
    const response = await fetch("http://127.0.0.1:3010/discard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidatePath: candidate.sourcePath }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(result.error || "Could not delete this candidate.");
    }
  };

  const updateTileSize = (event: ChangeEvent<HTMLInputElement>) => {
    setTileSize(Number(event.target.value));
  };

  return (
    <div className="archive-app">
      <a
        className="skip-link"
        href={view === "review" ? "#review-workspace" : "#render-grid"}
      >
        {view === "review" ? "Skip to review queues" : "Skip to render grid"}
      </a>

      <ArchiveHeader
        query={view === "attempts" ? attemptQuery : query}
        onQueryChange={(value) => {
          if (view === "review") changeView("catalog");
          if (view === "attempts") setAttemptQuery(value);
          else setQuery(value);
        }}
        searchRef={searchRef}
        view={view}
        catalogCount={catalogItems.length}
        reviewCount={reviewCount}
        attemptCount={allAttemptSeries.length}
        onViewChange={changeView}
      />

      {view === "review" ? (
        <ReviewWorkspace
          progress={reviewProgress}
          onOpenNewCandidates={openNewCandidates}
          onOpenRedoSources={openRedoSources}
          onOpenWaitingForReplacement={openRedoAwaitingGeneration}
          onOpenDeletionQueue={openDeletionQueue}
        />
      ) : (
        <div className="archive-shell">
          <section className="gallery-browser" aria-label="Render browser">
            {view === "catalog" ? (
              <>
                <LibraryToolbar
                  favorite={filters.favorite}
                  rating={filters.rating}
                  sort={librarySort}
                  tileSize={tileSize}
                  filtersOpen={filtersOpen}
                  activeFilterCount={activeFilterCount}
                  filterButtonRef={filterButtonRef}
                  onShowAll={() => {
                    setFilterValue("favorite", "all");
                    setFilterValue("rating", "all");
                  }}
                  onShowFavorites={() =>
                    updateQuickFilter("favorite", "favorite")
                  }
                  onShowAnchors={() => updateQuickFilter("rating", "eq:5")}
                  onSortChange={setLibrarySort}
                  onTileSizeChange={updateTileSize}
                  onOpenFilters={openFilters}
                  onCloseFilters={closeFilters}
                />

                {filtersOpen ? (
                  <FilterDrawer
                    filters={filters}
                    query={query}
                    filteredCount={sortedLibraryItems.length}
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
                    ratingCounts={ratingCounts}
                    lifecycleOptions={LIFECYCLE_FILTER_OPTIONS}
                    lifecycleCounts={lifecycleCounts}
                    onToggleCollection={toggleCollection}
                    onSetFilterValue={setFilterValue}
                    onClearEverything={clearEverything}
                    onClose={closeFilters}
                  />
                ) : null}

                <ActiveFilterStrip tokens={filterTokens} />
              </>
            ) : (
              <AttemptToolbar
                attemptCount={attemptsInTimeRange.length}
                seriesCount={attemptSeries.length}
                unreviewedCount={unreviewedAttemptCount}
                sourceFilter={attemptSourceFilter}
                successfulCount={successfulAttemptCount}
                rawCount={rawAttemptCount}
                generatedTime={filters.generatedTime}
                generatedFrom={filters.generatedFrom}
                generatedTo={filters.generatedTo}
                reviewedTime={filters.reviewedTime}
                reviewedFrom={filters.reviewedFrom}
                reviewedTo={filters.reviewedTo}
                onSourceFilterChange={setAttemptSourceFilter}
                onGeneratedTimeChange={(value) =>
                  setFilterValue("generatedTime", value)
                }
                onGeneratedFromChange={(value) =>
                  setFilterValue("generatedFrom", value)
                }
                onGeneratedToChange={(value) =>
                  setFilterValue("generatedTo", value)
                }
                onReviewedTimeChange={(value) =>
                  setFilterValue("reviewedTime", value)
                }
                onReviewedFromChange={(value) =>
                  setFilterValue("reviewedFrom", value)
                }
                onReviewedToChange={(value) =>
                  setFilterValue("reviewedTo", value)
                }
                onReviewUnreviewed={() =>
                  openAttemptReview(
                    selectedAttempt,
                    "unreviewed",
                    filteredAttempts,
                  )
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
                      filteredCount={sortedLibraryItems.length}
                      totalCount={catalogItems.length}
                      hiddenRejectedCount={hiddenRejectedCount}
                      hasFilters={hasFilters}
                      query={query}
                      onClear={clearEverything}
                    />
                    {sortedLibraryItems.length ? (
                      <RenderGrid
                        items={sortedLibraryItems}
                        selectedId={selected?.id}
                        tileSize={tileSize}
                        scrollElement={galleryViewport}
                        resetKey={`${gridResetKey}:${librarySort}`}
                        onOpen={selectLibraryItem}
                        reviewedAtByRenderId={reviewedAtByRenderId}
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
                      eyebrow="ATTEMPT SERIES"
                      noun="SERIES"
                      filteredCount={attemptSeries.length}
                      totalCount={allAttemptSeries.length}
                      hiddenRejectedCount={0}
                      hasFilters={
                        attemptSourceFilter !== "all" ||
                        filters.generatedTime !== "all" ||
                        filters.reviewedTime !== "all"
                      }
                      query={attemptQuery}
                      onClear={() => {
                        setAttemptQuery("");
                        setAttemptSourceFilter("all");
                        setFilterValue("generatedTime", "all");
                        setFilterValue("reviewedTime", "all");
                      }}
                    />
                    {attemptGridItems.length ? (
                      <RenderGrid
                        items={attemptGridItems}
                        selectedId={selectedAttemptSeries?.latest.id}
                        tileSize={tileSize}
                        scrollElement={galleryViewport}
                        resetKey={`attempts:${attemptSourceFilter}:${filters.generatedTime}:${filters.generatedFrom}:${filters.generatedTo}:${filters.reviewedTime}:${filters.reviewedFrom}:${filters.reviewedTo}:${attemptQuery}`}
                        onOpen={openAttemptSeries}
                        presentationById={attemptPresentationById}
                        reviewedAtByRenderId={reviewedAtByRenderId}
                      />
                    ) : (
                      <AttemptEmptyState
                        hasQuery={Boolean(attemptQuery.trim())}
                        onClear={() => {
                          setAttemptQuery("");
                          setAttemptSourceFilter("all");
                          setFilterValue("generatedTime", "all");
                          setFilterValue("reviewedTime", "all");
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
                : "Selected attempt series details"
            }
          >
            <AutoHideScrollArea>
              {view === "catalog" ? (
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
                  onOpen={selected ? openSelectedViewer : undefined}
                  onReview={
                    selected ? () => openLibraryReview(selected) : undefined
                  }
                />
              ) : (
                <AttemptInspector
                  item={selectedAttempt}
                  seriesItems={selectedAttemptSeries?.attempts}
                  onSelectAttempt={(attempt) =>
                    setSelectedAttemptId(attempt.id)
                  }
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
                            selectedAttemptSeries?.attempts,
                          )
                      : undefined
                  }
                />
              )}
            </AutoHideScrollArea>
          </aside>
        </div>
      )}

      {view === "catalog" ? (
        <RenderViewer
          viewerRef={renderViewerRef}
          item={selected}
          review={selected ? reviews[selected.renderId] : undefined}
          isFavorite={selected ? favoriteIds.has(selected.renderId) : false}
          onPrevious={() => moveSelection(-1)}
          onNext={() => moveSelection(1)}
          onToggleFavorite={
            selected ? () => toggleFavorite(selected.renderId) : undefined
          }
          onReview={selected ? () => openLibraryReview(selected) : undefined}
          onClose={() => renderViewerRef.current?.close()}
        />
      ) : null}

      {view === "attempts" ? (
        <MobileAttemptViewer
          viewerRef={attemptViewerRef}
          item={selectedAttempt}
          seriesItems={selectedAttemptSeries?.attempts}
          onSelectAttempt={(attempt) => setSelectedAttemptId(attempt.id)}
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
                    selectedAttemptSeries?.attempts,
                  )
              : undefined
          }
          onClose={() => attemptViewerRef.current?.close()}
        />
      ) : null}

      {reviewOpen ? (
        <ReviewDesk
          key={reviewInitialRenderId}
          items={reviewItems}
          store={reviewStore}
          initialRenderId={reviewInitialRenderId}
          initialQueue={reviewQueue}
          comparisonItemsByRenderId={candidateOriginals}
          attempts={attempts}
          redoCompletions={redoCompletions}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onOpenRedoCandidate={openRedoCandidateFromDesk}
          onDiscardCandidate={discardCandidate}
          onPromoteCandidate={promoteCandidate}
          onClose={() => setReviewOpen(false)}
        />
      ) : null}
    </div>
  );
}
