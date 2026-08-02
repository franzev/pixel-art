import assert from "node:assert/strict";
import test from "node:test";
import {
  matchesSavedTimeFilter,
  savedTimeFilterLabel,
} from "../app/_features/archive/saved-time.ts";

const now = new Date(2026, 7, 2, 12, 0, 0).getTime();

function attemptAt(date) {
  return {
    generatedAt: date.toISOString(),
  };
}

test("saved-time rolling presets use the current minute", () => {
  const thirtyMinutesAgo = attemptAt(new Date(now - 30 * 60 * 1000));
  const twoHoursAgo = attemptAt(new Date(now - 2 * 60 * 60 * 1000));

  assert.equal(
    matchesSavedTimeFilter(thirtyMinutesAgo, "1h", "", "", now),
    true,
  );
  assert.equal(
    matchesSavedTimeFilter(twoHoursAgo, "1h", "", "", now),
    false,
  );
  assert.equal(
    matchesSavedTimeFilter(twoHoursAgo, "24h", "", "", now),
    true,
  );
});

test("saved-time calendar presets distinguish today and yesterday", () => {
  const today = attemptAt(new Date(2026, 7, 2, 8, 30));
  const yesterday = attemptAt(new Date(2026, 7, 1, 18, 45));

  assert.equal(matchesSavedTimeFilter(today, "today", "", "", now), true);
  assert.equal(
    matchesSavedTimeFilter(yesterday, "today", "", "", now),
    false,
  );
  assert.equal(
    matchesSavedTimeFilter(yesterday, "yesterday", "", "", now),
    true,
  );
});

test("custom saved-time ranges include their exact boundaries", () => {
  const item = attemptAt(new Date(2026, 7, 2, 9, 0));

  assert.equal(
    matchesSavedTimeFilter(
      item,
      "custom",
      "2026-08-02T09:00",
      "2026-08-02T10:00",
      now,
    ),
    true,
  );
  assert.equal(
    matchesSavedTimeFilter(
      item,
      "custom",
      "2026-08-02T09:01",
      "",
      now,
    ),
    false,
  );
});

test("active saved-time filters exclude undated catalog originals", () => {
  assert.equal(matchesSavedTimeFilter({}, "all", "", "", now), true);
  assert.equal(matchesSavedTimeFilter({}, "7d", "", "", now), false);
});

test("saved-time labels remain explicit", () => {
  assert.equal(savedTimeFilterLabel("1h", "", ""), "Last hour");
  assert.equal(
    savedTimeFilterLabel(
      "custom",
      "2026-08-02T09:00",
      "2026-08-02T10:00",
    ),
    "Aug 2, 9:00 AM to Aug 2, 10:00 AM",
  );
});
