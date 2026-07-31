"use client";

export function RatingControl({
  overallRating,
  onSetRating,
}: {
  overallRating: number | null;
  onSetRating: (rating: number) => void;
}) {
  return (
    <section className="rating-section">
      <div className="review-section-heading">
        <span>OVERALL RATING</span>
        <strong>{overallRating ?? "—"} / 5</strong>
      </div>
      <div className="rating-buttons">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            className={overallRating === rating ? "is-active" : undefined}
            onClick={() => onSetRating(rating)}
            aria-pressed={overallRating === rating}
          >
            <kbd>{rating}</kbd>
            <span>
              {rating === 1 ? "Reject" : rating === 5 ? "Anchor" : ""}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
