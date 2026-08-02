"use client";

import type { ReviewDecision } from "../../review-types";

export type CatalogOutcome = "original" | "both" | "new" | "redo";

const OUTCOMES: Array<{
  value: CatalogOutcome;
  label: string;
  detail: string;
  shortcut: string;
}> = [
  {
    value: "original",
    label: "Keep original",
    detail: "Discard this candidate",
    shortcut: "O",
  },
  {
    value: "both",
    label: "Keep both",
    detail: "Add candidate as a variant",
    shortcut: "B",
  },
  {
    value: "new",
    label: "Keep new",
    detail: "Replace the original",
    shortcut: "N",
  },
];

export function CatalogOutcomeControl({
  decision,
  pending,
  error,
  onChooseOutcome,
}: {
  decision: ReviewDecision | null;
  pending: CatalogOutcome | null;
  error: string;
  onChooseOutcome: (outcome: CatalogOutcome) => void;
}) {
  return (
    <section className="decision-section catalog-outcome-section">
      <div className="review-section-heading">
        <span>CATALOG OUTCOME</span>
        {pending ? <strong>WORKING…</strong> : null}
      </div>
      <div className="catalog-outcome-grid">
        {OUTCOMES.map((outcome) => {
          const active =
            (outcome.value === "original" && decision === "delete") ||
            ((outcome.value === "both" || outcome.value === "new") &&
              decision === "keep");
          return (
            <button
              key={outcome.value}
              type="button"
              className={active ? "is-active" : undefined}
              disabled={pending !== null}
              onClick={() => onChooseOutcome(outcome.value)}
              aria-pressed={active}
            >
              <kbd>{outcome.shortcut}</kbd>
              <span>
                <strong>{outcome.label}</strong>
                <small>{outcome.detail}</small>
              </span>
            </button>
          );
        })}
      </div>
      <button
        className="catalog-outcome-redo"
        type="button"
        disabled={pending !== null}
        onClick={() => onChooseOutcome("redo")}
      >
        <kbd>R</kbd>
        <span>TRY ANOTHER RENDER</span>
      </button>
      {error ? (
        <p className="catalog-outcome-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
