import { execFileSync } from "node:child_process";
import { lstat, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const artDir = path.join(projectDir, "public", "art");
const feedbackPath = path.join(
  projectDir,
  "art-catalog",
  "render-feedback.jsonl",
);
const apply = process.argv.includes("--apply");

function fail(message) {
  throw new Error(message);
}

function parseFeedback(content) {
  return content
    .split("\n")
    .filter((line) => line.trim())
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        fail(`Invalid JSON on feedback line ${index + 1}.`);
      }
    });
}

function validatedTarget(record) {
  if (
    record.decision !== "delete" ||
    record.deletionState !== "marked"
  ) {
    fail(`Record ${record.renderId ?? "(unknown)"} is not marked for deletion.`);
  }
  if (typeof record.path !== "string" || !record.path) {
    fail(`Record ${record.renderId ?? "(unknown)"} has no path.`);
  }

  const normalized = record.path.split(path.sep).join("/");
  if (
    path.posix.isAbsolute(normalized) ||
    normalized.split("/").includes("..") ||
    path.posix.extname(normalized).toLowerCase() !== ".png"
  ) {
    fail(`Unsafe deletion path: ${record.path}`);
  }

  const absolute = path.resolve(artDir, normalized);
  if (!absolute.startsWith(`${artDir}${path.sep}`)) {
    fail(`Deletion path escapes public/art: ${record.path}`);
  }

  return {
    ...record,
    normalized,
    absolute,
    repositoryPath: path.posix.join("public", "art", normalized),
  };
}

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: projectDir,
    encoding: "utf8",
    stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
    input: options.input,
  });
}

const records = parseFeedback(await readFile(feedbackPath, "utf8"));
const targets = records
  .filter(
    (record) =>
      record.decision === "delete" && record.deletionState === "marked",
  )
  .map(validatedTarget);

const uniquePaths = new Set(targets.map((target) => target.normalized));
if (uniquePaths.size !== targets.length) {
  fail("Deletion export contains duplicate paths.");
}

const live = [];
const historical = [];
for (const target of targets) {
  try {
    const metadata = await lstat(target.absolute);
    if (!metadata.isFile() || metadata.isSymbolicLink()) {
      fail(`Deletion target is not a regular file: ${target.repositoryPath}`);
    }
    live.push(target);
  } catch (error) {
    if (error?.code === "ENOENT") {
      historical.push(target);
      continue;
    }
    throw error;
  }
}

const repositoryPaths = live.map((target) => target.repositoryPath);
if (repositoryPaths.length) {
  const status = git(["status", "--porcelain=v1", "--", ...repositoryPaths]);
  if (status.trim()) {
    fail(`Deletion targets have existing worktree changes:\n${status}`);
  }

  const tracked = new Set(
    git(["ls-files", "--", ...repositoryPaths])
      .split("\n")
      .filter(Boolean),
  );
  const untrackedTargets = repositoryPaths.filter((item) => !tracked.has(item));
  if (untrackedTargets.length) {
    fail(
      `Deletion targets are not tracked by Git:\n${untrackedTargets.join("\n")}`,
    );
  }
}

const categoryCounts = new Map();
let bytes = 0;
for (const target of live) {
  const metadata = await lstat(target.absolute);
  bytes += metadata.size;
  categoryCounts.set(
    target.category,
    (categoryCounts.get(target.category) ?? 0) + 1,
  );
}

console.log(`Marked review records: ${targets.length}`);
console.log(`Already absent historical files: ${historical.length}`);
console.log(`Live tracked files: ${live.length}`);
console.log(`Live file size: ${(bytes / 1024 / 1024).toFixed(1)} MiB`);
for (const [category, count] of [...categoryCounts.entries()].sort()) {
  console.log(`  ${category}: ${count}`);
}

if (!apply) {
  console.log("Dry run only. Re-run with --apply to delete the live files.");
  process.exit(0);
}

if (!live.length) {
  console.log("Nothing to delete.");
  process.exit(0);
}

git(["rm", "--", ...repositoryPaths], { stdio: "inherit" });
console.log(`Deleted ${live.length} marked files through Git.`);
