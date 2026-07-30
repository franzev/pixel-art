import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, "..");
const repositoryDir = path.resolve(siteDir, "..");
const outputDir = path.join(repositoryDir, "art-catalog");
const markdownPath = path.join(outputDir, "RENDER-FEEDBACK.md");
const jsonlPath = path.join(outputDir, "render-feedback.jsonl");

async function writeIfChanged(file, content) {
  let previous = "";
  let exists = true;
  try {
    previous = await readFile(file, "utf8");
  } catch {
    // The first export creates the file.
    exists = false;
  }
  if (exists && previous === content) return false;
  await writeFile(file, content);
  return true;
}

export async function exportFeedback({
  baseUrl = process.env.ASHEN_ARCHIVE_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`,
  quiet = false,
} = {}) {
  const response = await fetch(new URL("/api/export", baseUrl));
  if (!response.ok) {
    throw new Error(`Feedback export failed (${response.status})`);
  }
  const payload = await response.json();
  await mkdir(outputDir, { recursive: true });
  const changes = await Promise.all([
    writeIfChanged(markdownPath, payload.markdown),
    writeIfChanged(jsonlPath, payload.jsonl),
  ]);
  if (!quiet) {
    console.log(
      `Exported ${payload.reviewCount} reviewed renders${changes.some(Boolean) ? "" : " (no changes)"}.`,
    );
  }
  return payload;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  await exportFeedback();
}
