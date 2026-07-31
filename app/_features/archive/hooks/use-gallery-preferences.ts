"use client";

import { useEffect, useMemo, useState } from "react";
import type { GalleryItem } from "../../../review-types";
import {
  FAVORITES_STORAGE_KEY,
  TILE_SIZE_STORAGE_KEY,
} from "../archive-config";

export function useGalleryPreferences(items: GalleryItem[]) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tileSize, setTileSizeState] = useState(152);
  const favoriteIds = useMemo(() => new Set(favorites), [favorites]);

  useEffect(() => {
    try {
      const storedSize = Number(
        window.localStorage.getItem(TILE_SIZE_STORAGE_KEY),
      );
      const storedFavorites = JSON.parse(
        window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]",
      ) as unknown;
      const currentRenderIds = new Set(items.map((item) => item.renderId));
      // This is a device-local viewing preference loaded after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedSize >= 116 && storedSize <= 220) setTileSizeState(storedSize);
      if (Array.isArray(storedFavorites)) {
        const validFavorites = storedFavorites.filter(
          (value): value is string =>
            typeof value === "string" && currentRenderIds.has(value),
        );
        // Favorites are a device-local catalog preference.
        setFavorites(Array.from(new Set(validFavorites)));
      }
    } catch {
      // Browsing preferences are optional.
    }
  }, [items]);

  const toggleFavorite = (renderId: string) => {
    setFavorites((current) => {
      const next = current.includes(renderId)
        ? current.filter((value) => value !== renderId)
        : [...current, renderId];
      try {
        window.localStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(next),
        );
      } catch {
        // Browsing preferences are optional.
      }
      return next;
    });
  };

  const setTileSize = (size: number) => {
    setTileSizeState(size);
    try {
      window.localStorage.setItem(TILE_SIZE_STORAGE_KEY, String(size));
    } catch {
      // Browsing preferences are optional.
    }
  };

  return { favoriteIds, tileSize, toggleFavorite, setTileSize };
}
