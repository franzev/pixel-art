"use client";

import type { ReviewTag } from "../../review-types";

export function SuggestedTagsControl({
  tags,
  onCycleTag,
}: {
  tags: ReviewTag[];
  onCycleTag: (key: string) => void;
}) {
  return (
    <section className="tag-section">
      <div className="review-section-heading">
        <span>SUGGESTED TAGS</span>
        <small>CLICK: CONFIRM → REJECT → RESET</small>
      </div>
      <div className="review-tags">
        {tags.map((tag) => (
          <button
            key={tag.key}
            type="button"
            data-state={tag.state}
            onClick={() => onCycleTag(tag.key)}
            title={`${tag.source} · ${Math.round(tag.confidence * 100)}% confidence`}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </section>
  );
}
