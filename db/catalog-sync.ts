import { catalogVersion } from "../app/catalog-version";
import type { ArtItem } from "../app/review-types";
import {
  prepareCatalogPathRelease,
  prepareCatalogUpsert,
} from "./catalog";
import { ensureReviewSchema, getRawDb } from "./runtime";

const BATCH_SIZE = 80;

let synchronizedVersion: string | undefined;
let synchronization: Promise<void> | undefined;
let synchronizedReviewTargetVersion: string | undefined;
let reviewTargetSynchronization: Promise<void> | undefined;

async function synchronizeCatalog(items: ArtItem[], version: string) {
  await ensureReviewSchema();
  const db = await getRawDb();
  const current = await db
    .prepare("SELECT version FROM catalog_state WHERE id = 1")
    .first<{ version: string }>();

  if (current?.version === version) {
    synchronizedVersion = version;
    return;
  }

  const timestamp = new Date().toISOString();
  await db.prepare("UPDATE renders SET source_available = 0").run();

  for (let index = 0; index < items.length; index += BATCH_SIZE) {
    const chunk = items.slice(index, index + BATCH_SIZE);
    await db.batch(
      chunk.flatMap((item) => [
        prepareCatalogPathRelease(db, item),
        prepareCatalogUpsert(db, item, timestamp),
      ]),
    );
  }

  await db
    .prepare(
      `INSERT INTO catalog_state (id, version, synced_at)
       VALUES (1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         version = excluded.version,
         synced_at = excluded.synced_at`,
    )
    .bind(version, timestamp)
    .run();

  synchronizedVersion = version;
}

export function ensureCatalogSynced(items: ArtItem[]): Promise<void> {
  const version = catalogVersion(items);
  if (synchronizedVersion === version) return Promise.resolve();

  if (!synchronization) {
    synchronization = synchronizeCatalog(items, version).finally(() => {
      synchronization = undefined;
    });
  }

  return synchronization;
}

async function synchronizeReviewTargets(items: ArtItem[], version: string) {
  await ensureReviewSchema();
  const db = await getRawDb();
  const timestamp = new Date().toISOString();

  for (let index = 0; index < items.length; index += BATCH_SIZE) {
    const chunk = items.slice(index, index + BATCH_SIZE);
    await db.batch(
      chunk.flatMap((item) => [
        prepareCatalogPathRelease(db, item),
        prepareCatalogUpsert(db, item, timestamp),
      ]),
    );
  }
  synchronizedReviewTargetVersion = version;
}

export function ensureReviewTargetsSynced(items: ArtItem[]): Promise<void> {
  const version = catalogVersion(items);
  if (synchronizedReviewTargetVersion === version) return Promise.resolve();

  if (!reviewTargetSynchronization) {
    reviewTargetSynchronization = synchronizeReviewTargets(items, version).finally(
      () => {
        reviewTargetSynchronization = undefined;
      },
    );
  }
  return reviewTargetSynchronization;
}
