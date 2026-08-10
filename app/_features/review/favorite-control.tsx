export function FavoriteControl({
  name,
  isFavorite,
  onToggle,
}: {
  name: string;
  isFavorite: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="review-favorite-section">
      <button
        className={
          isFavorite
            ? "review-favorite-control is-active"
            : "review-favorite-control"
        }
        type="button"
        onClick={onToggle}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `Remove ${name} from favorites`
            : `Add ${name} to favorites`
        }
      >
        <span className="review-favorite-star" aria-hidden="true">
          {isFavorite ? "★" : "☆"}
        </span>
        <span className="review-favorite-copy">
          <strong>{isFavorite ? "FAVORITED" : "ADD TO FAVORITES"}</strong>
          <small>Private collection tag, separate from rating</small>
        </span>
        <span className="review-favorite-state" aria-hidden="true">
          {isFavorite ? "ADDED" : "ADD"}
        </span>
      </button>
    </section>
  );
}
