import type { ArtItem } from "../app/review-types";

export function isCatalogItem(value: unknown): value is ArtItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ArtItem>;
  return (
    typeof item.renderId === "string" &&
    item.renderId.startsWith("rnd_") &&
    typeof item.assetHash === "string" &&
    item.assetHash.length === 64 &&
    typeof item.path === "string" &&
    typeof item.url === "string" &&
    item.url.startsWith("/art/") &&
    typeof item.name === "string" &&
    typeof item.filename === "string" &&
    typeof item.category === "string" &&
    typeof item.collection === "string" &&
    typeof item.status === "string" &&
    typeof item.width === "number" &&
    typeof item.height === "number" &&
    typeof item.sourceAvailable === "boolean" &&
    Array.isArray(item.suggestedTags)
  );
}

export function prepareCatalogUpsert(
  db: D1Database,
  item: ArtItem,
  timestamp: string,
) {
  return db
    .prepare(
      `INSERT INTO renders (
        id, asset_hash, path, url, name, filename, category, collection,
        lifecycle_status, width, height, source_available, suggested_tags_json,
        discovered_at, last_seen_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        asset_hash = excluded.asset_hash,
        path = excluded.path,
        url = excluded.url,
        name = excluded.name,
        filename = excluded.filename,
        category = excluded.category,
        collection = excluded.collection,
        lifecycle_status = excluded.lifecycle_status,
        width = excluded.width,
        height = excluded.height,
        source_available = excluded.source_available,
        suggested_tags_json = excluded.suggested_tags_json,
        last_seen_at = excluded.last_seen_at`,
    )
    .bind(
      item.renderId,
      item.assetHash,
      item.path,
      item.url,
      item.name,
      item.filename,
      item.category,
      item.collection,
      item.status,
      item.width,
      item.height,
      item.sourceAvailable ? 1 : 0,
      JSON.stringify(item.suggestedTags),
      timestamp,
      timestamp,
    );
}
