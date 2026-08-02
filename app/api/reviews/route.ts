import type {
  ArtItem,
  AttemptItem,
  DefectSeverity,
  RenderReview,
  ReviewDecision,
  ReviewDefect,
  ReviewTag,
  TagState,
} from "../../review-types";
import attemptIndex from "../../attempt-index.json";
import artIndex from "../../art-index.json";
import {
  ensureCatalogSynced,
  ensureReviewTargetsSynced,
} from "../../../db/catalog-sync";
import { getRawDb } from "../../../db/runtime";

const DECISIONS = new Set<ReviewDecision>([
  "keep",
  "reject",
  "delete",
]);
const TAG_STATES = new Set<TagState>(["suggested", "confirmed", "rejected"]);
const DEFECT_SEVERITIES = new Set<DefectSeverity>([
  "minor",
  "major",
  "fatal",
]);
const catalogItems = artIndex as ArtItem[];
const attemptItems = attemptIndex as AttemptItem[];
const reviewTargets = [...catalogItems, ...attemptItems] as ArtItem[];
const reviewTargetsByRenderId = new Map(
  reviewTargets.map((item) => [item.renderId, item]),
);

type ReviewRow = {
  render_id: string;
  overall_rating: number | null;
  concept_rating: number | null;
  execution_rating: number | null;
  direction_rating: number | null;
  decision: ReviewDecision | null;
  note: string;
  correction_note: string;
  duplicate_of: string | null;
  deletion_state: "none" | "marked";
  revision: number;
  reviewed_at: string | null;
  updated_at: string;
};

type TagRow = {
  render_id: string;
  tag_key: string;
  label: string;
  tag_group: string;
  source: ReviewTag["source"];
  confidence: number;
  state: TagState;
};

type DefectRow = {
  render_id: string;
  defect_key: string;
  label: string;
  severity: DefectSeverity;
  note: string;
};

function validRating(value: unknown): value is number | null {
  return (
    value === null ||
    (typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 1 &&
      value <= 5)
  );
}

function validTag(value: unknown): value is ReviewTag {
  if (!value || typeof value !== "object") return false;
  const tag = value as Partial<ReviewTag>;
  return (
    typeof tag.key === "string" &&
    typeof tag.label === "string" &&
    typeof tag.group === "string" &&
    typeof tag.source === "string" &&
    typeof tag.confidence === "number" &&
    tag.confidence >= 0 &&
    tag.confidence <= 1 &&
    typeof tag.state === "string" &&
    TAG_STATES.has(tag.state as TagState)
  );
}

function validDefect(value: unknown): value is ReviewDefect {
  if (!value || typeof value !== "object") return false;
  const defect = value as Partial<ReviewDefect>;
  return (
    typeof defect.key === "string" &&
    typeof defect.label === "string" &&
    typeof defect.severity === "string" &&
    DEFECT_SEVERITIES.has(defect.severity as DefectSeverity) &&
    (defect.note === undefined || typeof defect.note === "string")
  );
}

function validReview(value: unknown): value is RenderReview {
  if (!value || typeof value !== "object") return false;
  const review = value as Partial<RenderReview>;
  return (
    typeof review.renderId === "string" &&
    validRating(review.overallRating) &&
    validRating(review.conceptRating) &&
    validRating(review.executionRating) &&
    validRating(review.directionRating) &&
    (review.decision === null ||
      (typeof review.decision === "string" &&
        DECISIONS.has(review.decision as ReviewDecision))) &&
    typeof review.note === "string" &&
    typeof review.correctionNote === "string" &&
    (review.duplicateOf === null || typeof review.duplicateOf === "string") &&
    (review.deletionState === "none" ||
      review.deletionState === "marked") &&
    Array.isArray(review.tags) &&
    review.tags.every(validTag) &&
    Array.isArray(review.defects) &&
    review.defects.every(validDefect) &&
    typeof review.revision === "number" &&
    (review.reviewedAt === null || typeof review.reviewedAt === "string") &&
    typeof review.updatedAt === "string"
  );
}

