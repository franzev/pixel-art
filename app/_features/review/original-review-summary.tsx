import type { RenderReview } from "../../review-types";
import { DECISION_LABELS } from "../archive/archive-config";

const reviewDateFormatter = new Intl.DateTimeFormat("en-PH", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Manila",
  timeZoneName: "short",
});

function formatReviewDate(value: string | null | undefined) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not recorded"
    : reviewDateFormatter.format(date);
}

function ratingLabel(value: number | null) {
  return value ? `${value} / 5` : "Not rated";
}

export function OriginalReviewSummary({
  originalName,
  review,
}: {
  originalName?: string;
  review?: RenderReview;
}) {
  const decisionLabel = review?.decision
    ? DECISION_LABELS[review.decision]
    : "Unreviewed";

  return (
    <section className="original-review-section">
      <details open>
        <summary>
          <span>
            <strong>ORIGINAL REVIEW</strong>
            {originalName ? <small>{originalName}</small> : null}
          </span>
          <span
            className="original-review-outcome"
            data-decision={review?.decision ?? "unreviewed"}
          >
            {decisionLabel} · {review?.overallRating ?? "—"} / 5
          </span>
        </summary>

        {review ? (
          <div className="original-review-content">
            <dl className="original-review-ratings">
              <div>
                <dt>Overall</dt>
                <dd>{ratingLabel(review.overallRating)}</dd>
              </div>
              <div>
                <dt>Concept</dt>
                <dd>{ratingLabel(review.conceptRating)}</dd>
              </div>
              <div>
                <dt>Execution</dt>
                <dd>{ratingLabel(review.executionRating)}</dd>
              </div>
              <div>
                <dt>Direction</dt>
                <dd>{ratingLabel(review.directionRating)}</dd>
              </div>
            </dl>

            <div className="original-review-block">
              <span>WHAT FAILED</span>
              {review.defects.length ? (
                <ul className="original-review-defects">
                  {review.defects.map((defect) => (
                    <li key={defect.key}>
                      <span>{defect.label}</span>
                      <strong data-severity={defect.severity}>
                        {defect.severity}
                      </strong>
                      {defect.note ? <p>{defect.note}</p> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>None recorded.</p>
              )}
            </div>

            <div className="original-review-block">
              <span>TAGS</span>
              {review.tags.length ? (
                <div className="original-review-tags">
                  {review.tags.map((tag) => (
                    <span key={tag.key} data-state={tag.state}>
                      {tag.label} · {tag.state}
                    </span>
                  ))}
                </div>
              ) : (
                <p>None recorded.</p>
              )}
            </div>

            <div className="original-review-block">
              <span>ORIGINAL NOTES</span>
              <p>{review.note.trim() || "None recorded."}</p>
            </div>

            <div className="original-review-block">
              <span>REQUESTED CORRECTION</span>
              <p>{review.correctionNote.trim() || "None recorded."}</p>
            </div>

            <dl className="original-review-provenance">
              <div>
                <dt>Original ID</dt>
                <dd className="original-review-render-id">
                  {review.renderId}
                </dd>
              </div>
              <div>
                <dt>Reviewed</dt>
                <dd>
                  <time dateTime={review.reviewedAt ?? undefined}>
                    {formatReviewDate(review.reviewedAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>
                  <time dateTime={review.updatedAt}>
                    {formatReviewDate(review.updatedAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Revision</dt>
                <dd>{review.revision}</dd>
              </div>
              <div>
                <dt>Deletion state</dt>
                <dd>{review.deletionState}</dd>
              </div>
              {review.duplicateOf ? (
                <div>
                  <dt>Duplicate of</dt>
                  <dd className="original-review-render-id">
                    {review.duplicateOf}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        ) : (
          <p className="original-review-empty">
            No saved review was found for this original.
          </p>
        )}
      </details>
    </section>
  );
}
