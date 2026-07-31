import { ensureReviewSchema, getRawDb } from "../../../db/runtime";

type ExportReviewRow = {
  render_id: string;
  path: string;
  name: string;
  category: string;
  collection: string;
  lifecycle_status: string;
  overall_rating: number | null;
  concept_rating: number | null;
  execution_rating: number | null;
  direction_rating: number | null;
  decision: string | null;
  note: string;
  correction_note: string;
  duplicate_of: string | null;
  deletion_state: string;
  reviewed_at: string | null;
  updated_at: string;
};

type ExportTagRow = {
  render_id: string;
  tag_key: string;
  label: string;
  tag_group: string;
  state: string;
};

type ExportDefectRow = {
  render_id: string;
  defect_key: string;
  label: string;
  severity: string;
  note: string;
};

function list(values: string[]) {
  return values.length ? values.join(", ") : "None recorded";
}

function renderMarkdown(
  generatedAt: string | null,
  rows: ExportReviewRow[],
  tagsByRender: Map<string, ExportTagRow[]>,
  defectsByRender: Map<string, ExportDefectRow[]>,
) {
  const decisions = new Map<string, number>();
  for (const row of rows) {
    const key = row.decision ?? "rated only";
    decisions.set(key, (decisions.get(key) ?? 0) + 1);
  }

  const lines = [
    "# Render Feedback Memory",
    "",
    generatedAt
      ? `Latest confirmed local review: ${generatedAt}`
      : "No renders have been reviewed yet.",
    "",
    "This file records direct ratings, decisions, defects, and correction notes. Suggested tags remain explicitly separate from confirmed tags and must not be treated as user-approved art direction.",
    "",
    "## Review summary",
    "",
    `- Reviewed or rated renders: ${rows.length}`,
    ...Array.from(decisions.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([decision, count]) => `- ${decision}: ${count}`),
    "",
  ];

  const sections = [
    {
      title: "Five-star anchors",
      rows: rows.filter((row) => row.overall_rating === 5),
    },
    {
      title: "Rejected · needs redo",
      rows: rows.filter((row) =>
        [
          "reject",
          "correct",
          "rerender",
          "redesign",
          "reference",
          "duplicate",
        ].includes(row.decision ?? ""),
      ),
    },
    {
      title: "Marked for deletion",
      rows: rows.filter((row) => row.deletion_state === "marked"),
    },
  ];

  for (const section of sections) {
    lines.push(`## ${section.title}`, "");
    if (!section.rows.length) {
      lines.push("None.", "");
      continue;
    }

    for (const row of section.rows) {
      const tags = tagsByRender.get(row.render_id) ?? [];
      const defects = defectsByRender.get(row.render_id) ?? [];
      const confirmedTags = tags
        .filter((tag) => tag.state === "confirmed")
        .map((tag) => tag.label);
      const rejectedTags = tags
        .filter((tag) => tag.state === "rejected")
        .map((tag) => tag.label);
      const defectText = defects.map(
        (defect) => `${defect.label} (${defect.severity})`,
      );

      lines.push(
        `### ${row.name}`,
        "",
        `- Render ID: \`${row.render_id}\``,
        `- Path: \`${row.path}\``,
        `- Collection: ${row.collection}`,
        `- Rating: ${row.overall_rating ?? "Not rated"}/5`,
        `- Decision: ${row.decision ?? "Rated only"}`,
        `- Defects: ${list(defectText)}`,
        `- Confirmed tags: ${list(confirmedTags)}`,
        `- Rejected tag suggestions: ${list(rejectedTags)}`,
        `- Feedback: ${row.note || "None recorded"}`,
        `- Next attempt: ${row.correction_note || "None recorded"}`,
      );
      if (row.duplicate_of) {
        lines.push(`- Duplicate of: \`${row.duplicate_of}\``);
      }
      lines.push("");
    }
  }

  lines.push(
    "## All reviewed renders",
    "",
    ...rows.map((row) => {
      const defects = (defectsByRender.get(row.render_id) ?? []).map(
        (defect) => `${defect.label} (${defect.severity})`,
      );
      return `- **${row.name}** — ${row.overall_rating ?? "—"}/5; ${row.decision ?? "rated"}; ${list(defects)}; ${row.collection}`;
    }),
    "",
  );

  return `${lines.join("\n")}\n`;
}

