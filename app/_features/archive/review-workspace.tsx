"use client";

import { ActionButton } from "../../_components/ui/action-button";
import type { ReviewProgress } from "./review-summary";

function ReviewQueueAction({
  title,
  description,
  count,
  action,
  onOpen,
}: {
  title: string;
  description: string;
  count: number;
  action: string;
  onOpen: () => void;
}) {
  return (
    <ActionButton
      className="review-queue-action"
      variant="secondary"
      onClick={onOpen}
      disabled={!count}
    >
      <span className="review-queue-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span className="review-queue-count">{count}</span>
      <span className="review-queue-verb">{count ? action : "CLEAR"}</span>
    </ActionButton>
  );
}

export function ReviewWorkspace({
  progress,
  onOpenNewCandidates,
  onOpenRedoSources,
  onOpenWaitingForReplacement,
  onOpenDeletionQueue,
}: {
  progress: ReviewProgress;
  onOpenNewCandidates: () => void;
  onOpenRedoSources: () => void;
  onOpenWaitingForReplacement: () => void;
  onOpenDeletionQueue: () => void;
}) {
  const totalDecisions =
    progress.saved.keep + progress.saved.redo + progress.saved.delete;

  return (
    <main className="review-hub" id="review-workspace">
      <header className="review-hub-header">
        <div>
          <span className="eyebrow">REVIEW WORKSPACE</span>
          <h2>Choose the next queue</h2>
        </div>
        <p>{totalDecisions} decisions saved</p>
      </header>

      <section className="review-queue-list" aria-label="Review queues">
        <ReviewQueueAction
          title="New candidates"
          description="Generated outputs that still need a decision."
          count={progress.queue.generatedOutputsAwaitingReview}
          action="START REVIEW"
          onOpen={onOpenNewCandidates}
        />
        <ReviewQueueAction
          title="Needs redo"
          description="Catalog originals marked for replacement."
          count={progress.queue.redoSourcesAvailable}
          action="OPEN QUEUE"
          onOpen={onOpenRedoSources}
        />
        <ReviewQueueAction
          title="Waiting for replacement"
          description="Redo requests without a generated replacement."
          count={progress.queue.redoSourcesAwaitingGenerationAvailable}
          action="OPEN QUEUE"
          onOpen={onOpenWaitingForReplacement}
        />
        <ReviewQueueAction
          title="Marked for deletion"
          description="Catalog removals waiting to be applied."
          count={progress.queue.deletionAwaitingApplication}
          action="OPEN QUEUE"
          onOpen={onOpenDeletionQueue}
        />
      </section>

      <dl className="review-ledger" aria-label="Review ledger">
        <div>
          <dt>Kept</dt>
          <dd>{progress.saved.keep}</dd>
        </div>
        <div>
          <dt>Redo decisions</dt>
          <dd>{progress.saved.redo}</dd>
        </div>
        <div>
          <dt>Delete decisions</dt>
          <dd>{progress.saved.delete}</dd>
        </div>
      </dl>
    </main>
  );
}
