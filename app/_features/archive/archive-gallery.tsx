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
import type { GalleryItem } from "../../review-types";
import { ReviewDesk } from "../review/review-desk";
import type { ReviewQueue } from "../review/review-queue";
import { useReviewStore } from "../review/use-review-store";
import { ActiveFilterStrip } from "./active-filter-strip";
import { ArchiveHeader } from "./archive-header";
import {
  DECISION_FILTER_OPTIONS,
  DECISION_QUEUES,
  FAVORITE_FILTER_OPTIONS,
  LIFECYCLE_FILTER_OPTIONS,
  RATING_FILTER_OPTIONS,
} from "./archive-config";
import type { ArchiveGalleryProps } from "./archive-types";
import { FilterDrawer } from "./filters/filter-drawer";
import { GalleryEmptyState } from "./gallery-empty-state";
import { GalleryHeading } from "./gallery-heading";
import { RenderGrid } from "./grid/render-grid";
import { useCatalogAutoRefresh } from "./hooks/use-catalog-auto-refresh";
import { useGalleryFilters } from "./hooks/use-gallery-filters";
import { useGalleryPreferences } from "./hooks/use-gallery-preferences";
import { MobileRenderViewer } from "./mobile-render-viewer";
import { QuickFilterBar } from "./quick-filter-bar";
import { RenderInspector } from "./render-inspector";

export function ArchiveGallery({ catalog }: ArchiveGalleryProps) {
  const items = useMemo(() => expandGalleryCatalog(catalog), [catalog]);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewItems, setReviewItems] = useState<GalleryItem[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueue>("unreviewed");
  const [galleryViewport, setGalleryViewport] =
    useState<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const viewerRef = useRef<HTMLDialogElement>(null);
  const reviewStore = useReviewStore(items);
  const { reviews } = reviewStore;
  const galleryViewportRef = useCallback(
    (node: HTMLDivElement | null) => setGalleryViewport(node),
    [],
  );

  const { favoriteIds, tileSize, toggleFavorite, setTileSize } =
    useGalleryPreferences(items);

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
  } = useGalleryFilters(items, favoriteIds, reviews);

  useCatalogAutoRefresh({
    currentVersion: catalog.version,
    busy: filtersOpen || reviewOpen,
  });

  const selected =
    filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];

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

  useEffect(() => {
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

      if (!isTyping && !reviewOpen && selected) {
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
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const openItem = (item: GalleryItem) => {
    setSelectedId(item.id);
    setReviewQueue(DECISION_QUEUES[filters.decision] ?? "all");
    // Snapshot the current narrowed view: with instant filters, a decision
    // made inside the desk must not eject the render mid-review (losing the
    // What-failed detail step) or reshuffle the queue underfoot.
    setReviewItems(filteredItems);
    setReviewOpen(true);
  };

  const updateTileSize = (event: ChangeEvent<HTMLInputElement>) => {
    setTileSize(Number(event.target.value));
  };

  const decisionOptions = DECISION_FILTER_OPTIONS;
  const lifecycleOptions = LIFECYCLE_FILTER_OPTIONS;
  const ratingOptions = RATING_FILTER_OPTIONS;
  const favoriteOptions = FAVORITE_FILTER_OPTIONS;

  return (
    <div className="archive-app">
      <a className="skip-link" href="#render-grid">
        Skip to render grid
      </a>

      <ArchiveHeader
        query={query}
        onQueryChange={setQuery}
        searchRef={searchRef}
        tileSize={tileSize}
        onTileSizeChange={updateTileSize}
      />

      <div className="archive-shell">
        <section className="gallery-browser" aria-label="Render browser">
          <QuickFilterBar
            favorite={filters.favorite}
            decision={filters.decision}
            rating={filters.rating}
            onUpdateQuickFilter={updateQuickFilter}
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
              decisionCounts={decisionCounts}
              ratingOptions={ratingOptions}
              ratingCounts={ratingCounts}
              lifecycleOptions={lifecycleOptions}
              lifecycleCounts={lifecycleCounts}
              onToggleCollection={toggleCollection}
              onSetFilterValue={setFilterValue}
              onClearEverything={clearEverything}
              onClose={closeFilters}
            />
          ) : null}

          <ActiveFilterStrip tokens={filterTokens} />

          <AutoHideScrollArea
            className="gallery-scroll-area"
            viewportRef={galleryViewportRef}
          >
            <main className="gallery-region">
              <GalleryHeading
                filteredCount={filteredItems.length}
                totalCount={items.length}
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
                  onShowAllFavorites={() => setFilterValue("favorite", "all")}
                  onClearEverything={clearEverything}
                />
              )}
            </main>
          </AutoHideScrollArea>
        </section>

        <aside
          className="desktop-inspector"
          aria-label="Selected render details"
        >
          <AutoHideScrollArea>
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
            <div className="library-note">
              <span>LIBRARY</span>
              <strong>{items.length}</strong>
              <p>Reference renders indexed from the working repository.</p>
            </div>
          </AutoHideScrollArea>
        </aside>
      </div>

      <MobileRenderViewer
        viewerRef={viewerRef}
        item={selected}
        review={selected ? reviews[selected.renderId] : undefined}
        isFavorite={selected ? favoriteIds.has(selected.renderId) : false}
        onPrevious={() => moveSelection(-1)}
        onNext={() => moveSelection(1)}
        onToggleFavorite={
          selected ? () => toggleFavorite(selected.renderId) : undefined
        }
        onEdit={selected ? () => openItem(selected) : undefined}
        onClose={() => viewerRef.current?.close()}
      />

      {reviewOpen ? (
        <ReviewDesk
          items={reviewItems}
          store={reviewStore}
          initialRenderId={selected?.renderId}
          initialQueue={reviewQueue}
          onClose={() => setReviewOpen(false)}
        />
      ) : null}
    </div>
  );
}
