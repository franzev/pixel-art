"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AttemptItem,
  GalleryItem,
  RenderReview,
} from "../../review-types";
import type {
  RenderGateDiagnostics,
  RenderGateState,
} from "./render-gate-presentation";

export type { RenderGateDiagnostics, RenderGateState };

export type RenderGateAttestations = {
  sameCharacter: boolean;
  intendedChangesOnly: boolean;
  anatomyAndEquipmentComplete: boolean;
  cleanPresentation: boolean;
  rightFacing: boolean;
};

export const EMPTY_RENDER_GATE_ATTESTATIONS: RenderGateAttestations = {
  sameCharacter: false,
  intendedChangesOnly: false,
  anatomyAndEquipmentComplete: false,
  cleanPresentation: false,
  rightFacing: false,
};

export const ALL_RENDER_GATE_ATTESTATIONS: RenderGateAttestations = {
  sameCharacter: true,
  intendedChangesOnly: true,
  anatomyAndEquipmentComplete: true,
  cleanPresentation: true,
  rightFacing: true,
};

type RenderGateResponse = {
  state: "not_checked" | "failed" | "passed";
  errors: string[];
  passedAt?: string;
  diagnostics?: RenderGateDiagnostics;
};

const renderGateOrigin = "http://127.0.0.1:3010";

function authorizedChanges(review?: RenderReview) {
  const changes = [
    review?.correctionNote.trim(),
    ...(review?.defects ?? []).map((defect) =>
      defect.note?.trim()
        ? `${defect.label}: ${defect.note.trim()}`
        : defect.label,
    ),
  ].filter((value): value is string => Boolean(value));
  return changes.length ? changes : ["Address the saved review feedback"];
}

export function useRenderGate({
  candidate,
  original,
  originalReview,
}: {
  candidate?: AttemptItem;
  original?: GalleryItem;
  originalReview?: RenderReview;
}) {
  const [state, setState] = useState<RenderGateState>("unavailable");
  const [errors, setErrors] = useState<string[]>([]);
  const [passedAt, setPassedAt] = useState<string>();
  const [diagnostics, setDiagnostics] = useState<RenderGateDiagnostics>();

  const request = useMemo(() => {
    if (!candidate || !original) return null;
    return {
      candidatePath: candidate.sourcePath,
      sourcePath: original.id,
      sourceRenderId: original.renderId,
      authorizedChanges: authorizedChanges(originalReview),
      humanoid: true,
    };
  }, [candidate, original, originalReview]);

  const call = useCallback(
    async (
      endpoint: "status" | "complete",
      attestations?: RenderGateAttestations,
    ) => {
      if (!request) return null;
      const response = await fetch(
        `${renderGateOrigin}/render-gate/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...request, attestations }),
        },
      );
      const result = (await response.json()) as RenderGateResponse & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(result.error || "Quality check could not run.");
      }
      return result;
    },
    [request],
  );

  useEffect(() => {
    let active = true;
    if (!request) return;
    void Promise.resolve()
      .then(() => {
        if (!active) return null;
        setState("loading");
        setErrors([]);
        setPassedAt(undefined);
        setDiagnostics(undefined);
        return call("status");
      })
      .then((result) => {
        if (!active || !result) return;
        setState(result.state);
        setErrors(result.errors ?? []);
        setPassedAt(result.passedAt);
        setDiagnostics(result.diagnostics);
      })
      .catch((error) => {
        if (!active) return;
        setState("unavailable");
        setErrors([
          error instanceof Error
            ? error.message
            : "The local quality-check service is unavailable.",
        ]);
      });
    return () => {
      active = false;
    };
  }, [call, request]);

  const complete = useCallback(
    async (attestations: RenderGateAttestations) => {
      setState("checking");
      setErrors([]);
      setDiagnostics(undefined);
      try {
        const result = await call("complete", attestations);
        if (!result) return;
        setState(result.state);
        setErrors(result.errors ?? []);
        setPassedAt(result.passedAt);
        setDiagnostics(result.diagnostics);
      } catch (error) {
        setState("unavailable");
        setErrors([
          error instanceof Error
            ? error.message
            : "The local quality-check service is unavailable.",
        ]);
      }
    },
    [call],
  );

  const retry = useCallback(async () => {
    setState("loading");
    setErrors([]);
    setPassedAt(undefined);
    setDiagnostics(undefined);
    try {
      const result = await call("status");
      if (!result) return;
      setState(result.state);
      setErrors(result.errors ?? []);
      setPassedAt(result.passedAt);
      setDiagnostics(result.diagnostics);
    } catch (error) {
      setState("unavailable");
      setErrors([
        error instanceof Error
          ? error.message
          : "The local quality-check service is unavailable.",
      ]);
    }
  }, [call]);

  return { state, errors, passedAt, diagnostics, complete, retry };
}
