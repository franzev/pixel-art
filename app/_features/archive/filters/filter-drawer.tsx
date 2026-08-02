"use client";

import { AutoHideScrollArea } from "../../../_components/ui/auto-hide-scroll-area";
import type { FilterState } from "../archive-filters";
import { CollectionFilter } from "./collection-filter";
import { FilterGroup } from "./filter-group";
import { RaceFilter } from "./race-filter";
import { RatingFilter } from "./rating-filter";
import { SavedTimeFilter } from "./saved-time-filter";
import { ReviewProgressSummary } from "../review-progress";
import type { ReviewProgress } from "../review-summary";

type FilterOption = { value: string; label: string };

export function FilterDrawer({
  filters,
  query,
  filteredCount,
  hasFilters,
  collectionQuery,
  onCollectionQueryChange,
  collectionOptions,
  collectionCounts,
  matchingCollections,
  raceQuery,
  onRaceQueryChange,
  raceOptions,
  raceCounts,
  matchingRaceOptions,
  genderOptions,
  genderCounts,
  favoriteOptions,
  favoriteCounts,
  decisionOptions,
  decisionCounts,
  reviewProgress,
  onShowRedoSources,
  onShowGeneratedOutputs,
  ratingCounts,
  lifecycleOptions,
  lifecycleCounts,
  onToggleCollection,
  onSetFilterValue,
  onClearEverything,
  onClose,
}: {
  filters: FilterState;
  query: string;
  filteredCount: number;
  hasFilters: boolean;
  collectionQuery: string;
  onCollectionQueryChange: (value: string) => void;
  collectionOptions: string[];
  collectionCounts: Map<string, number>;
  matchingCollections: string[];
  raceQuery: string;
  onRaceQueryChange: (value: string) => void;
  raceOptions: FilterOption[];
  raceCounts: Map<string, number>;
  matchingRaceOptions: FilterOption[];
  genderOptions: FilterOption[];
  genderCounts: Map<string, number>;
  favoriteOptions: FilterOption[];
  favoriteCounts: Map<string, number>;
  decisionOptions: FilterOption[];
  decisionCounts: Map<string, number>;
  reviewProgress: ReviewProgress;
  onShowRedoSources: () => void;
  onShowGeneratedOutputs: () => void;
  ratingCounts: Map<string, number>;
  lifecycleOptions: FilterOption[];
  lifecycleCounts: Map<string, number>;
  onToggleCollection: (name: string) => void;
  onSetFilterValue: (key: keyof FilterState, value: string) => void;
  onClearEverything: () => void;
  onClose: () => void;
}) {
  const raceLabel =
    raceOptions.find((option) => option.value === filters.race)?.label ??
    filters.race;

  return (
    <section
      id="archive-filters"
      className="filter-drawer"
      aria-label="Filter renders"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <AutoHideScrollArea className="filter-drawer-scroll">
        <div className="filter-drawer-columns">
          <section className="filter-section">
            <h3>Collections</h3>
            <CollectionFilter
              selectedCollections={filters.collections}
              query={collectionQuery}
              onQueryChange={onCollectionQueryChange}
              totalCount={collectionOptions.length}
              matching={matchingCollections}
              counts={collectionCounts}
              onToggle={onToggleCollection}
            />
          </section>

          <section className="filter-section">
            <h3>Subject</h3>
            <FilterGroup
              label="Gender"
              value={filters.gender}
              options={genderOptions}
              counts={genderCounts}
              onChange={(gender) => onSetFilterValue("gender", gender)}
            />
            <RaceFilter
              value={filters.race}
              selectedLabel={raceLabel}
              query={raceQuery}
              onQueryChange={onRaceQueryChange}
              totalCount={raceOptions.length - 1}
              matching={matchingRaceOptions}
              counts={raceCounts}
              onChange={(race) => onSetFilterValue("race", race)}
            />
          </section>

          <section className="filter-section">
            <h3>Review</h3>
            <ReviewProgressSummary
              progress={reviewProgress}
              onShowRedoSources={onShowRedoSources}
              onShowGeneratedOutputs={onShowGeneratedOutputs}
            />
            <FilterGroup
              label="Favorites"
              value={filters.favorite}
              options={favoriteOptions}
              counts={favoriteCounts}
              onChange={(favorite) => onSetFilterValue("favorite", favorite)}
            />
            <FilterGroup
              label="Decision"
              value={filters.decision}
              options={decisionOptions}
              counts={decisionCounts}
              onChange={(decision) => onSetFilterValue("decision", decision)}
            />
          </section>

          <section className="filter-section">
            <h3>Rating &amp; state</h3>
            <SavedTimeFilter
              value={filters.savedTime}
              customFrom={filters.savedFrom}
              customTo={filters.savedTo}
              onChange={(savedTime) =>
                onSetFilterValue("savedTime", savedTime)
              }
              onCustomFromChange={(savedFrom) =>
                onSetFilterValue("savedFrom", savedFrom)
              }
              onCustomToChange={(savedTo) =>
                onSetFilterValue("savedTo", savedTo)
              }
            />
            <RatingFilter
              value={filters.rating}
              counts={ratingCounts}
              onChange={(rating) => onSetFilterValue("rating", rating)}
            />
            <FilterGroup
              label="Lifecycle"
              value={filters.lifecycle}
              options={lifecycleOptions}
              counts={lifecycleCounts}
              onChange={(lifecycle) =>
                onSetFilterValue("lifecycle", lifecycle)
              }
            />
          </section>
        </div>
      </AutoHideScrollArea>

      <div className="filter-drawer-footer">
        <button
          type="button"
          onClick={onClearEverything}
          disabled={!hasFilters && !query.trim()}
        >
          CLEAR ALL
        </button>
        <span className="filter-drawer-count">
          SHOWING {filteredCount} RENDERS
        </span>
        <button className="filter-drawer-done" type="button" onClick={onClose}>
          DONE
        </button>
      </div>
    </section>
  );
}
