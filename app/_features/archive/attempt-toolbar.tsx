"use client";

import { ActionButton } from "../../_components/ui/action-button";
import { SegmentedControl } from "../../_components/ui/segmented-control";
import { SavedTimeFilter } from "./filters/saved-time-filter";

export type AttemptSourceFilter = "all" | "successful" | "raw";

export function AttemptToolbar({
  attemptCount,
  seriesCount,
  unreviewedCount,
  sourceFilter,
  successfulCount,
  rawCount,
  generatedTime,
  generatedFrom,
  generatedTo,
  reviewedTime,
  reviewedFrom,
  reviewedTo,
  onSourceFilterChange,
  onGeneratedTimeChange,
  onGeneratedFromChange,
  onGeneratedToChange,
  onReviewedTimeChange,
  onReviewedFromChange,
  onReviewedToChange,
  onReviewUnreviewed,
}: {
  attemptCount: number;
  seriesCount: number;
  unreviewedCount: number;
  sourceFilter: AttemptSourceFilter;
  successfulCount: number;
  rawCount: number;
  generatedTime: string;
  generatedFrom: string;
  generatedTo: string;
  reviewedTime: string;
  reviewedFrom: string;
  reviewedTo: string;
  onSourceFilterChange: (filter: AttemptSourceFilter) => void;
  onGeneratedTimeChange: (value: string) => void;
  onGeneratedFromChange: (value: string) => void;
  onGeneratedToChange: (value: string) => void;
  onReviewedTimeChange: (value: string) => void;
  onReviewedFromChange: (value: string) => void;
  onReviewedToChange: (value: string) => void;
  onReviewUnreviewed: () => void;
}) {
  return (
    <>
      <div className="attempt-toolbar">
        <div className="attempt-toolbar-copy">
          <span className="eyebrow">ATTEMPT SERIES</span>
          <p>{seriesCount} series · {attemptCount} preserved outputs</p>
        </div>
        <SegmentedControl
          label="Output type"
          value={sourceFilter}
          onChange={onSourceFilterChange}
          options={[
            { value: "all", label: "All", count: attemptCount },
            { value: "successful", label: "Candidates", count: successfulCount },
            { value: "raw", label: "Preserved", count: rawCount },
          ]}
        />
        <SavedTimeFilter
          compact
          label="Generated"
          value={generatedTime}
          customFrom={generatedFrom}
          customTo={generatedTo}
          onChange={onGeneratedTimeChange}
          onCustomFromChange={onGeneratedFromChange}
          onCustomToChange={onGeneratedToChange}
        />
        <SavedTimeFilter
          compact
          label="Reviewed"
          value={reviewedTime}
          customFrom={reviewedFrom}
          customTo={reviewedTo}
          onChange={onReviewedTimeChange}
          onCustomFromChange={onReviewedFromChange}
          onCustomToChange={onReviewedToChange}
        />
        <ActionButton
          className="attempt-review-action"
          variant="primary"
          size="compact"
          onClick={onReviewUnreviewed}
          disabled={!unreviewedCount}
        >
          REVIEW NEW · {unreviewedCount}
        </ActionButton>
      </div>
    </>
  );
}
