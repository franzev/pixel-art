import artIndex from "../../art-index.json";
import { catalogVersion } from "../../catalog-version";
import type { ArtItem } from "../../review-types";

export function GET() {
  return Response.json(
    {
      count: artIndex.length,
      version: catalogVersion(artIndex as ArtItem[]),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
