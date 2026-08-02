import { createHash } from "node:crypto";
import { constants } from "node:fs";
import {
  appendFile,
  copyFile,
  lstat,
  mkdir,
  readdir,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncAttempts } from "./sync-attempts.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const siteDir = path.resolve(path.dirname(scriptPath), "..");
const defaultArchiveRoot = path.join(siteDir, "archive", "render-attempts");

export function normalizeSeries(value) {
  const normalized = String(value ?? "")
    .replaceAll("\\", "/")
    .replace(/^\/+|\/+$/g, "");
  const parts = normalized.split("/").filter(Boolean);
  if (
    parts.length < 3 ||
    parts.some((part) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part))
  ) {
    throw new Error(
      "Attempt series must be lowercase kebab-case: <category>/<collection>/<concept>",
    );
  }
  return parts.join("/");
}

export function attemptFilename(number) {
  if (!Number.isSafeInteger(number) || number < 1 || number > 9999) {
    throw new Error("Attempt number must be an integer from 1 through 9999");
  }
  return `attempt-${String(number).padStart(2, "0")}.png`;
}

export function nextAttemptNumber(entries) {
  const numbers = entries
    .map((entry) => entry.match(/^attempt-(\d{2,})\.png$/i))
    .filter(Boolean)
    .map((match) => Number(match[1]));
  return numbers.length === 0 ? 1 : Math.max(...numbers) + 1;
}

async function sha256(file) {
  const hash = createHash("sha256");
  const bytes = await import("node:fs").then(({ createReadStream }) =>
    createReadStream(file),
  );
  for await (const chunk of bytes) hash.update(chunk);
  return hash.digest("hex");
}

export async function saveRenderAttempt({
  source,
  series,
  attempt,
  archiveRoot = defaultArchiveRoot,
}) {
  const sourcePath = path.resolve(siteDir, source);
  const sourceStat = await lstat(sourcePath);
  if (!sourceStat.isFile() || sourceStat.isSymbolicLink()) {
    throw new Error("Attempt source must be a regular, non-symlink file");
  }
  if (path.extname(sourcePath).toLowerCase() !== ".png") {
    throw new Error("Attempt source must be a PNG");
  }

  const normalizedSeries = normalizeSeries(series);
  const seriesDirectory = path.join(
    archiveRoot,
    ...normalizedSeries.split("/"),
  );
  await mkdir(seriesDirectory, { recursive: true });

  const entries = await readdir(seriesDirectory);
  const number =
    attempt === undefined ? nextAttemptNumber(entries) : Number(attempt);
  const filename = attemptFilename(number);
  const destination = path.join(seriesDirectory, filename);

  try {
    await copyFile(sourcePath, destination, constants.COPYFILE_EXCL);
  } catch (error) {
    if (error?.code === "EEXIST") {
      throw new Error(
        `${filename} already exists; attempt archives are never overwritten`,
      );
    }
    throw error;
  }

  const hash = await sha256(destination);
  const record = {
    attempt: number,
    file: filename,
    sha256: hash,
    savedAt: new Date().toISOString(),
  };
  await appendFile(
    path.join(seriesDirectory, "attempt-log.jsonl"),
    `${JSON.stringify(record)}\n`,
  );

  return {
    ...record,
    path: path.relative(siteDir, destination).split(path.sep).join("/"),
    series: normalizedSeries,
  };
}

function parseOptions(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--source") options.source = argv[++index];
    else if (value === "--series") options.series = argv[++index];
    else if (value === "--attempt") options.attempt = argv[++index];
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (!options.source || !options.series) {
    throw new Error(
      "Usage: npm run render:save-attempt -- --source <generated.png> --series <category>/<collection>/<concept> [--attempt <number>]",
    );
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  try {
    const result = await saveRenderAttempt(parseOptions(process.argv.slice(2)));
    await syncAttempts();
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
