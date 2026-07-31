import type { GalleryItem, RenderReview } from "../../review-types";

export type ReviewQueue =
  "unreviewed" | "all" | "kept" | "rejected" | "deletion" | "favorites";

export function queueMatches(
  queue: ReviewQueue,
  item: GalleryItem,
  review?: RenderReview,
) {
  if (queue === "all") return true;
  if (queue === "unreviewed") {
    return item.status !== "rejected" && !review?.decision;
  }
  if (queue === "kept") return review?.decision === "keep";
  if (queue === "rejected") return review?.decision === "reject";
  if (queue === "deletion") return review?.deletionState === "marked";
  if (queue === "favorites") return review?.overallRating === 5;
  return Boolean(item);
}
