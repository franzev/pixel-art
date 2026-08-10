import type {
  AttemptItem,
  GalleryItem,
  ReviewMap,
} from "../../review-types";
import type { LibrarySort } from "./library-toolbar";

export type AttemptSeries = {
  series: string;
  concept: string;
  collection: string;
  latest: AttemptItem;
  attempts: AttemptItem[];
  candidateCount: number;
  rawCount: number;
};

export function groupAttemptSeries(attempts: AttemptItem[]): AttemptSeries[] {
  const bySeries = new Map<string, AttemptItem[]>();
  for (const item of attempts) {
    const series = bySeries.get(item.series);
    if (series) series.push(item);
    else bySeries.set(item.series, [item]);
  }

  return Array.from(bySeries, ([series, items]) => {
    const ordered = [...items].sort(
      (a, b) =>
        b.generatedAt.localeCompare(a.generatedAt) || b.attempt - a.attempt,
    );
    const latest = ordered[0];
    const candidateCount = ordered.filter(
      (item) => item.sourceKind === "redo-staging",
    ).length;
    return {
      series,
      concept: latest.concept,
      collection: latest.collection,
      latest,
      attempts: ordered,
      candidateCount,
      rawCount: ordered.length - candidateCount,
    };
  }).sort((a, b) => b.latest.generatedAt.localeCompare(a.latest.generatedAt));
}

export function sortLibraryItems(
  items: GalleryItem[],
  reviews: ReviewMap,
  sort: LibrarySort,
) {
  if (sort === "catalog") return items;
  const ordered = [...items];
  if (sort === "name") {
    return ordered.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }
  return ordered.sort(
    (a, b) =>
      (reviews[b.renderId]?.overallRating ?? 0) -
        (reviews[a.renderId]?.overallRating ?? 0) ||
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}
