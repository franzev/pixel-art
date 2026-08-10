"use client";

import type { RefObject } from "react";
import { AutoHideScrollArea } from "../../_components/ui/auto-hide-scroll-area";
import type {
  AttemptItem,
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
import { FavoriteControl } from "./favorite-control";
import { FinishReviewButton } from "./finish-review-button";
import { OriginalReviewSummary } from "./original-review-summary";
import { RatingControl } from "./rating-control";
import { RenderGateControl } from "./render-gate-control";
import type { RedoProcessingStatus } from "./redo-processing-status";
import { RedoProcessingSummary } from "./redo-processing-summary";
import type { DefectOption } from "./review-config";
import { SuggestedTagsControl } from "./suggested-tags-control";
import type {
  RenderGateAttestations,
  RenderGateDiagnostics,
  RenderGateState,
} from "./use-render-gate";

export function ReviewPanel({
  review,
  detailMode,
  comparisonMode,
  originalName,
  originalReview,
  currentName,
  isFavorite,
  redoStatus,
  latestRedoReview,
  currentRenderId,
  renderGateState,
  renderGateErrors,
  renderGatePassedAt,
  renderGateDiagnostics,
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
  onOpenRedoCandidate,
  onToggleFavorite,
  onCompleteRenderGate,
  onRetryRenderGate,
}: {
  review: RenderReview;
  detailMode: boolean;
  comparisonMode: boolean;
  originalName?: string;
  originalReview?: RenderReview;
  currentName: string;
  isFavorite: boolean;
  redoStatus?: RedoProcessingStatus | null;
  latestRedoReview?: RenderReview;
  currentRenderId: string;
  renderGateState: RenderGateState;
  renderGateErrors: string[];
  renderGatePassedAt?: string;
  renderGateDiagnostics?: RenderGateDiagnostics;
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
  onOpenRedoCandidate?: (candidate: AttemptItem) => void;
  onToggleFavorite: () => void;
  onCompleteRenderGate: (attestations: RenderGateAttestations) => Promise<void>;
  onRetryRenderGate: () => Promise<void>;
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

        {!comparisonMode && redoStatus ? (
          <RedoProcessingSummary
            status={redoStatus}
            latestReview={latestRedoReview}
            onOpenCandidate={onOpenRedoCandidate}
          />
        ) : null}

        <FavoriteControl
          name={currentName}
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
        />

        <RatingControl
          overallRating={review.overallRating}
          onSetRating={onSetRating}
        />

        {comparisonMode ? (
          <RenderGateControl
            key={currentRenderId}
            state={renderGateState}
            errors={renderGateErrors}
            passedAt={renderGatePassedAt}
            diagnostics={renderGateDiagnostics}
            onComplete={onCompleteRenderGate}
            onRetry={onRetryRenderGate}
          />
        ) : null}

        {comparisonMode ? (
          <CatalogOutcomeControl
            decision={review.decision}
            pending={catalogOutcomePending}
            error={catalogOutcomeError}
            renderGateState={renderGateState}
            onChooseOutcome={onChooseCatalogOutcome}
          />
        ) : (
          <DecisionControl
            decision={review.decision}
            onChooseDecision={onChooseDecision}
          />
        )}

        <details className="review-more-details" open={detailMode || undefined}>
          <summary>
            <span>Details &amp; notes</span>
            <small>
              {review.defects.length
                ? `${review.defects.length} defect${review.defects.length === 1 ? "" : "s"}`
                : feedbackDraft.trim()
                  ? "Notes saved"
                  : "Optional"}
            </small>
          </summary>

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
        </details>

        {detailMode ? <FinishReviewButton onFinish={onFinishDetail} /> : null}
      </AutoHideScrollArea>
    </aside>
  );
}
