"use client";

import { AutoHideScrollArea } from "../../_components/ui/auto-hide-scroll-area";
import type { GalleryItem } from "../../review-types";
import { ReviewCanvasImage } from "./review-canvas-image";

export function ReviewStage({
  current,
  zoomed,
  onToggleZoom,
  onPrevious,
  onNext,
  message,
}: {
  current: GalleryItem;
  zoomed: boolean;
  onToggleZoom: () => void;
  onPrevious: () => void;
  onNext: () => void;
  message: string;
}) {
  return (
    <section className="review-stage">
      <AutoHideScrollArea
        className={zoomed ? "review-canvas is-zoomed" : "review-canvas"}
        horizontal
      >
        <button
          className="review-canvas-action"
          type="button"
          onClick={onToggleZoom}
          aria-label="Toggle render zoom"
        >
          <ReviewCanvasImage key={current.renderId} item={current} />
        </button>
      </AutoHideScrollArea>
      <div className="review-stage-meta">
        <button type="button" onClick={onPrevious}>
          ← PREVIOUS
        </button>
        <div>
          <span>{current.collection}</span>
          <strong>
            {current.width}×{current.height}
          </strong>
        </div>
        <button type="button" onClick={onNext}>
          NEXT →
        </button>
      </div>
      <div className="review-shortcuts" aria-hidden="true">
        <span>
          <kbd>1–5</kbd> RATE
        </span>
        <span>
          <kbd>K</kbd> KEEP
        </span>
        <span>
          <kbd>R</kbd> REJECT
        </span>
        <span>
          <kbd>D</kbd> DELETE QUEUE
        </span>
        <span>
          <kbd>SPACE</kbd> ZOOM
        </span>
      </div>
      {message ? <div className="review-message">{message}</div> : null}
    </section>
  );
}
