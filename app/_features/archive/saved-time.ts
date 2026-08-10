export const SAVED_TIME_PRESETS = [
  { value: "all", label: "Any time" },
  { value: "15m", label: "Last 15 minutes" },
  { value: "1h", label: "Last hour" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "this-week", label: "This week" },
  { value: "30d", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
] as const;

export type TimeFilter = (typeof SAVED_TIME_PRESETS)[number]["value"];

const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const customRangeFormatter = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function fixedManilaDateParts(timestamp: Date) {
  const manilaTime = new Date(timestamp.getTime() + MANILA_OFFSET_MS);
  const hour = manilaTime.getUTCHours();
  return {
    year: manilaTime.getUTCFullYear(),
    month: MONTH_NAMES[manilaTime.getUTCMonth()],
    day: manilaTime.getUTCDate(),
    hour: hour % 12 || 12,
    minute: String(manilaTime.getUTCMinutes()).padStart(2, "0"),
    period: hour >= 12 ? "PM" : "AM",
  };
}

function manilaStartOfDay(now: number) {
  const manilaDate = new Date(now + MANILA_OFFSET_MS);
  return (
    Date.UTC(
      manilaDate.getUTCFullYear(),
      manilaDate.getUTCMonth(),
      manilaDate.getUTCDate(),
    ) - MANILA_OFFSET_MS
  );
}

function manilaStartOfYesterday(now: number) {
  return manilaStartOfDay(now) - DAY_MS;
}

function manilaStartOfWeek(now: number) {
  const manilaDate = new Date(now + MANILA_OFFSET_MS);
  const day = manilaDate.getUTCDay() || 7;
  return manilaStartOfDay(now) - (day - 1) * DAY_MS;
}

function parsedBoundary(value: string) {
  if (!value) return undefined;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? undefined : timestamp;
}

function savedTimeRange(
  filter: string,
  customFrom: string,
  customTo: string,
  now: number,
) {
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  switch (filter) {
    case "15m":
      return { from: now - 15 * minute, to: now };
    case "1h":
      return { from: now - hour, to: now };
    case "today":
      return { from: manilaStartOfDay(now), to: now };
    case "yesterday":
      return {
        from: manilaStartOfYesterday(now),
        to: manilaStartOfDay(now) - 1,
      };
    case "24h":
      return { from: now - day, to: now };
    case "7d":
      return { from: now - 7 * day, to: now };
    case "this-week":
      return { from: manilaStartOfWeek(now), to: now };
    case "30d":
      return { from: now - 30 * day, to: now };
    case "custom":
      return {
        from: parsedBoundary(customFrom) ?? Number.NEGATIVE_INFINITY,
        to: parsedBoundary(customTo) ?? Number.POSITIVE_INFINITY,
      };
    default:
      return null;
  }
}

export function matchesTimestampFilter(
  timestamp: string | null | undefined,
  filter: string,
  customFrom = "",
  customTo = "",
  now = Date.now(),
) {
  if (filter === "all") return true;
  if (!timestamp) return false;
  const dateTime = new Date(timestamp).getTime();
  if (Number.isNaN(dateTime)) return false;
  const range = savedTimeRange(filter, customFrom, customTo, now);
  return range ? dateTime >= range.from && dateTime <= range.to : true;
}

export function matchesGeneratedTimeFilter(
  item: { generatedAt?: string } | null | undefined,
  filter: string,
  customFrom = "",
  customTo = "",
  now = Date.now(),
) {
  return matchesTimestampFilter(
    item?.generatedAt,
    filter,
    customFrom,
    customTo,
    now,
  );
}

export function timeFilterLabel(
  filter: string,
  customFrom = "",
  customTo = "",
) {
  if (filter !== "custom") {
    return (
      SAVED_TIME_PRESETS.find((preset) => preset.value === filter)?.label ??
      "Any time"
    );
  }
  const from = parsedBoundary(customFrom);
  const to = parsedBoundary(customTo);
  if (from !== undefined && to !== undefined) {
    return `${customRangeFormatter.format(from)} to ${customRangeFormatter.format(to)}`;
  }
  if (from !== undefined) return `After ${customRangeFormatter.format(from)}`;
  if (to !== undefined) return `Before ${customRangeFormatter.format(to)}`;
  return "Custom range";
}

export function formatSavedTimestamp(value: string) {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return "Unknown";
  const parts = fixedManilaDateParts(timestamp);
  return `${parts.month} ${parts.day}, ${parts.year}, ${parts.hour}:${parts.minute} ${parts.period} GMT+8`;
}

export function formatSavedTimestampCompact(value: string) {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return "Unknown";
  const parts = fixedManilaDateParts(timestamp);
  return `${parts.month} ${parts.day}, ${parts.hour}:${parts.minute} ${parts.period}`;
}

// Backwards-compatible names for code that still describes archived generator
// outputs as files being saved.
export const matchesSavedTimeFilter = matchesGeneratedTimeFilter;
export const savedTimeFilterLabel = timeFilterLabel;
