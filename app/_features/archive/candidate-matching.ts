import type { AttemptItem, GalleryItem } from "../../review-types";

function conceptKey(value: string) {
  return value
    .replace(/\.png$/i, "")
    .replace(/-v\d+$/i, "")
    .replace(/^\d{1,3}-/, "")
    .toLocaleLowerCase();
}

export function attemptSlot(item: AttemptItem) {
  const [category, collection] = item.series.split("/");
  return `${category}/${collection}/${conceptKey(item.filename)}`;
}

export function catalogSlot(item: GalleryItem) {
  const parts = item.id.split("/");
  return `${parts[0]}/${parts[1]}/${conceptKey(item.filename)}`;
}

export function latestSuccessfulCandidates(attempts: AttemptItem[]) {
  const latest = new Map<string, AttemptItem>();
  for (const item of attempts) {
    if (item.sourceKind !== "redo-staging") continue;
    const slot = attemptSlot(item);
    const current = latest.get(slot);
    if (!current || item.generatedAt > current.generatedAt) {
      latest.set(slot, item);
    }
  }
  return Array.from(latest.values()).sort((a, b) =>
    b.generatedAt.localeCompare(a.generatedAt),
  );
}

export function matchingCatalogItem(
  candidate: AttemptItem,
  catalog: GalleryItem[],
) {
  const slot = attemptSlot(candidate);
  return catalog.find((item) => catalogSlot(item) === slot);
}

export function matchingAttemptHistory(
  candidate: AttemptItem,
  attempts: AttemptItem[],
) {
  const slot = attemptSlot(candidate);
  return attempts
    .filter((item) => attemptSlot(item) === slot)
    .sort(
      (a, b) =>
        b.generatedAt.localeCompare(a.generatedAt) || b.attempt - a.attempt,
    );
}
