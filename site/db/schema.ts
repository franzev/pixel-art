import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const renders = sqliteTable(
  "renders",
  {
    id: text("id").primaryKey(),
    assetHash: text("asset_hash").notNull(),
    path: text("path").notNull().unique(),
    url: text("url").notNull(),
    name: text("name").notNull(),
    filename: text("filename").notNull(),
    category: text("category").notNull(),
    collection: text("collection").notNull(),
    lifecycleStatus: text("lifecycle_status").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    sourceAvailable: integer("source_available", { mode: "boolean" })
      .notNull()
      .default(false),
    suggestedTagsJson: text("suggested_tags_json").notNull().default("[]"),
    discoveredAt: text("discovered_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    lastSeenAt: text("last_seen_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("renders_asset_hash_idx").on(table.assetHash),
    index("renders_category_idx").on(table.category),
    index("renders_collection_idx").on(table.collection),
  ],
);

export const reviews = sqliteTable("reviews", {
  renderId: text("render_id")
    .primaryKey()
    .references(() => renders.id, { onDelete: "cascade" }),
  overallRating: integer("overall_rating"),
  conceptRating: integer("concept_rating"),
  executionRating: integer("execution_rating"),
  directionRating: integer("direction_rating"),
  decision: text("decision"),
  note: text("note").notNull().default(""),
  correctionNote: text("correction_note").notNull().default(""),
  duplicateOf: text("duplicate_of"),
  deletionState: text("deletion_state").notNull().default("none"),
  revision: integer("revision").notNull().default(0),
  reviewedAt: text("reviewed_at"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reviewTags = sqliteTable(
  "review_tags",
  {
    renderId: text("render_id")
      .notNull()
      .references(() => renders.id, { onDelete: "cascade" }),
    tagKey: text("tag_key").notNull(),
    label: text("label").notNull(),
    tagGroup: text("tag_group").notNull(),
    source: text("source").notNull(),
    confidence: integer("confidence").notNull(),
    state: text("state").notNull(),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    primaryKey({ columns: [table.renderId, table.tagKey] }),
    index("review_tags_state_idx").on(table.state),
  ],
);

export const reviewDefects = sqliteTable(
  "review_defects",
  {
    renderId: text("render_id")
      .notNull()
      .references(() => renders.id, { onDelete: "cascade" }),
    defectKey: text("defect_key").notNull(),
    label: text("label").notNull(),
    severity: text("severity").notNull(),
    note: text("note").notNull().default(""),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    primaryKey({ columns: [table.renderId, table.defectKey] }),
    index("review_defects_severity_idx").on(table.severity),
  ],
);

export const reviewEvents = sqliteTable(
  "review_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    renderId: text("render_id")
      .notNull()
      .references(() => renders.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    payloadJson: text("payload_json").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("review_events_render_idx").on(table.renderId)],
);
