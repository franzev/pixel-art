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

export type SavedTimeFilter = (typeof SAVED_TIME_PRESETS)[number]["value"];

const savedDateTimeFormatter = new Intl.DateTimeFormat("en-PH", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Manila",
  timeZoneName: "short",
});

const compactDateTimeFormatter = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Manila",
});

const customRangeFormatter = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function localStartOfDay(now: number) {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function localStartOfYesterday(now: number) {
  const date = new Date(now);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 1,
  ).getTime();
}

function localStartOfWeek(now: number) {
  const date = new Date(now);
  const day = date.getDay() || 7;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - day + 1,
  ).getTime();
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
      return { from: localStartOfDay(now), to: now };
    case "yesterday":
      return {
        from: localStartOfYesterday(now),
        to: localStartOfDay(now) - 1,
      };
    case "24h":
      return { from: now - day, to: now };
    case "7d":
      return { from: now - 7 * day, to: now };
    case "this-week":
      return { from: localStartOfWeek(now), to: now };
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

export function matchesSavedTimeFilter(
  item: { generatedAt?: unknown },
  filter: string,
  customFrom = "",
  customTo = "",
  now = Date.now(),
) {
  if (filter === "all") return true;
  if (typeof item.generatedAt !== "string") return false;
  const savedAt = new Date(item.generatedAt).getTime();
  if (Number.isNaN(savedAt)) return false;
  const range = savedTimeRange(filter, customFrom, customTo, now);
  return range ? savedAt >= range.from && savedAt <= range.to : true;
}

export function savedTimeFilterLabel(
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
  return Number.isNaN(timestamp.getTime())
    ? "Unknown"
    : savedDateTimeFormatter.format(timestamp);
}

export function formatSavedTimestampCompact(value: string) {
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime())
    ? "Unknown"
    : compactDateTimeFormatter.format(timestamp);
}