export async function GET() {
  try {
    // Review history is authoritative and must remain readable even if a live
    // catalog refresh catches an image while it is still being indexed.
    try {
      await ensureCatalogSynced(catalogItems);
    } catch (error) {
      console.error("Could not refresh catalog review targets:", error);
    }
    try {
      await ensureReviewTargetsSynced(attemptItems as ArtItem[]);
    } catch (error) {
      console.error("Could not refresh generated-output review targets:", error);
    }
    const db = await getRawDb();
    const [reviewResult, tagResult, defectResult] = await Promise.all([
      db.prepare("SELECT * FROM reviews").all<ReviewRow>(),
      db.prepare("SELECT * FROM review_tags").all<TagRow>(),
      db.prepare("SELECT * FROM review_defects").all<DefectRow>(),
    ]);

    const reviewMap = new Map<string, RenderReview>();
    for (const row of reviewResult.results) {
      reviewMap.set(row.render_id, {
        renderId: row.render_id,
        overallRating: row.overall_rating,
        conceptRating: row.concept_rating,
        executionRating: row.execution_rating,
        directionRating: row.direction_rating,
        decision: row.decision,
        note: row.note,
        correctionNote: row.correction_note,
        duplicateOf: row.duplicate_of,
        deletionState: row.deletion_state,
        tags: [],
        defects: [],
        revision: row.revision,
        reviewedAt: row.reviewed_at,
        updatedAt: row.updated_at,
      });
    }

    for (const row of tagResult.results) {
      reviewMap.get(row.render_id)?.tags.push({
        key: row.tag_key,
        label: row.label,
        group: row.tag_group,
        source: row.source,
        confidence: row.confidence / 1_000,
        state: row.state,
      });
    }

    for (const row of defectResult.results) {
      reviewMap.get(row.render_id)?.defects.push({
        key: row.defect_key,
        label: row.label,
        severity: row.severity,
        note: row.note || undefined,
      });
    }

    return Response.json({ reviews: Array.from(reviewMap.values()) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load reviews";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      renderId?: unknown;
      review?: unknown;
    };
    if (
      typeof payload.renderId !== "string" ||
      !validReview(payload.review)
    ) {
      return Response.json(
        { error: "review payload is invalid" },
        { status: 400 },
      );
    }

    const item = reviewTargetsByRenderId.get(payload.renderId);
    const review = payload.review as RenderReview;
    if (!item || item.renderId !== review.renderId) {
      return Response.json(
        { error: "render identity does not match" },
        { status: 400 },
      );
    }

    await ensureCatalogSynced(catalogItems);
    await ensureReviewTargetsSynced(attemptItems as ArtItem[]);
    const db = await getRawDb();
    const timestamp = new Date().toISOString();
    const statements = [
      db
        .prepare(
          `INSERT INTO reviews (
            render_id, overall_rating, concept_rating, execution_rating,
            direction_rating, decision, note, correction_note, duplicate_of,
            deletion_state, revision, reviewed_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(render_id) DO UPDATE SET
            overall_rating = excluded.overall_rating,
            concept_rating = excluded.concept_rating,
            execution_rating = excluded.execution_rating,
            direction_rating = excluded.direction_rating,
            decision = excluded.decision,
            note = excluded.note,
            correction_note = excluded.correction_note,
            duplicate_of = excluded.duplicate_of,
            deletion_state = excluded.deletion_state,
            revision = excluded.revision,
            reviewed_at = excluded.reviewed_at,
            updated_at = excluded.updated_at
          WHERE excluded.revision >= reviews.revision`,
        )
        .bind(
          review.renderId,
          review.overallRating,
          review.conceptRating,
          review.executionRating,
          review.directionRating,
          review.decision,
          review.note,
          review.correctionNote,
          review.duplicateOf,
          review.deletionState,
          review.revision,
          review.reviewedAt,
          review.updatedAt,
        ),
      db
        .prepare("DELETE FROM review_tags WHERE render_id = ?")
        .bind(review.renderId),
      db
        .prepare("DELETE FROM review_defects WHERE render_id = ?")
        .bind(review.renderId),
      ...review.tags.map((tag) =>
        db
          .prepare(
            `INSERT INTO review_tags (
              render_id, tag_key, label, tag_group, source, confidence, state,
              updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            review.renderId,
            tag.key,
            tag.label,
            tag.group,
            tag.source,
            Math.round(tag.confidence * 1_000),
            tag.state,
            review.updatedAt,
          ),
      ),
      ...review.defects.map((defect) =>
        db
          .prepare(
            `INSERT INTO review_defects (
              render_id, defect_key, label, severity, note, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            review.renderId,
            defect.key,
            defect.label,
            defect.severity,
            defect.note ?? "",
            review.updatedAt,
          ),
      ),
      db
        .prepare(
          `INSERT INTO review_events (
            render_id, event_type, payload_json, created_at
          ) VALUES (?, ?, ?, ?)`,
        )
        .bind(
          review.renderId,
          "review.saved",
          JSON.stringify(review),
          timestamp,
        ),
    ];

    await db.batch(statements);
    return Response.json({
      saved: true,
      renderId: review.renderId,
      revision: review.revision,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save review";
    return Response.json({ error: message }, { status: 500 });
  }
}
