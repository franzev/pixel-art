"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";
import type { GalleryItem } from "../../review-types";

export function ReviewCanvasImage({ item }: { item: GalleryItem }) {
  const [originalLoaded, setOriginalLoaded] = useState(false);

  return (
    <span
      className="review-image-stack"
      data-original-loaded={originalLoaded ? "true" : "false"}
      style={
        {
          "--review-aspect-ratio": `${item.width} / ${item.height}`,
        } as CSSProperties
      }
    >
      <Image
        className="review-canvas-preview"
        src={item.url}
        alt=""
        fill
        sizes="(max-width: 760px) 92vw, 760px"
        quality={82}
        // vinext fill images default to inline `object-fit: cover`; the
        // review canvas must never crop the render.
        style={{ objectFit: "contain" }}
      />
      {/* The review surface must load the exact source PNG, not a transform. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="review-canvas-original"
        src={item.url}
        alt={item.name}
        decoding="async"
        onLoad={() => setOriginalLoaded(true)}
      />
      <span className="review-image-loading" aria-live="polite">
        Loading full resolution
      </span>
    </span>
  );
}
