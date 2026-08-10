import assert from "node:assert/strict";
import test from "node:test";
import {
  matchesGeneratedTimeFilter,
  matchesSavedTimeFilter,
  matchesTimestampFilter,
  formatSavedTimestamp,
  formatSavedTimestampCompact,
  savedTimeFilterLabel,
  timeFilterLabel,
} from "../app/_features/archive/saved-time.ts";

const now = Date.parse("2026-08-02T04:00:00.000Z");

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
  const today = attemptAt(new Date("2026-08-02T00:30:00.000Z"));
  const yesterday = attemptAt(new Date("2026-08-01T10:45:00.000Z"));

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

test("calendar presets use the same GMT+8 day shown by render timestamps", () => {
  const manilaMorning = Date.parse("2026-08-03T02:00:00.000Z");
  const afterManilaMidnight = attemptAt(
    new Date("2026-08-02T23:30:00.000Z"),
  );
  const beforeManilaMidnight = attemptAt(
    new Date("2026-08-02T15:59:59.999Z"),
  );

  assert.equal(
    matchesSavedTimeFilter(
      afterManilaMidnight,
      "today",
      "",
      "",
      manilaMorning,
    ),
    true,
  );
  assert.equal(
    matchesSavedTimeFilter(
      beforeManilaMidnight,
      "today",
      "",
      "",
      manilaMorning,
    ),
    false,
  );
  assert.equal(
    matchesSavedTimeFilter(
      beforeManilaMidnight,
      "yesterday",
      "",
      "",
      manilaMorning,
    ),
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

test("generated and reviewed timestamps use the same range semantics", () => {
  const timestamp = new Date(now - 30 * 60 * 1000).toISOString();

  assert.equal(
    matchesGeneratedTimeFilter({ generatedAt: timestamp }, "1h", "", "", now),
    true,
  );
  assert.equal(matchesTimestampFilter(timestamp, "1h", "", "", now), true);
  assert.equal(matchesTimestampFilter(null, "1h", "", "", now), false);
});

test("saved-time labels remain explicit", () => {
  assert.equal(savedTimeFilterLabel("1h", "", ""), "Last hour");
  assert.equal(timeFilterLabel("1h", "", ""), "Last hour");
  assert.equal(
    savedTimeFilterLabel(
      "custom",
      "2026-08-02T09:00",
      "2026-08-02T10:00",
    ),
    "Aug 2, 9:00 AM to Aug 2, 10:00 AM",
  );
});

test("saved timestamps render in a server/client-stable timezone", () => {
  const timestamp = "2026-07-30T00:18:40.238Z";

  assert.equal(formatSavedTimestamp(timestamp), "Jul 30, 2026, 8:18 AM GMT+8");
  assert.equal(formatSavedTimestampCompact(timestamp), "Jul 30, 8:18 AM");
});
