import attemptIndex from "../../attempt-index.json";
import redoCompletionIndex from "../../redo-completion-index.json";
import { catalogVersion } from "../../catalog-version";
import type { AttemptItem, RedoCompletion } from "../../review-types";

export function GET() {
  const attempts = attemptIndex as AttemptItem[];
  const redoCompletions = redoCompletionIndex as RedoCompletion[];

  return Response.json(
    {
      attemptCatalog: {
        version: catalogVersion(attempts),
        items: attempts,
      },
      redoCompletions,
      redoCompletionVersion: catalogVersion(
        redoCompletions.map((item) => ({
          id: item.sourcePath,
          renderId: item.sourceRenderId,
        })),
      ),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
