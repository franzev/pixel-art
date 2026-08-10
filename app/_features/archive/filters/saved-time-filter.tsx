"use client";

import { SAVED_TIME_PRESETS } from "../saved-time";

const QUICK_PRESETS = ["1h", "today", "yesterday", "7d"] as const;

export function SavedTimeFilter({
  label = "Generated",
  help,
  value,
  customFrom,
  customTo,
  compact = false,
  onChange,
  onCustomFromChange,
  onCustomToChange,
}: {
  label?: string;
  help?: string;
  value: string;
  customFrom: string;
  customTo: string;
  compact?: boolean;
  onChange: (value: string) => void;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
}) {
  return (
    <fieldset
      className={
        compact ? "saved-time-filter is-compact" : "saved-time-filter"
      }
    >
      <legend>{label}</legend>
      <label className="saved-time-select">
        <span className="sr-only">{label} time range</span>
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {SAVED_TIME_PRESETS.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>

      {!compact ? (
        <div className="saved-time-quick" aria-label="Quick saved-time ranges">
          {QUICK_PRESETS.map((presetValue) => {
            const preset = SAVED_TIME_PRESETS.find(
              (candidate) => candidate.value === presetValue,
            );
            return (
              <button
                key={presetValue}
                type="button"
                className={value === presetValue ? "is-active" : undefined}
                aria-pressed={value === presetValue}
                onClick={() => onChange(presetValue)}
              >
                {preset?.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {value === "custom" ? (
        <div className="saved-time-custom">
          <label>
            <span>From</span>
            <input
              type="datetime-local"
              value={customFrom}
              max={customTo || undefined}
              onChange={(event) => onCustomFromChange(event.target.value)}
            />
          </label>
          <label>
            <span>To</span>
            <input
              type="datetime-local"
              value={customTo}
              min={customFrom || undefined}
              onChange={(event) => onCustomToChange(event.target.value)}
            />
          </label>
        </div>
      ) : null}

      {!compact ? (
        <small className="saved-time-help">
          {help ??
            `${label} ranges use the timestamp shown for each render. Calendar ranges use GMT+8.`}
        </small>
      ) : null}
    </fieldset>
  );
}
