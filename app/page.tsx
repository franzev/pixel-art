import { ArchiveGallery } from "./_features/archive/archive-gallery";
import artIndex from "./art-index.json";
import { compactGalleryCatalog } from "./gallery-catalog";
import type { ArtItem } from "./review-types";

export default function Home() {
  return (
    <ArchiveGallery
      catalog={compactGalleryCatalog(artIndex as ArtItem[])}
    />
  );
}
