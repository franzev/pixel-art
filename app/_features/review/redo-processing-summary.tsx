import type { AttemptItem, RenderReview } from "../../review-types";
import { formatSavedTimestamp } from "../archive/saved-time";
import type { RedoProcessingStatus } from "./redo-processing-status";

function replacementReviewLabel(review?: RenderReview) {
  if (!review?.decision) return "Not reviewed";
  if (review.decision === "keep") return "Kept";
  if (review.decision === "reject") return "Redo again";
  return "Marked for deletion";
}

export function RedoProcessingSummary({
  status,
  latestReview,
  onOpenCandidate,
}: {
  status: RedoProcessingStatus;
  latestReview?: RenderReview;
  onOpenCandidate?: (candidate: AttemptItem) => void;
}) {
  const latest = status.latestCandidate;
  const processed = status.state === "processed" && latest;

  return (
    <section className="redo-processing-section" data-state={status.state}>
      <div className="redo-processing-heading">
        <span>REDO STATUS</span>
        <strong>{processed ? "PROCESSED" : "WAITING"}</strong>
      </div>

      {processed ? (
        <>
          <div className="redo-processing-result">
            <strong>Replacement generated</strong>
            <span>
              {status.candidates.length} saved version
              {status.candidates.length === 1 ? "" : "s"}
            </span>
          </div>
          <dl className="redo-processing-details">
            <div>
              <dt>Latest generated</dt>
              <dd>
                <time dateTime={latest.generatedAt}>
                  {formatSavedTimestamp(latest.generatedAt)}
                </time>
              </dd>
            </div>
            <div>
              <dt>Replacement review</dt>
              <dd>{replacementReviewLabel(latestReview)}</dd>
            </div>
          </dl>
          {onOpenCandidate ? (
            <button
              className="redo-processing-open"
              type="button"
              onClick={() => onOpenCandidate(latest)}
            >
              OPEN LATEST REPLACEMENT <span aria-hidden="true">→</span>
            </button>
          ) : null}
          <p className="redo-processing-note">
            The original stays marked Redo as review history.
          </p>
        </>
      ) : (
        <>
          <div className="redo-processing-result">
            <strong>Awaiting generation</strong>
            <span>No replacement has been saved after this decision.</span>
          </div>
          <p className="redo-processing-note">
            Requested {formatSavedTimestamp(status.requestedAt)}
          </p>
        </>
      )}
    </section>
  );
}
