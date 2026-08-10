"use client";

import type { ReviewDecision } from "../../review-types";
import type { RenderGateState } from "./use-render-gate";

export type CatalogOutcome = "original" | "both" | "new" | "redo";

const OUTCOMES: Array<{
  value: CatalogOutcome;
  label: string;
  detail: string;
  shortcut: string;
}> = [
  {
    value: "original",
    label: "Delete candidate",
    detail: "Remove candidate; keep original",
    shortcut: "D",
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
  renderGateState,
  onChooseOutcome,
}: {
  decision: ReviewDecision | null;
  pending: CatalogOutcome | null;
  error: string;
  renderGateState: RenderGateState;
  onChooseOutcome: (outcome: CatalogOutcome) => void;
}) {
  const gateMessage =
    renderGateState === "unavailable"
      ? "Keep both and Keep new are locked until the local quality service reconnects."
      : renderGateState === "failed"
        ? "This candidate failed the quality check. Delete candidate or Try another render remain available."
        : "Keep both and Keep new unlock after the quality check passes.";
  const redoLabel =
    renderGateState === "failed" ? "SEND BACK FOR REDO" : "TRY ANOTHER RENDER";

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
          const requiresQualityCheck =
            outcome.value === "both" || outcome.value === "new";
          return (
            <button
              key={outcome.value}
              type="button"
              className={active ? "is-active" : undefined}
              disabled={
                pending !== null ||
                (requiresQualityCheck && renderGateState !== "passed")
              }
              onClick={() => onChooseOutcome(outcome.value)}
              aria-pressed={active}
              aria-describedby={
                requiresQualityCheck && renderGateState !== "passed"
                  ? "catalog-outcome-gate-note"
                  : undefined
              }
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
      {renderGateState !== "passed" ? (
        <p id="catalog-outcome-gate-note" className="catalog-outcome-gate-note">
          {gateMessage}
        </p>
      ) : null}
      <button
        className="catalog-outcome-redo"
        type="button"
        disabled={pending !== null}
        onClick={() => onChooseOutcome("redo")}
      >
        <kbd>R</kbd>
        <span>{redoLabel}</span>
      </button>
      {error ? (
        <p className="catalog-outcome-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
