"use client";

import { useId } from "react";

export function FilterGroup({
  label,
  value,
  options,
  counts,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  counts: Map<string, number>;
  onChange: (value: string) => void;
}) {
  const groupName = useId();

  return (
    <fieldset className="filter-group">
      <legend>{label}</legend>
      <div className="filter-list">
        {options.map((option) => (
          <label
            key={option.value}
            className={[
              "filter-choice",
              value === option.value ? "active" : "",
              (counts.get(option.value) ?? 0) === 0 ? "is-empty" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <input
              className="sr-only"
              type="radio"
              name={groupName}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
            <strong>{counts.get(option.value) ?? 0}</strong>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
