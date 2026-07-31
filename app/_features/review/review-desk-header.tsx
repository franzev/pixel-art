"use client";

import { QUEUE_LABELS, SYNC_LABELS } from "./review-config";
import type { ReviewQueue } from "./review-queue";

export function ReviewDeskHeader({
  currentName,
  queue,
  queueCounts,
  onQueueChange,
  currentIndex,
  queueItemsLength,
  syncState,
  onClose,
}: {
  currentName: string;
  queue: ReviewQueue;
  queueCounts: Record<ReviewQueue, number>;
  onQueueChange: (queue: ReviewQueue) => void;
  currentIndex: number;
  queueItemsLength: number;
  syncState: keyof typeof SYNC_LABELS;
  onClose: () => void;
}) {
  return (
    <header className="review-topbar">
      <div className="review-title">
        <span>REVIEW DESK</span>
        <strong>{currentName}</strong>
      </div>
      <label className="review-queue-picker">
        <span className="sr-only">Review queue</span>
        <select
          value={queue}
          onChange={(event) => onQueueChange(event.target.value as ReviewQueue)}
        >
          {(Object.keys(QUEUE_LABELS) as ReviewQueue[]).map((key) => (
            <option key={key} value={key}>
              {QUEUE_LABELS[key]} · {queueCounts[key]}
            </option>
          ))}
        </select>
      </label>
      <div className="review-progress">
        <span>
          {Math.max(currentIndex + 1, 1)} / {queueItemsLength}
        </span>
        <small data-sync={syncState}>{SYNC_LABELS[syncState]}</small>
      </div>
      <button className="review-close" type="button" onClick={onClose}>
        CLOSE <kbd>ESC</kbd>
      </button>
    </header>
  );
}
