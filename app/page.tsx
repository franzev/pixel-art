import { ArchiveGallery } from "./_features/archive/archive-gallery";
import attemptIndex from "./attempt-index.json";
import artIndex from "./art-index.json";
import redoCompletionIndex from "./redo-completion-index.json";
import { catalogVersion } from "./catalog-version";
import { compactGalleryCatalog } from "./gallery-catalog";
import type { ArtItem, AttemptItem, RedoCompletion } from "./review-types";

// Generated indices are refreshed by the local development workflow.

export default function Home() {
  const redoCompletions = redoCompletionIndex as RedoCompletion[];
  const redoCompletionVersion = catalogVersion(
    redoCompletions.map((item) => ({
      id: item.sourcePath,
      renderId: item.sourceRenderId,
    })),
  );
  return (
    <ArchiveGallery
      catalog={compactGalleryCatalog(artIndex as ArtItem[])}
      attemptCatalog={{
        version: catalogVersion(attemptIndex as AttemptItem[]),
        items: attemptIndex as AttemptItem[],
      }}
      redoCompletions={redoCompletions}
      redoCompletionVersion={redoCompletionVersion}
    />
  );
}
