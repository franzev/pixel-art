"use client";

import { useMemo, useState } from "react";
import { ActionButton } from "../../_components/ui/action-button";
import { formatSavedTimestamp } from "../archive/saved-time";
import {
  renderGateAction,
  renderGateFailureSummary,
} from "./render-gate-presentation";
import {
  ALL_RENDER_GATE_ATTESTATIONS,
  EMPTY_RENDER_GATE_ATTESTATIONS,
  type RenderGateAttestations,
  type RenderGateDiagnostics,
  type RenderGateState,
} from "./use-render-gate";

const CONFIRMATIONS: Array<{
  key: keyof RenderGateAttestations;
  label: string;
}> = [
  { key: "sameCharacter", label: "Same character and identity" },
  { key: "intendedChangesOnly", label: "Only requested corrections changed" },
  {
    key: "anatomyAndEquipmentComplete",
    label: "Anatomy, hands, feet, and equipment are complete",
  },
  {
    key: "cleanPresentation",
    label: "Clean background, neutral color, and no unwanted effects",
  },
  {
    key: "rightFacing",
    label: "Front three-quarter view with a screen-right bias",
  },
];

const STATE_LABELS: Record<RenderGateState, string> = {
  unavailable: "UNAVAILABLE",
  loading: "CHECKING STATUS",
  not_checked: "NOT CHECKED",
  checking: "RUNNING CHECK",
  failed: "NEEDS CORRECTION",
  passed: "PASSED",
};

export function RenderGateControl({
  state,
  errors,
  passedAt,
  onComplete,
  onRetry,
}: {
  state: RenderGateState;
  errors: string[];
  passedAt?: string;
  diagnostics?: RenderGateDiagnostics;
  onComplete: (attestations: RenderGateAttestations) => Promise<void>;
  onRetry: () => Promise<void>;
}) {
  const [attestations, setAttestations] = useState(
    EMPTY_RENDER_GATE_ATTESTATIONS,
  );
  const allConfirmed = useMemo(
    () => Object.values(attestations).every(Boolean),
    [attestations],
  );
  const action = renderGateAction(state, allConfirmed);

  return (
    <section className="render-gate-section" data-state={state}>
      <div className="render-gate-heading">
        <span>QUALITY CHECK</span>
        <strong>{STATE_LABELS[state]}</strong>
      </div>

      {state === "passed" ? (
        <div className="render-gate-passed">
          <strong>Promotion unlocked</strong>
          <span>
            Objective checks and visual confirmations passed
            {passedAt ? ` · ${formatSavedTimestamp(passedAt)}` : ""}
          </span>
        </div>
      ) : state === "failed" ? (
        <p className="render-gate-failure" role="status">
          {renderGateFailureSummary(errors)} Request a corrected render below.
        </p>
      ) : state === "unavailable" ? (
        <div className="render-gate-unavailable">
          <strong>Local quality service is not connected</strong>
          <p>
            Start the gallery with <code>npm run dev</code>, then retry. Your
            review and candidate are unchanged.
          </p>
        </div>
      ) : (
        <>
          <div className="render-gate-guidance-row">
            <p className="render-gate-guidance">
              Compare the original and replacement, then confirm every item.
            </p>
            <ActionButton
              className="render-gate-check-all"
              variant="ghost"
              size="compact"
              disabled={action.kind !== "run" || allConfirmed}
              onClick={() =>
                setAttestations({ ...ALL_RENDER_GATE_ATTESTATIONS })
              }
            >
              {allConfirmed ? "ALL 5 CHECKED" : "CHECK ALL 5"}
            </ActionButton>
          </div>
          <div className="render-gate-checklist">
            {CONFIRMATIONS.map((confirmation) => (
              <label key={confirmation.key}>
                <input
                  type="checkbox"
                  checked={attestations[confirmation.key]}
                  disabled={action.kind === "none"}
                  onChange={(event) =>
                    setAttestations((current) => ({
                      ...current,
                      [confirmation.key]: event.target.checked,
                    }))
                  }
                />
                <span>{confirmation.label}</span>
              </label>
            ))}
          </div>
        </>
      )}

      {action.kind !== "none" ? (
        <button
          className="render-gate-run"
          type="button"
          disabled={action.disabled}
          onClick={() =>
            void (action.kind === "retry"
              ? onRetry()
              : onComplete(attestations))
          }
        >
          {action.label}
        </button>
      ) : action.label ? (
        <button className="render-gate-run" type="button" disabled>
          {action.label}
        </button>
      ) : null}
    </section>
  );
}
