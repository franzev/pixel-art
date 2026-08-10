"use client";

import { useEffect, useState } from "react";
import type { GalleryItem } from "../../../review-types";
import type { RenderTilePresentation } from "./render-tile";
import { InitialRenderGrid } from "./initial-render-grid";
import { VirtualizedRenderGrid } from "./virtualized-render-grid";

export function RenderGrid({
  items,
  selectedId,
  tileSize,
  scrollElement,
  resetKey,
  onOpen,
  presentationById,
  reviewedAtByRenderId,
}: {
  items: GalleryItem[];
  selectedId?: string;
  tileSize: number;
  scrollElement: HTMLDivElement | null;
  resetKey: string;
  onOpen: (item: GalleryItem) => void;
  presentationById?: ReadonlyMap<string, RenderTilePresentation>;
  reviewedAtByRenderId?: ReadonlyMap<string, string | null>;
}) {
  const [gridVirtualized, setGridVirtualized] = useState(false);

  useEffect(() => {
    // Match the server's 24-card contact sheet for hydration, then window it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGridVirtualized(true);
  }, []);

  return gridVirtualized ? (
    <VirtualizedRenderGrid
      items={items}
      selectedId={selectedId}
      tileSize={tileSize}
      scrollElement={scrollElement}
      resetKey={resetKey}
      onOpen={onOpen}
      presentationById={presentationById}
      reviewedAtByRenderId={reviewedAtByRenderId}
    />
  ) : (
    <InitialRenderGrid
      items={items}
      selectedId={selectedId}
      tileSize={tileSize}
      onOpen={onOpen}
      presentationById={presentationById}
      reviewedAtByRenderId={reviewedAtByRenderId}
    />
  );
}
