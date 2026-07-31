"use client";

import type { GalleryItem, RenderReview } from "../../review-types";
import { CATEGORY_LABELS, DECISION_LABELS } from "./archive-config";
import { PreviewImage } from "./grid/preview-image";

export function RenderInspector({
  item,
  review,
  isFavorite,
  onPrevious,
  onNext,
  onToggleFavorite,
  onEdit,
  onClose,
  compact = false,
}: {
  item?: GalleryItem;
  review?: RenderReview;
  isFavorite: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFavorite?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
  compact?: boolean;
}) {
  if (!item) {
    return (
      <div className="inspector-empty">
        <span>SELECT A RENDER</span>
        <p>Choose any tile to inspect its repository details.</p>
      </div>
    );
  }

  return (
    <div
      className={compact ? "inspector-content compact" : "inspector-content"}
    >
      <div className="inspector-toolbar">
        <div>
          <span className="eyebrow">SELECTED RENDER</span>
          <h2>{item.name}</h2>
        </div>
        <div className="inspector-toolbar-actions">
          {onToggleFavorite ? (
            <button
              className={
                isFavorite
                  ? "favorite-action is-active"
                  : "favorite-action"
              }
              type="button"
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              aria-label={
                isFavorite
                  ? `Remove ${item.name} from favorites`
                  : `Add ${item.name} to favorites`
              }
              title="Toggle favorite (F)"
            >
              <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
              <span>{isFavorite ? "FAVORITED" : "FAVORITE"}</span>
              <kbd>F</kbd>
            </button>
          ) : null}
          {onClose ? (
            <button
              className="square-action"
              type="button"
              onClick={onClose}
              aria-label="Close render viewer"
            >
              CLOSE
            </button>
          ) : null}
        </div>
      </div>

      <div className="inspector-art">
        <span className="render-image-placeholder" aria-hidden="true" />
        <PreviewImage item={item} alt={item.name} inspector eager />
      </div>

      <div className="inspector-nav" aria-label="Render navigation">
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
          <dt>Dimensions</dt>
          <dd>
            {item.width} × {item.height}
          </dd>
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

      {review?.note || review?.correctionNote ? (
        <div className="inspector-feedback">
          {review.note ? (
            <div>
              <span>FEEDBACK</span>
              <p>{review.note}</p>
            </div>
          ) : null}
          {review.correctionNote ? (
            <div>
              <span>NEXT ATTEMPT</span>
              <p>{review.correctionNote}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {onEdit ? (
        <div className="inspector-review-action">
          <button type="button" onClick={onEdit}>
            {review?.decision ? "EDIT REVIEW" : "REVIEW THIS RENDER"}
          </button>
        </div>
      ) : null}

      <div className="filename-block">
        <span>FILE</span>
        <code>{item.filename}</code>
      </div>
    </div>
  );
}
