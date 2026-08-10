"use client";

import type { CSSProperties } from "react";
import { AutoHideScrollArea } from "../../_components/ui/auto-hide-scroll-area";
import type { GalleryItem } from "../../review-types";
import { ReviewCanvasImage } from "./review-canvas-image";

export function ReviewStage({
  current,
  original,
  compareWithCatalog = false,
  catalogOutcomeMode = false,
  onPrevious,
  onNext,
  message,
}: {
  current: GalleryItem;
  original?: GalleryItem;
  compareWithCatalog?: boolean;
  catalogOutcomeMode?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  message: string;
}) {
  return (
    <section className="review-stage">
      <AutoHideScrollArea className="review-canvas">
        <div className="review-canvas-action">
          {compareWithCatalog ? (
            <span
              className="review-catalog-comparison"
              style={
                {
                  "--comparison-total-aspect": `${
                    (original?.width ?? current.width) /
                      (original?.height ?? current.height) +
                    current.width / current.height
                  }`,
                } as CSSProperties
              }
            >
              <span
                className="review-comparison-item"
                style={
                  {
                    "--comparison-aspect": `${
                      (original?.width ?? current.width) /
                      (original?.height ?? current.height)
                    }`,
                  } as CSSProperties
                }
              >
                <span className="review-comparison-label">
                  ORIGINAL CATALOG
                </span>
                {original ? (
                  <ReviewCanvasImage key={original.renderId} item={original} />
                ) : (
                  <span className="review-comparison-empty">
                    NO EXISTING IMAGE
                  </span>
                )}
              </span>
              <span
                className="review-comparison-item"
                style={
                  {
                    "--comparison-aspect": `${current.width / current.height}`,
                  } as CSSProperties
                }
              >
                <span className="review-comparison-label">NEW CANDIDATE</span>
                <ReviewCanvasImage key={current.renderId} item={current} />
              </span>
            </span>
          ) : (
            <ReviewCanvasImage key={current.renderId} item={current} />
          )}
        </div>
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
        {catalogOutcomeMode ? (
          <>
            <span>
              <kbd>D</kbd> DELETE
            </span>
            <span>
              <kbd>B</kbd> BOTH
            </span>
            <span>
              <kbd>N</kbd> NEW
            </span>
            <span>
              <kbd>R</kbd> REDO
            </span>
          </>
        ) : (
          <>
            <span>
              <kbd>K</kbd> KEEP
            </span>
            <span>
              <kbd>R</kbd> REJECT
            </span>
            <span>
              <kbd>D</kbd> DELETE QUEUE
            </span>
          </>
        )}
        <span>
          <kbd>⌘Z</kbd> UNDO
        </span>
        <span>
          <kbd>⌘⇧Z</kbd> REDO
        </span>
      </div>
      {message ? <div className="review-message">{message}</div> : null}
    </section>
  );
}
