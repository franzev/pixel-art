import attemptIndex from "../../attempt-index.json";
import artIndex from "../../art-index.json";
import redoCompletionIndex from "../../redo-completion-index.json";
import { catalogVersion } from "../../catalog-version";
import type {
  ArtItem,
  AttemptItem,
  RedoCompletion,
} from "../../review-types";

export function GET() {
  const redoCompletions = redoCompletionIndex as RedoCompletion[];
  return Response.json(
    {
      count: artIndex.length,
      version: `${catalogVersion(artIndex as ArtItem[])}:${catalogVersion(
        attemptIndex as AttemptItem[],
      )}:${catalogVersion(
        redoCompletions.map((item) => ({
          id: item.sourcePath,
          renderId: item.sourceRenderId,
        })),
      )}`,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
