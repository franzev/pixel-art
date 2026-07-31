"use client";

import type { RefObject } from "react";
import { AutoHideScrollArea } from "../../_components/ui/auto-hide-scroll-area";
import type { GalleryItem, RenderReview } from "../../review-types";
import { RenderInspector } from "./render-inspector";

export function MobileRenderViewer({
  viewerRef,
  item,
  review,
  isFavorite,
  onPrevious,
  onNext,
  onToggleFavorite,
  onEdit,
  onClose,
}: {
  viewerRef: RefObject<HTMLDialogElement | null>;
  item?: GalleryItem;
  review?: RenderReview;
  isFavorite: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFavorite?: () => void;
  onEdit?: () => void;
  onClose: () => void;
}) {
  return (
    <dialog
      className="mobile-viewer"
      ref={viewerRef as RefObject<HTMLDialogElement>}
      aria-label="Render viewer"
    >
      <AutoHideScrollArea className="mobile-viewer-scroll">
        <RenderInspector
          compact
          item={item}
          review={review}
          isFavorite={isFavorite}
          onPrevious={onPrevious}
          onNext={onNext}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onClose={onClose}
        />
      </AutoHideScrollArea>
    </dialog>
  );
}