export async function GET() {
  try {
    await ensureReviewSchema();
    const db = await getRawDb();
    const [reviewResult, tagResult, defectResult] = await Promise.all([
      db
        .prepare(
          `SELECT
            reviews.render_id,
            COALESCE(renders.historical_path, renders.path) AS path,
            renders.name,
            renders.category,
            renders.collection,
            renders.lifecycle_status,
            reviews.overall_rating,
            reviews.concept_rating,
            reviews.execution_rating,
            reviews.direction_rating,
            reviews.decision,
            reviews.note,
            reviews.correction_note,
            reviews.duplicate_of,
            reviews.deletion_state,
            reviews.reviewed_at,
            reviews.updated_at
          FROM reviews
          INNER JOIN renders ON renders.id = reviews.render_id
          WHERE
            reviews.overall_rating IS NOT NULL OR
            reviews.decision IS NOT NULL OR
            reviews.note <> '' OR
            reviews.correction_note <> ''
          ORDER BY renders.category, renders.collection, renders.name`,
        )
        .all<ExportReviewRow>(),
      db
        .prepare(
          `SELECT render_id, tag_key, label, tag_group, state
          FROM review_tags
          WHERE state IN ('confirmed', 'rejected')
          ORDER BY render_id, tag_group, label`,
        )
        .all<ExportTagRow>(),
      db
        .prepare(
          `SELECT render_id, defect_key, label, severity, note
          FROM review_defects
          ORDER BY render_id, severity, label`,
        )
        .all<ExportDefectRow>(),
    ]);

    const tagsByRender = new Map<string, ExportTagRow[]>();
    for (const tag of tagResult.results) {
      tagsByRender.set(tag.render_id, [
        ...(tagsByRender.get(tag.render_id) ?? []),
        tag,
      ]);
    }
    const defectsByRender = new Map<string, ExportDefectRow[]>();
    for (const defect of defectResult.results) {
      defectsByRender.set(defect.render_id, [
        ...(defectsByRender.get(defect.render_id) ?? []),
        defect,
      ]);
    }

    const generatedAt =
      reviewResult.results
        .map((row) => row.updated_at)
        .sort((a, b) => b.localeCompare(a))[0] ?? null;
    const records = reviewResult.results.map((row) => {
      const tags = tagsByRender.get(row.render_id) ?? [];
      return {
        renderId: row.render_id,
        path: row.path,
        name: row.name,
        category: row.category,
        collection: row.collection,
        lifecycleStatus: row.lifecycle_status,
        ratings: {
          overall: row.overall_rating,
          concept: row.concept_rating,
          execution: row.execution_rating,
          directionFit: row.direction_rating,
        },
        decision: row.decision,
        defects: defectsByRender.get(row.render_id) ?? [],
        confirmedTags: tags.filter((tag) => tag.state === "confirmed"),
        rejectedTagSuggestions: tags.filter(
          (tag) => tag.state === "rejected",
        ),
        feedback: row.note,
        nextAttempt: row.correction_note,
        duplicateOf: row.duplicate_of,
        deletionState: row.deletion_state,
        reviewedAt: row.reviewed_at,
        updatedAt: row.updated_at,
        provenance: "user-review",
      };
    });

    return Response.json({
      generatedAt,
      reviewCount: records.length,
      markdown: renderMarkdown(
        generatedAt,
        reviewResult.results,
        tagsByRender,
        defectsByRender,
      ),
      jsonl: records.map((record) => JSON.stringify(record)).join("\n") +
        (records.length ? "\n" : ""),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not export feedback";
    return Response.json({ error: message }, { status: 500 });
  }
}
