"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryItem } from "../../../review-types";
import { GRID_PREVIEW_SIZES } from "../archive-config";

export function PreviewImage({
  item,
  alt,
  eager = false,
  inspector = false,
}: {
  item: GalleryItem;
  alt: string;
  eager?: boolean;
  inspector?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      className={loaded ? "responsive-preview is-loaded" : "responsive-preview"}
      src={item.url}
      alt={alt}
      fill
      sizes={
        inspector
          ? "(max-width: 760px) calc(100vw - 24px), 296px"
          : GRID_PREVIEW_SIZES
      }
      quality={82}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      // vinext's fill images ship inline `object-fit: cover`, which crops
      // portrait renders and outranks any stylesheet rule. The whole render
      // must always be visible, so contain has to be inline too.
      style={{ objectFit: "contain" }}
      onLoad={() => setLoaded(true)}
    />
  );
}
