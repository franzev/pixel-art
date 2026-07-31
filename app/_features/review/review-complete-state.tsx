"use client";

export function ReviewCompleteState({
  onClose,
  onReviewAll,
}: {
  onClose: () => void;
  onReviewAll: () => void;
}) {
  return (
    <div className="review-desk" role="dialog" aria-modal="true">
      <header className="review-topbar">
        <strong>REVIEW DESK</strong>
        <button type="button" onClick={onClose}>
          CLOSE <kbd>ESC</kbd>
        </button>
      </header>
      <div className="review-complete">
        <span>QUEUE COMPLETE</span>
        <h2>No renders need attention here.</h2>
        <p>
          Choose another queue or return to the contact sheet. New renders
          will appear in Unreviewed after the local index refreshes.
        </p>
        <div>
          <button type="button" onClick={onReviewAll}>
            REVIEW ALL
          </button>
          <button type="button" onClick={onClose}>
            RETURN TO GALLERY
          </button>
        </div>
      </div>
    </div>
  );
}
