"use client";

import type { GalleryItem } from "../../../review-types";
import { PreviewImage } from "./preview-image";

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
        aria-label={`Open ${item.name}, ${item.collection}`}
        onClick={() => onOpen(item)}
      >
        <div className="render-image">
          <span className="render-image-placeholder" aria-hidden="true" />
          <span className="render-number">
            {String(index + 1).padStart(3, "0")}
          </span>
          <PreviewImage item={item} alt="" eager={eager} />
        </div>
        <span className="render-title">{item.name}</span>
        <span className="render-meta">
          {item.collection} · {item.width}×{item.height}
        </span>
      </button>
    </div>
  );
}
