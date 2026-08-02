import { spawn } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";
import { artDir, siteDir, syncArt } from "./sync-art.mjs";
import { attemptDir, stagingDir, syncAttempts } from "./sync-attempts.mjs";
import { exportFeedback } from "./export-feedback.mjs";
import { startPromotionService } from "./promotion-service.mjs";

await syncArt();
await syncAttempts();

const promotionServer = startPromotionService({
  port: Number(process.env.PROMOTION_PORT || 3010),
  appPort: Number(process.env.PORT || 3000),
});

let refreshTimer;
let refreshRunning = false;
let refreshQueued = false;

async function refreshIndex() {
  if (refreshRunning) {
    refreshQueued = true;
    return;
  }

  refreshRunning = true;
  try {
    await syncArt();
  } catch (error) {
    console.error("Could not refresh the art index:", error);
  } finally {
    refreshRunning = false;
    if (refreshQueued) {
      refreshQueued = false;
      await refreshIndex();
    }
  }
}

let attemptRefreshTimer;
let attemptRefreshRunning = false;
let attemptRefreshQueued = false;

async function refreshAttemptIndex() {
  if (attemptRefreshRunning) {
    attemptRefreshQueued = true;
    return;
  }

  attemptRefreshRunning = true;
  try {
    await syncAttempts();
  } catch (error) {
    console.error("Could not refresh the attempt index:", error);
  } finally {
    attemptRefreshRunning = false;
    if (attemptRefreshQueued) {
      attemptRefreshQueued = false;
      await refreshAttemptIndex();
    }
  }
}

const artWatcher = watch(artDir, { recursive: true }, (_event, filename) => {
  if (filename && path.extname(filename).toLowerCase() !== ".png") return;
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refreshIndex, 150);
});

const attemptWatcher = watch(
  attemptDir,
  { recursive: true },
  (_event, filename) => {
    if (filename && path.extname(filename).toLowerCase() !== ".png") return;
    clearTimeout(attemptRefreshTimer);
    attemptRefreshTimer = setTimeout(refreshAttemptIndex, 150);
  },
);

const stagingWatcher = watch(
  stagingDir,
  { recursive: true },
  (_event, filename) => {
    if (filename && path.extname(filename).toLowerCase() !== ".png") return;
    clearTimeout(attemptRefreshTimer);
    attemptRefreshTimer = setTimeout(refreshAttemptIndex, 150);
  },
);

const executable = path.join(
  siteDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vinext.cmd" : "vinext",
);
const devArgs = ["dev"];
if (process.env.PORT) devArgs.push("--port", process.env.PORT);
const server = spawn(executable, devArgs, {
  cwd: siteDir,
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: ".wrangler/wrangler.log",
  },
  stdio: "inherit",
});

let exportRunning = false;
async function refreshFeedbackExport() {
  if (exportRunning) return;
  exportRunning = true;
  try {
    await exportFeedback({ quiet: true });
  } catch {
    // The local server may still be starting or restarting.
  } finally {
    exportRunning = false;
  }
}

const initialExportTimer = setTimeout(refreshFeedbackExport, 1_500);
const feedbackExportTimer = setInterval(refreshFeedbackExport, 3_000);

function stop(signal) {
  clearTimeout(refreshTimer);
  clearTimeout(attemptRefreshTimer);
  clearTimeout(initialExportTimer);
  clearInterval(feedbackExportTimer);
  artWatcher.close();
  attemptWatcher.close();
  stagingWatcher.close();
  promotionServer.close();
  if (!server.killed) server.kill(signal);
}

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));

server.on("exit", (code, signal) => {
  clearTimeout(refreshTimer);
  clearTimeout(attemptRefreshTimer);
  clearTimeout(initialExportTimer);
  clearInterval(feedbackExportTimer);
  artWatcher.close();
  attemptWatcher.close();
  stagingWatcher.close();
  promotionServer.close();
  if (signal) process.kill(process.pid, signal);
  process.exitCode = code ?? 1;
});
