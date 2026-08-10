"use client";

import { ActionButton } from "./action-button";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      className={["segmented-control", className].filter(Boolean).join(" ")}
      role="group"
      aria-label={label}
    >
      {options.map((option) => (
        <ActionButton
          key={option.value}
          variant="segment"
          size="compact"
          className={value === option.value ? "is-active" : undefined}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          <span>{option.label}</span>
          {option.count === undefined ? null : <strong>{option.count}</strong>}
        </ActionButton>
      ))}
    </div>
  );
}
