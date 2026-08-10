"use client";

import type { AttemptItem, GalleryItem } from "../../../review-types";
import {
  formatSavedTimestamp,
  formatSavedTimestampCompact,
} from "../saved-time";
import { PreviewImage } from "./preview-image";

export type RenderTilePresentation = {
  title: string;
  meta: string;
  label: string;
};

function isAttemptItem(item: GalleryItem): item is AttemptItem {
  return "attempt" in item;
}

export function RenderTile({
  item,
  index,
  total,
  selected,
  eager,
  onOpen,
  presentation,
  reviewedAt,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  selected: boolean;
  eager: boolean;
  onOpen: (item: GalleryItem) => void;
  presentation?: RenderTilePresentation;
  reviewedAt?: string | null;
}) {
  const attempt = isAttemptItem(item) ? item : undefined;
  const title = presentation?.title ?? attempt?.concept ?? item.name;
  const attemptLabel = attempt
    ? attempt.sourceKind === "archive"
      ? `Attempt ${String(attempt.attempt).padStart(2, "0")}`
      : `Candidate v${String(attempt.attempt).padStart(2, "0")}`
    : "";

  return (
    <div
      className={selected ? "render-tile is-selected" : "render-tile"}
      role="listitem"
      aria-posinset={index + 1}
      aria-setsize={total}
      data-render-index={index}
    >
      <button
        type="button"
        className="render-tile-main"
        aria-pressed={selected}
        aria-label={
          attempt
            ? `Open ${title}, ${presentation?.label ?? attemptLabel}, ${item.collection}`
            : `Open ${title}, ${item.collection}`
        }
        onClick={() => onOpen(item)}
      >
        <div className="render-image">
          <span className="render-image-placeholder" aria-hidden="true" />
          <span className="render-number">
            {String(index + 1).padStart(3, "0")}
          </span>
          <PreviewImage item={item} alt="" eager={eager} />
        </div>
        <span className="render-title">{title}</span>
        <span className="render-meta">
          {presentation ? presentation.meta : null}
          {!presentation && attempt ? (
            <>
              {attemptLabel} ·{" "}
              <time
                dateTime={attempt.generatedAt}
                title={formatSavedTimestamp(attempt.generatedAt)}
              >
                Generated {formatSavedTimestampCompact(attempt.generatedAt)}
              </time>{" "}
              ·{" "}
            </>
          ) : null}
          {!presentation && !attempt ? (
            <>
              <time
                dateTime={item.generatedAt}
                title={formatSavedTimestamp(item.generatedAt)}
              >
                Generated {formatSavedTimestampCompact(item.generatedAt)}
              </time>{" "}
              ·{" "}
              {reviewedAt ? (
                <time
                  dateTime={reviewedAt}
                  title={formatSavedTimestamp(reviewedAt)}
                >
                  Reviewed {formatSavedTimestampCompact(reviewedAt)}
                </time>
              ) : (
                "Not reviewed"
              )}{" "}
              · {item.collection}
            </>
          ) : null}
          {!presentation && attempt
            ? `${item.collection} · ${item.width}×${item.height}`
            : null}
        </span>
      </button>
    </div>
  );
}
