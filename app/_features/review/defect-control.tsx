"use client";

import type { ReviewDefect } from "../../review-types";
import { DEFECTS, type DefectOption } from "./review-config";

export function DefectControl({
  defects,
  onToggleDefect,
  onCycleSeverity,
}: {
  defects: ReviewDefect[];
  onToggleDefect: (option: DefectOption) => void;
  onCycleSeverity: (defect: ReviewDefect) => void;
}) {
  return (
    <section className="defect-section">
      <div className="review-section-heading">
        <span>WHAT FAILED?</span>
        <small>SELECT ALL THAT APPLY</small>
      </div>
      <div className="defect-list">
        {DEFECTS.map((option) => {
          const selected = defects.find(
            (defect) => defect.key === option.key,
          );
          return (
            <div
              key={option.key}
              className={selected ? "is-selected" : undefined}
            >
              <button
                type="button"
                onClick={() => onToggleDefect(option)}
                aria-pressed={Boolean(selected)}
              >
                <kbd>{option.shortcut}</kbd>
                <span>{option.label}</span>
              </button>
              {selected ? (
                <button
                  className="severity-button"
                  type="button"
                  data-severity={selected.severity}
                  onClick={() => onCycleSeverity(selected)}
                  aria-label={`Change ${option.label} severity`}
                >
                  {selected.severity}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
