"use client";

import type { ReviewDecision } from "../../review-types";
import { DECISIONS } from "./review-config";

export function DecisionControl({
  decision,
  onChooseDecision,
}: {
  decision: ReviewDecision | null;
  onChooseDecision: (decision: ReviewDecision) => void;
}) {
  return (
    <section className="decision-section">
      <div className="review-section-heading">
        <span>DECISION</span>
        {decision ? <strong>{decision.toLocaleUpperCase()}</strong> : null}
      </div>
      <div className="decision-grid">
        {DECISIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={decision === option.value ? "is-active" : undefined}
            onClick={() => onChooseDecision(option.value)}
            aria-pressed={decision === option.value}
          >
            <kbd>{option.shortcut}</kbd>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
