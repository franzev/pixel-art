import type { ArtItem } from "../../review-types";
import { isCatalogItem, prepareCatalogUpsert } from "../../../db/catalog";
import { ensureReviewSchema, getRawDb } from "../../../db/runtime";

const MAX_CATALOG_ITEMS = 5_000;
const BATCH_SIZE = 80;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { items?: unknown };
    if (!Array.isArray(payload.items)) {
      return Response.json({ error: "items must be an array" }, { status: 400 });
    }
    if (payload.items.length > MAX_CATALOG_ITEMS) {
      return Response.json({ error: "catalog is too large" }, { status: 413 });
    }
    if (!payload.items.every(isCatalogItem)) {
      return Response.json(
        { error: "catalog contains an invalid render" },
        { status: 400 },
      );
    }

    await ensureReviewSchema();
    const db = await getRawDb();
    const items = payload.items as ArtItem[];
    const timestamp = new Date().toISOString();

    for (let index = 0; index < items.length; index += BATCH_SIZE) {
      const chunk = items.slice(index, index + BATCH_SIZE);
      await db.batch(
        chunk.map((item) => prepareCatalogUpsert(db, item, timestamp)),
      );
    }

    return Response.json({
      imported: items.length,
      importedAt: timestamp,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not catalog renders";
    return Response.json({ error: message }, { status: 500 });
  }
}
