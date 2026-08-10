"use client";

import type { RefObject } from "react";
import { AutoHideScrollArea } from "../../_components/ui/auto-hide-scroll-area";
import type { AttemptItem, RenderReview } from "../../review-types";
import { AttemptInspector } from "./attempt-inspector";

export function MobileAttemptViewer({
  viewerRef,
  item,
  seriesItems,
  onSelectAttempt,
  onPrevious,
  onNext,
  review,
  onReview,
  onClose,
}: {
  viewerRef: RefObject<HTMLDialogElement | null>;
  item?: AttemptItem;
  seriesItems?: AttemptItem[];
  onSelectAttempt?: (item: AttemptItem) => void;
  onPrevious: () => void;
  onNext: () => void;
  review?: RenderReview;
  onReview?: () => void;
  onClose: () => void;
}) {
  return (
    <dialog
      className="mobile-viewer"
      ref={viewerRef as RefObject<HTMLDialogElement>}
      aria-label="Attempt viewer"
    >
      <AutoHideScrollArea className="mobile-viewer-scroll">
        <AttemptInspector
          compact
          item={item}
          seriesItems={seriesItems}
          onSelectAttempt={onSelectAttempt}
          onPrevious={onPrevious}
          onNext={onNext}
          review={review}
          onReview={onReview}
          onClose={onClose}
        />
      </AutoHideScrollArea>
    </dialog>
  );
}
