"use client";

import type { CSSProperties } from "react";
import type { GalleryItem } from "../../../review-types";
import { INITIAL_RENDER_COUNT } from "../archive-config";
import { RenderTile, type RenderTilePresentation } from "./render-tile";

export function InitialRenderGrid({
  items,
  selectedId,
  tileSize,
  onOpen,
  presentationById,
  reviewedAtByRenderId,
}: {
  items: GalleryItem[];
  selectedId?: string;
  tileSize: number;
  onOpen: (item: GalleryItem) => void;
  presentationById?: ReadonlyMap<string, RenderTilePresentation>;
  reviewedAtByRenderId?: ReadonlyMap<string, string | null>;
}) {
  return (
    <div
      id="render-grid"
      className="render-grid"
      role="list"
      aria-label="Render contact sheet"
      style={{ "--tile-size": `${tileSize}px` } as CSSProperties}
    >
      {items.slice(0, INITIAL_RENDER_COUNT).map((item, index) => (
        <RenderTile
          key={item.id}
          item={item}
          index={index}
          total={items.length}
          selected={selectedId === item.id}
          eager={index < 12}
          onOpen={onOpen}
          presentation={presentationById?.get(item.id)}
          reviewedAt={reviewedAtByRenderId?.get(item.renderId)}
        />
      ))}
    </div>
  );
}
