const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS renders (
    id TEXT PRIMARY KEY NOT NULL,
    asset_hash TEXT NOT NULL,
    path TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    name TEXT NOT NULL,
    filename TEXT NOT NULL,
    category TEXT NOT NULL,
    collection TEXT NOT NULL,
    lifecycle_status TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    source_available INTEGER NOT NULL DEFAULT 0,
    suggested_tags_json TEXT NOT NULL DEFAULT '[]',
    discovered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS renders_asset_hash_idx ON renders (asset_hash)`,
  `CREATE INDEX IF NOT EXISTS renders_category_idx ON renders (category)`,
  `CREATE INDEX IF NOT EXISTS renders_collection_idx ON renders (collection)`,
  `CREATE TABLE IF NOT EXISTS reviews (
    render_id TEXT PRIMARY KEY NOT NULL REFERENCES renders(id) ON DELETE CASCADE,
    overall_rating INTEGER,
    concept_rating INTEGER,
    execution_rating INTEGER,
    direction_rating INTEGER,
    decision TEXT,
    note TEXT NOT NULL DEFAULT '',
    correction_note TEXT NOT NULL DEFAULT '',
    duplicate_of TEXT,
    deletion_state TEXT NOT NULL DEFAULT 'none',
    revision INTEGER NOT NULL DEFAULT 0,
    reviewed_at TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS review_tags (
    render_id TEXT NOT NULL REFERENCES renders(id) ON DELETE CASCADE,
    tag_key TEXT NOT NULL,
    label TEXT NOT NULL,
    tag_group TEXT NOT NULL,
    source TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    state TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (render_id, tag_key)
  )`,
  `CREATE INDEX IF NOT EXISTS review_tags_state_idx ON review_tags (state)`,
  `CREATE TABLE IF NOT EXISTS review_defects (
    render_id TEXT NOT NULL REFERENCES renders(id) ON DELETE CASCADE,
    defect_key TEXT NOT NULL,
    label TEXT NOT NULL,
    severity TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (render_id, defect_key)
  )`,
  `CREATE INDEX IF NOT EXISTS review_defects_severity_idx ON review_defects (severity)`,
  `CREATE TABLE IF NOT EXISTS review_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    render_id TEXT NOT NULL REFERENCES renders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS review_events_render_idx ON review_events (render_id)`,
];

let schemaReady: Promise<void> | undefined;
let databasePromise: Promise<D1Database> | undefined;

export function getRawDb(): Promise<D1Database> {
  if (!databasePromise) {
    databasePromise = import("cloudflare:workers").then(({ env }) => {
      if (!env.DB) {
        throw new Error("The local review database is unavailable.");
      }
      return env.DB;
    });
  }
  return databasePromise;
}

export function ensureReviewSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getRawDb()
      .then((db) =>
        db.batch(SCHEMA_STATEMENTS.map((statement) => db.prepare(statement))),
      )
      .then(() => undefined)
      .catch((error) => {
        schemaReady = undefined;
        throw error;
      });
  }
  return schemaReady;
}
