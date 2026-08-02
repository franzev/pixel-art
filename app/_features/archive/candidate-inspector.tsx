"use client";

import { useState } from "react";

import type {
  AttemptItem,
  GalleryItem,
  RenderReview,
} from "../../review-types";
import { PreviewImage } from "./grid/preview-image";
import { formatSavedTimestamp } from "./saved-time";

type CatalogPlacement = "variant" | "replace";

export function CandidateInspector({
  candidate,
  original,
  history,
  review,
  onPrevious,
  onNext,
  onReview,
  onViewHistory,
  onPromote,
}: {
  candidate: AttemptItem;
  original?: GalleryItem;
  history: AttemptItem[];
  review?: RenderReview;
  onPrevious: () => void;
  onNext: () => void;
  onReview: () => void;
  onViewHistory: () => void;
  onPromote: (placement: CatalogPlacement) => Promise<void>;
}) {
  const [promoting, setPromoting] = useState(false);
  const [promotionError, setPromotionError] = useState("");
  const canPromote = review?.decision === "keep";

  const promote = async (placement: CatalogPlacement) => {
    if (!canPromote || promoting) return;
    if (
      placement === "replace" &&
      !window.confirm(
        "Replace the original Catalog image? It will be archived, your review will be preserved, and all raw attempts will remain in history.",
      )
    ) return;
    setPromoting(true);
    setPromotionError("");
    try {
      await onPromote(placement);
    } catch (error) {
      setPromotionError(error instanceof Error ? error.message : "Promotion failed.");
      setPromoting(false);
    }
  };
  return (
    <div className="inspector-content candidate-inspector">
      <div className="inspector-toolbar">
        <div>
          <span className="eyebrow">
            {canPromote ? "READY TO FILE" : "UNREVIEWED CANDIDATE"}
          </span>
          <h2>{candidate.concept}</h2>
        </div>
      </div>

      <div className="candidate-comparison" aria-label="Original and candidate comparison">
        <figure>
          <figcaption>ORIGINAL CATALOG</figcaption>
          {original ? (
            <div className="candidate-comparison-art">
              <PreviewImage item={original} alt={`Original ${original.name}`} inspector eager />
            </div>
          ) : (
            <div className="candidate-comparison-empty">NO EXISTING IMAGE</div>
          )}
        </figure>
        <figure>
          <figcaption>NEW CANDIDATE</figcaption>
          <div className="candidate-comparison-art">
            <PreviewImage
              item={candidate}
              alt={`Candidate ${candidate.concept}`}
              inspector
              eager
            />
          </div>
        </figure>
      </div>

      <div className="inspector-nav" aria-label="Candidate navigation">
        <button type="button" onClick={onPrevious}>← PREVIOUS</button>
        <button type="button" onClick={onNext}>NEXT →</button>
      </div>

      <dl className="metadata-list">
        <div><dt>Collection</dt><dd>{candidate.collection}</dd></div>
        <div><dt>Version</dt><dd>{String(candidate.attempt).padStart(2, "0")}</dd></div>
        <div><dt>History</dt><dd>{history.length} preserved outputs</dd></div>
        <div>
          <dt>Saved</dt>
          <dd>
            <time dateTime={candidate.generatedAt}>
              {formatSavedTimestamp(candidate.generatedAt)}
            </time>
          </dd>
        </div>
        <div><dt>Decision</dt><dd>{review?.decision ?? "Unreviewed"}</dd></div>
        <div><dt>Rating</dt><dd>{review?.overallRating ? `${review.overallRating} / 5` : "—"}</dd></div>
      </dl>

      <div className="candidate-actions">
        <div className="candidate-placement-actions" aria-label="Catalog placement">
          <button
            type="button"
            className="candidate-primary-action"
            disabled={!canPromote || promoting}
            onClick={() => promote("variant")}
          >
            {promoting ? "ADDING…" : "ADD AS VARIANT"}
          </button>
          <button
            type="button"
            className="candidate-replace-action"
            disabled={!canPromote || promoting}
            onClick={() => promote("replace")}
          >
            REPLACE ORIGINAL
          </button>
        </div>
        <button type="button" className="candidate-primary-action" onClick={onReview}>
          {review?.decision ? "EDIT REVIEW" : "REVIEW CANDIDATE"}
        </button>
        <button type="button" onClick={onViewHistory}>
          VIEW ALL ATTEMPTS · {history.length}
        </button>
      </div>

      {!canPromote && (
        <p className="candidate-action-note">Save a Keep review before choosing a Catalog placement.</p>
      )}
      {promotionError && (
        <p className="candidate-action-error" role="alert">{promotionError}</p>
      )}

      <div className="attempt-provenance">
        <span>SAFE WORKFLOW</span>
        <p>
          {canPromote
            ? "This candidate is kept and ready for a Catalog placement. The original remains unchanged until you choose a placement."
            : "The candidate is shown as Unreviewed without changing the active Catalog image. Raw attempts remain preserved in history."}
        </p>
      </div>
    </div>
  );
}
