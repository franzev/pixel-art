"use client";

import type { AttemptItem, GalleryItem } from "../../../review-types";
import {
  formatSavedTimestamp,
  formatSavedTimestampCompact,
} from "../saved-time";
import { PreviewImage } from "./preview-image";

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
}: {
  item: GalleryItem;
  index: number;
  total: number;
  selected: boolean;
  eager: boolean;
  onOpen: (item: GalleryItem) => void;
}) {
  const attempt = isAttemptItem(item) ? item : undefined;
  const title = attempt?.concept ?? item.name;
  const attemptLabel = attempt
    ? attempt.sourceKind === "archive"
      ? `Attempt ${String(attempt.attempt).padStart(2, "0")}`
      : `Successful v${String(attempt.attempt).padStart(2, "0")}`
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
            ? `Open ${title}, ${attemptLabel}, ${item.collection}`
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
          {attempt ? (
            <>
              {attemptLabel} ·{" "}
              <time
                dateTime={attempt.generatedAt}
                title={formatSavedTimestamp(attempt.generatedAt)}
              >
                Saved {formatSavedTimestampCompact(attempt.generatedAt)}
              </time>{" "}
              ·{" "}
            </>
          ) : null}
          {item.collection} · {item.width}×{item.height}
        </span>
      </button>
    </div>
  );
}
