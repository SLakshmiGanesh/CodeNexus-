const fs = require("fs");
const http = require("http");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const buildDir = path.join(rootDir, "build");
const port = Number(process.env.PORT || 3000);

loadDotEnv(path.join(rootDir, ".env"));

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").replace(/^['"]|['"]$/g, "");
    }
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        req.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => resolve(body ? JSON.parse(body) : {}));
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function fallbackReply(message) {
  return [
    "I can help with this, but the Anthropic API key is not configured on the backend yet.",
    "",
    `Your prompt was: ${message}`,
    "",
    "Set ANTHROPIC_API_KEY in .env to enable live AI tutoring.",
  ].join("\n");
}

async function handleChat(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { Allow: "POST" });
    res.end("Method not allowed");
    return;
  }

  const body = await readBody(req);
  const { system, messages, max_tokens: maxTokens = 1000 } = body || {};
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    sendJson(res, 200, {
      content: [{ type: "text", text: fallbackReply(messages?.[0]?.content || "") }],
    });
    return;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  const data = await response.json();
  sendJson(res, response.status, response.ok ? data : {
    error: data.error?.message || "Anthropic API request failed",
  });
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  const resolvedPath = path.resolve(buildDir, `.${requestedPath}`);
  const indexPath = path.join(buildDir, "index.html");

  if (!resolvedPath.startsWith(buildDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  const filePath = fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()
    ? resolvedPath
    : indexPath;

  if (!fs.existsSync(filePath)) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Build output is missing. Run the local build step first.");
    return;
  }

  res.writeHead(200, {
    "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/api/health") {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.url === "/api/chat") {
      await handleChat(req, res);
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
});

server.listen(port, () => {
  console.log(`CP-Mentor running at http://localhost:${port}`);
});
