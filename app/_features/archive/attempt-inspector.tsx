"use client";

import type { AttemptItem, RenderReview } from "../../review-types";
import { CATEGORY_LABELS, DECISION_LABELS } from "./archive-config";
import { PreviewImage } from "./grid/preview-image";
import { formatSavedTimestamp } from "./saved-time";

export function AttemptInspector({
  item,
  onPrevious,
  onNext,
  review,
  onReview,
  onClose,
  compact = false,
}: {
  item?: AttemptItem;
  onPrevious: () => void;
  onNext: () => void;
  review?: RenderReview;
  onReview?: () => void;
  onClose?: () => void;
  compact?: boolean;
}) {
  if (!item) {
    return (
      <div className="inspector-empty">
        <span>SELECT AN ATTEMPT</span>
        <p>Choose a preserved output to inspect it at useful scale.</p>
      </div>
    );
  }

  return (
    <div
      className={compact ? "inspector-content compact" : "inspector-content"}
    >
      <div className="inspector-toolbar">
        <div>
          <span className="eyebrow">
            {item.sourceKind === "archive"
              ? `ARCHIVED ATTEMPT ${item.attempt}`
              : `SUCCESSFUL CANDIDATE V${String(item.attempt).padStart(2, "0")}`}
          </span>
          <h2>{item.concept}</h2>
        </div>
        {onClose ? (
          <div className="inspector-toolbar-actions">
            <button
              className="square-action"
              type="button"
              onClick={onClose}
              aria-label="Close attempt viewer"
            >
              CLOSE
            </button>
          </div>
        ) : null}
      </div>

      <div className="inspector-art">
        <span className="render-image-placeholder" aria-hidden="true" />
        <PreviewImage item={item} alt={item.concept} inspector eager />
      </div>

      <div className="inspector-nav" aria-label="Attempt navigation">
        <button type="button" onClick={onPrevious}>
          ← PREVIOUS
        </button>
        <button type="button" onClick={onNext}>
          NEXT →
        </button>
      </div>

      <dl className="metadata-list">
        <div>
          <dt>Category</dt>
          <dd>{CATEGORY_LABELS[item.category] ?? item.category}</dd>
        </div>
        <div>
          <dt>Collection</dt>
          <dd>{item.collection}</dd>
        </div>
        <div>
          <dt>{item.sourceKind === "archive" ? "Attempt" : "Revision"}</dt>
          <dd>{String(item.attempt).padStart(2, "0")}</dd>
        </div>
        <div>
          <dt>Dimensions</dt>
          <dd>
            {item.width} × {item.height}
          </dd>
        </div>
        <div>
          <dt>Saved</dt>
          <dd>
            <time dateTime={item.generatedAt}>
              {formatSavedTimestamp(item.generatedAt)}
            </time>
          </dd>
        </div>
        <div>
          <dt>Catalog</dt>
          <dd>Not included</dd>
        </div>
        <div>
          <dt>Decision</dt>
          <dd>
            {review?.decision ? DECISION_LABELS[review.decision] : "Unreviewed"}
          </dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{review?.overallRating ? `${review.overallRating} / 5` : "—"}</dd>
        </div>
      </dl>

      {onReview ? (
        <div className="inspector-review-action">
          <button type="button" onClick={onReview}>
            {review?.decision ? "EDIT REVIEW" : "REVIEW THIS ATTEMPT"}
          </button>
        </div>
      ) : null}

      <div className="attempt-provenance">
        <span>PROVENANCE</span>
        <p>
          {item.sourceKind === "archive"
            ? "Preserved raw generator output."
            : "Generation completed successfully and produced this staged candidate."} This
          output has no canonical status; review decisions are tracked
          separately.
        </p>
      </div>

      <div className="filename-block">
        <span>SOURCE PATH</span>
        <code>{item.sourcePath}</code>
      </div>
    </div>
  );
}
