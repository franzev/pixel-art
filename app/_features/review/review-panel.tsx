"use client";

import type { RefObject } from "react";
import { AutoHideScrollArea } from "../../_components/ui/auto-hide-scroll-area";
import type {
  RenderReview,
  ReviewDecision,
  ReviewDefect,
} from "../../review-types";
import {
  CatalogOutcomeControl,
  type CatalogOutcome,
} from "./catalog-outcome-control";
import { DecisionControl } from "./decision-control";
import { DefectControl } from "./defect-control";
import { FeedbackEditor } from "./feedback-editor";
import { FinishReviewButton } from "./finish-review-button";
import { OriginalReviewSummary } from "./original-review-summary";
import { RatingControl } from "./rating-control";
import type { DefectOption } from "./review-config";
import { SuggestedTagsControl } from "./suggested-tags-control";

export function ReviewPanel({
  review,
  detailMode,
  comparisonMode,
  originalName,
  originalReview,
  catalogOutcomePending,
  catalogOutcomeError,
  onSetRating,
  onChooseDecision,
  onChooseCatalogOutcome,
  onCycleTag,
  onToggleDefect,
  onCycleDefectSeverity,
  feedbackDraft,
  onFeedbackDraftChange,
  onSaveDrafts,
  noteRef,
  onFinishDetail,
}: {
  review: RenderReview;
  detailMode: boolean;
  comparisonMode: boolean;
  originalName?: string;
  originalReview?: RenderReview;
  catalogOutcomePending: CatalogOutcome | null;
  catalogOutcomeError: string;
  onSetRating: (rating: number) => void;
  onChooseDecision: (decision: ReviewDecision) => void;
  onChooseCatalogOutcome: (outcome: CatalogOutcome) => void;
  onCycleTag: (key: string) => void;
  onToggleDefect: (option: DefectOption) => void;
  onCycleDefectSeverity: (defect: ReviewDefect) => void;
  feedbackDraft: string;
  onFeedbackDraftChange: (value: string) => void;
  onSaveDrafts: () => void;
  noteRef: RefObject<HTMLTextAreaElement | null>;
  onFinishDetail: () => void;
}) {
  return (
    <aside className="review-panel">
      <AutoHideScrollArea>
        {comparisonMode ? (
          <OriginalReviewSummary
            originalName={originalName}
            review={originalReview}
          />
        ) : null}

        <RatingControl
          overallRating={review.overallRating}
          onSetRating={onSetRating}
        />

        {comparisonMode ? (
          <CatalogOutcomeControl
            decision={review.decision}
            pending={catalogOutcomePending}
            error={catalogOutcomeError}
            onChooseOutcome={onChooseCatalogOutcome}
          />
        ) : (
          <DecisionControl
            decision={review.decision}
            onChooseDecision={onChooseDecision}
          />
        )}

        <SuggestedTagsControl tags={review.tags} onCycleTag={onCycleTag} />

        {detailMode || review.defects.length ? (
          <DefectControl
            defects={review.defects}
            onToggleDefect={onToggleDefect}
            onCycleSeverity={onCycleDefectSeverity}
          />
        ) : null}

        <FeedbackEditor
          feedbackDraft={feedbackDraft}
          onFeedbackDraftChange={onFeedbackDraftChange}
          onBlurSave={onSaveDrafts}
          noteRef={noteRef}
        />

        {detailMode ? <FinishReviewButton onFinish={onFinishDetail} /> : null}
      </AutoHideScrollArea>
    </aside>
  );
}
