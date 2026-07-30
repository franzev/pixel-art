import { ArchiveGallery } from "./ArchiveGallery";
import artIndex from "./art-index.json";

export default function Home() {
  return <ArchiveGallery items={artIndex} />;
}
