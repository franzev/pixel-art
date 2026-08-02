"use client";

import type { RefObject } from "react";

export function FeedbackEditor({
  feedbackDraft,
  onFeedbackDraftChange,
  onBlurSave,
  noteRef,
}: {
  feedbackDraft: string;
  onFeedbackDraftChange: (value: string) => void;
  onBlurSave: () => void;
  noteRef: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <section className="feedback-section">
      <label>
        <span>REVIEW NOTES</span>
        <textarea
          ref={noteRef as RefObject<HTMLTextAreaElement>}
          value={feedbackDraft}
          onChange={(event) => onFeedbackDraftChange(event.target.value)}
          onBlur={onBlurSave}
          placeholder="What works, what does not, and what should change next?"
          rows={5}
        />
      </label>
    </section>
  );
}
