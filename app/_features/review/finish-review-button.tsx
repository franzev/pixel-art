"use client";

export function FinishReviewButton({ onFinish }: { onFinish: () => void }) {
  return (
    <button className="finish-review" type="button" onClick={onFinish}>
      SAVE &amp; NEXT <kbd>ENTER</kbd>
    </button>
  );
}
