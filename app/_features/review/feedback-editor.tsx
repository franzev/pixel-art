"use client";

import type { RefObject } from "react";

export function FeedbackEditor({
  noteDraft,
  onNoteDraftChange,
  correctionDraft,
  onCorrectionDraftChange,
  onBlurSave,
  noteRef,
}: {
  noteDraft: string;
  onNoteDraftChange: (value: string) => void;
  correctionDraft: string;
  onCorrectionDraftChange: (value: string) => void;
  onBlurSave: () => void;
  noteRef: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <section className="feedback-section">
      <label>
        <span>FEEDBACK</span>
        <textarea
          ref={noteRef as RefObject<HTMLTextAreaElement>}
          value={noteDraft}
          onChange={(event) => onNoteDraftChange(event.target.value)}
          onBlur={onBlurSave}
          placeholder="What do you like or dislike?"
          rows={3}
        />
      </label>
      <label>
        <span>NEXT ATTEMPT</span>
        <textarea
          value={correctionDraft}
          onChange={(event) => onCorrectionDraftChange(event.target.value)}
          onBlur={onBlurSave}
          placeholder="Preserve… Change…"
          rows={3}
        />
      </label>
    </section>
  );
}
