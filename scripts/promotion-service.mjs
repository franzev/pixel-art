import { spawn } from "node:child_process";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, "..");
const activationScript = path.join(scriptDir, "activate-redo.mjs");
const stagingPrefix = "work/redo-staging/";

export function validatePromotionRequest(value) {
  if (!value || typeof value !== "object") {
    throw new Error("Promotion request is missing.");
  }
  const candidatePath = String(value.candidatePath ?? "").replaceAll("\\", "/");
  const sourcePath = String(value.sourcePath ?? "").replaceAll("\\", "/");
  const sourceRenderId = String(value.sourceRenderId ?? "");
  const mode = String(value.mode ?? "replace");
  if (
    !candidatePath.startsWith(stagingPrefix) ||
    candidatePath.includes("../") ||
    !candidatePath.toLowerCase().endsWith(".png")
  ) {
    throw new Error("Only a generated candidate from redo staging can be promoted.");
  }
  if (
    sourcePath &&
    (path.posix.isAbsolute(sourcePath) || sourcePath.includes("../"))
  ) {
    throw new Error("The Catalog source path is invalid.");
  }
  if (sourceRenderId && !/^rnd_[0-9a-f]{24}$/.test(sourceRenderId)) {
    throw new Error("The Catalog source identity is invalid.");
  }
  if (mode !== "replace" && mode !== "variant") {
    throw new Error("Promotion mode must be replace or variant.");
  }
  if (!sourcePath || !sourceRenderId) {
    throw new Error(
      "Promotion requires the exact Catalog source path and render identity.",
    );
  }
  return { candidatePath, sourcePath, sourceRenderId, mode };
}

function runActivation(request) {
  const args = [activationScript, "--candidate", request.candidatePath];
  args.push("--mode", request.mode);
  if (request.sourceRenderId) args.push("--source-render-id", request.sourceRenderId);
  if (request.sourcePath) args.push("--source-path", request.sourcePath);

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: siteDir,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    const append = (chunk) => {
      output = `${output}${chunk}`.slice(-20_000);
    };
    child.stdout.on("data", append);
    child.stderr.on("data", append);
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(output.trim());
      else reject(new Error(output.trim() || "Promotion failed."));
    });
  });
}

function sendJson(response, status, value, origin) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  response.end(JSON.stringify(value));
}

export function startPromotionService({ port = 3010, appPort = 3000 } = {}) {
  const allowedOrigins = new Set([
    `http://localhost:${appPort}`,
    `http://127.0.0.1:${appPort}`,
  ]);
  const server = createServer(async (request, response) => {
    const origin = request.headers.origin ?? "";
    if (!allowedOrigins.has(origin)) {
      sendJson(response, 403, { error: "Promotion is available only from the local review site." });
      return;
    }
    if (request.method === "OPTIONS") {
      sendJson(response, 204, {}, origin);
      return;
    }
    if (request.method !== "POST" || request.url !== "/promote") {
      sendJson(response, 404, { error: "Not found." }, origin);
      return;
    }

    let body = "";
    request.setEncoding("utf8");
    for await (const chunk of request) {
      body += chunk;
      if (body.length > 20_000) {
        sendJson(response, 413, { error: "Request is too large." }, origin);
        return;
      }
    }

    try {
      const promotion = validatePromotionRequest(JSON.parse(body));
      const output = await runActivation(promotion);
      sendJson(response, 200, { ok: true, output }, origin);
    } catch (error) {
      sendJson(response, 400, {
        error: error instanceof Error ? error.message : "Promotion failed.",
      }, origin);
    }
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`Safe promotion service listening on http://127.0.0.1:${port}`);
  });
  return server;
}
