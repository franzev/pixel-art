"use client";

import { AutoHideScrollArea } from "../../../_components/ui/auto-hide-scroll-area";
import type { FilterState } from "../archive-filters";
import { CollectionFilter } from "./collection-filter";
import { FilterGroup } from "./filter-group";
import { RaceFilter } from "./race-filter";
import { RatingFilter } from "./rating-filter";
import { SavedTimeFilter } from "./saved-time-filter";
import { FilterSection } from "./filter-section";

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
          <FilterSection
            title="Collection"
            summary={
              filters.collections.length
                ? `${filters.collections.length} selected`
                : "Any"
            }
          >
            <CollectionFilter
              selectedCollections={filters.collections}
              query={collectionQuery}
              onQueryChange={onCollectionQueryChange}
              totalCount={collectionOptions.length}
              matching={matchingCollections}
              counts={collectionCounts}
              onToggle={onToggleCollection}
            />
          </FilterSection>

          <FilterSection
            title="Subject"
            summary={
              filters.gender !== "all" || filters.race !== "all"
                ? "Filtered"
                : "Any"
            }
          >
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
          </FilterSection>

          <FilterSection
            title="Rating & state"
            summary={
              filters.rating !== "all" ||
              filters.lifecycle !== "active" ||
              filters.generatedTime !== "all" ||
              filters.reviewedTime !== "all"
                ? "Filtered"
                : "Any"
            }
          >
            <SavedTimeFilter
              label="Generated"
              help="Generated ranges use when the render file was saved. Calendar ranges use GMT+8."
              value={filters.generatedTime}
              customFrom={filters.generatedFrom}
              customTo={filters.generatedTo}
              onChange={(generatedTime) =>
                onSetFilterValue("generatedTime", generatedTime)
              }
              onCustomFromChange={(generatedFrom) =>
                onSetFilterValue("generatedFrom", generatedFrom)
              }
              onCustomToChange={(generatedTo) =>
                onSetFilterValue("generatedTo", generatedTo)
              }
            />
            <SavedTimeFilter
              label="Reviewed"
              help="Reviewed ranges use when a render first had a review recorded. Unreviewed renders do not match."
              value={filters.reviewedTime}
              customFrom={filters.reviewedFrom}
              customTo={filters.reviewedTo}
              onChange={(reviewedTime) =>
                onSetFilterValue("reviewedTime", reviewedTime)
              }
              onCustomFromChange={(reviewedFrom) =>
                onSetFilterValue("reviewedFrom", reviewedFrom)
              }
              onCustomToChange={(reviewedTo) =>
                onSetFilterValue("reviewedTo", reviewedTo)
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
          </FilterSection>
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
