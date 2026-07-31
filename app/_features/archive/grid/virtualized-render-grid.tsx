"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GalleryItem } from "../../../review-types";
import { GRID_GAP, TILE_CHROME_HEIGHT } from "../archive-config";
import { RenderTile } from "./render-tile";

export function VirtualizedRenderGrid({
  items,
  selectedId,
  tileSize,
  scrollElement,
  resetKey,
  onOpen,
}: {
  items: GalleryItem[];
  selectedId?: string;
  tileSize: number;
  scrollElement: HTMLDivElement | null;
  resetKey: string;
  onOpen: (item: GalleryItem) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [scrollMargin, setScrollMargin] = useState(0);
  const anchorRenderIdRef = useRef(items[0]?.renderId);
  const previousTileSizeRef = useRef(tileSize);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      setGridWidth(grid.clientWidth);
      setScrollMargin(grid.offsetTop);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    // Viewport resizes (tablet rotation, window drags across the layout
    // breakpoint) can outrun the element observer; listen to both.
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const columnCount = Math.max(
    1,
    Math.floor((gridWidth + GRID_GAP) / (tileSize + GRID_GAP)),
  );
  const tileWidth =
    gridWidth > 0
      ? (gridWidth - GRID_GAP * (columnCount - 1)) / columnCount
      : tileSize;
  const rowCount = Math.ceil(items.length / columnCount);

  // TanStack Virtual intentionally exposes mutable measurement helpers.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollElement,
    estimateSize: () => tileWidth + TILE_CHROME_HEIGHT,
    gap: GRID_GAP,
    overscan: 3,
    scrollMargin,
    // Defer row measurements out of ResizeObserver's delivery cycle. The
    // virtual rows update layout in response to those measurements, which can
    // otherwise make Chromium report an undelivered-notifications loop.
    useAnimationFrameWithResizeObserver: true,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const firstRow = virtualRows[0]?.index ?? 0;
    anchorRenderIdRef.current =
      items[firstRow * columnCount]?.renderId ?? items[0]?.renderId;
  }, [columnCount, items, virtualRows]);

  useLayoutEffect(() => {
    // Re-measure whenever the tile geometry changes, including container
    // resizes (gridWidth) — rotating a tablet across the layout breakpoint
    // otherwise leaves rows positioned with stale estimates.
    rowVirtualizer.measure();
    if (previousTileSizeRef.current === tileSize) return;

    const anchorIndex = items.findIndex(
      (item) => item.renderId === anchorRenderIdRef.current,
    );
    if (anchorIndex >= 0) {
      rowVirtualizer.scrollToIndex(Math.floor(anchorIndex / columnCount), {
        align: "start",
      });
    }
    previousTileSizeRef.current = tileSize;
  }, [columnCount, gridWidth, items, rowVirtualizer, tileSize]);

  useEffect(() => {
    rowVirtualizer.scrollToOffset(0);
  }, [resetKey, rowVirtualizer]);

  const trackedSelectedIdRef = useRef(selectedId);
  useEffect(() => {
    // Keep the selection in view as it moves, but let the page arrive at the
    // top: the count heading is the first thing worth seeing. Layout churn
    // (column count settling, remeasures) must not re-trigger the scroll, so
    // only an actual selection change counts.
    if (!selectedId || trackedSelectedIdRef.current === selectedId) return;
    trackedSelectedIdRef.current = selectedId;
    const selectedIndex = items.findIndex((item) => item.id === selectedId);
    if (selectedIndex >= 0) {
      rowVirtualizer.scrollToIndex(Math.floor(selectedIndex / columnCount), {
        align: "auto",
      });
    }
  }, [columnCount, items, rowVirtualizer, selectedId]);

  return (
    <div
      ref={gridRef}
      id="render-grid"
      className="virtual-render-grid"
      role="list"
      aria-label="Render contact sheet"
      style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
    >
      {virtualRows.map((virtualRow) => {
        const rowStart = virtualRow.index * columnCount;
        const rowItems = items.slice(rowStart, rowStart + columnCount);
        return (
          <div
            key={virtualRow.key}
            ref={rowVirtualizer.measureElement}
            className="virtual-render-row"
            data-row-index={virtualRow.index}
            data-index={virtualRow.index}
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              transform: `translateY(${
                virtualRow.start - scrollMargin
              }px)`,
            }}
          >
            {rowItems.map((item, offset) => {
              const index = rowStart + offset;
              return (
                <RenderTile
                  key={item.id}
                  item={item}
                  index={index}
                  total={items.length}
                  selected={selectedId === item.id}
                  eager={index < 12}
                  onOpen={onOpen}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
