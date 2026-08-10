export type RenderGateState =
  "unavailable" | "loading" | "not_checked" | "checking" | "failed" | "passed";

export type RenderGateDiagnostics = {
  dimensions: {
    width: number;
    height: number;
  };
};

export type RenderGateAction = {
  kind: "none" | "retry" | "run";
  label: string;
  disabled: boolean;
};

export function renderGateAction(
  state: RenderGateState,
  allConfirmed: boolean,
): RenderGateAction {
  if (state === "unavailable") {
    return {
      kind: "retry",
      label: "RETRY CONNECTION",
      disabled: false,
    };
  }
  if (state === "loading") {
    return {
      kind: "none",
      label: "CHECKING STATUS…",
      disabled: true,
    };
  }
  if (state === "checking") {
    return {
      kind: "none",
      label: "RUNNING QUALITY CHECK…",
      disabled: true,
    };
  }
  if (state === "failed" || state === "passed") {
    return { kind: "none", label: "", disabled: true };
  }
  return {
    kind: "run",
    label: "RUN QUALITY CHECK",
    disabled: !allConfirmed,
  };
}

export function renderGateFailureSummary(errors: string[]) {
  const combined = errors.join(" ");
  if (/square/i.test(combined)) {
    return "The generated image is not square.";
  }
  if (/PNG/i.test(combined)) {
    return "The generated file is not a PNG.";
  }
  return "The generated file does not meet the catalog requirements.";
}
