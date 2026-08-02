import type { ReviewProgress } from "./review-summary";

export function ReviewProgressSummary({
  progress,
  onShowRedoSources,
  onShowGeneratedOutputs,
}: {
  progress: ReviewProgress;
  onShowRedoSources: () => void;
  onShowGeneratedOutputs: () => void;
}) {
  return (
    <section className="review-work-overview" aria-labelledby="review-work-title">
      <header>
        <h4 id="review-work-title">Review work</h4>
        <span>
          {progress.saved.redo + progress.saved.delete + progress.saved.keep}{" "}
          decisions saved
        </span>
      </header>

      <div className="review-work-list">
        <button type="button" onClick={onShowRedoSources}>
          <span className="review-work-copy">
            <strong>Redo originals</strong>
            <small>
              {progress.queue.redoSourcesRegenerated} regenerated ·{" "}
              {progress.queue.redoAwaitingGeneration} awaiting generation
            </small>
            <small>
              {progress.saved.redo} Redo decisions saved ·{" "}
              {progress.queue.redoSourcesUnavailable} originals unavailable
            </small>
          </span>
          <span className="review-work-count is-actionable">
            <strong>{progress.queue.redoSourcesAvailable}</strong>
            <small>available</small>
          </span>
        </button>

        <button type="button" onClick={onShowGeneratedOutputs}>
          <span className="review-work-copy">
            <strong>Candidates to review</strong>
            <small>
              {progress.queue.generatedOutputsAvailable} latest generated outputs
            </small>
          </span>
          <span className="review-work-count is-actionable">
            <strong>{progress.queue.generatedOutputsAwaitingReview}</strong>
            <small>to review</small>
          </span>
        </button>
      </div>

      <dl className="review-ledger-summary">
        <div>
          <dt>Kept</dt>
          <dd>{progress.saved.keep}</dd>
        </div>
        <div>
          <dt>Marked for delete</dt>
          <dd>{progress.saved.delete}</dd>
        </div>
        <div>
          <dt>Delete actions remaining</dt>
          <dd>{progress.queue.deletionAwaitingApplication}</dd>
        </div>
      </dl>
    </section>
  );
}
