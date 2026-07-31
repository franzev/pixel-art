"use client";

import type { RefObject } from "react";
import { AutoHideScrollArea } from "../../_components/ui/auto-hide-scroll-area";
import type {
  RenderReview,
  ReviewDecision,
  ReviewDefect,
} from "../../review-types";
import { DecisionControl } from "./decision-control";
import { DefectControl } from "./defect-control";
import { FeedbackEditor } from "./feedback-editor";
import { FinishReviewButton } from "./finish-review-button";
import { RatingControl } from "./rating-control";
import type { DefectOption } from "./review-config";
import { SuggestedTagsControl } from "./suggested-tags-control";

export function ReviewPanel({
  review,
  detailMode,
  onSetRating,
  onChooseDecision,
  onCycleTag,
  onToggleDefect,
  onCycleDefectSeverity,
  noteDraft,
  onNoteDraftChange,
  correctionDraft,
  onCorrectionDraftChange,
  onSaveDrafts,
  noteRef,
  onFinishDetail,
}: {
  review: RenderReview;
  detailMode: boolean;
  onSetRating: (rating: number) => void;
  onChooseDecision: (decision: ReviewDecision) => void;
  onCycleTag: (key: string) => void;
  onToggleDefect: (option: DefectOption) => void;
  onCycleDefectSeverity: (defect: ReviewDefect) => void;
  noteDraft: string;
  onNoteDraftChange: (value: string) => void;
  correctionDraft: string;
  onCorrectionDraftChange: (value: string) => void;
  onSaveDrafts: () => void;
  noteRef: RefObject<HTMLTextAreaElement | null>;
  onFinishDetail: () => void;
}) {
  return (
    <aside className="review-panel">
      <AutoHideScrollArea>
        <RatingControl
          overallRating={review.overallRating}
          onSetRating={onSetRating}
        />

        <DecisionControl
          decision={review.decision}
          onChooseDecision={onChooseDecision}
        />

        <SuggestedTagsControl tags={review.tags} onCycleTag={onCycleTag} />

        {detailMode || review.defects.length ? (
          <DefectControl
            defects={review.defects}
            onToggleDefect={onToggleDefect}
            onCycleSeverity={onCycleDefectSeverity}
          />
        ) : null}

        <FeedbackEditor
          noteDraft={noteDraft}
          onNoteDraftChange={onNoteDraftChange}
          correctionDraft={correctionDraft}
          onCorrectionDraftChange={onCorrectionDraftChange}
          onBlurSave={onSaveDrafts}
          noteRef={noteRef}
        />

        {detailMode ? <FinishReviewButton onFinish={onFinishDetail} /> : null}
      </AutoHideScrollArea>
    </aside>
  );
}
