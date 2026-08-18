import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fork } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
};

const SSE_CLIENTS = new Set();

const LIVE_RELOAD_CLIENT_SCRIPT = `
<!-- [Dev Hot Reload Inject] -->
<script id="__live_reload__">
(() => {
  if (window.__LIVE_RELOAD_INITIALIZED__) return;
  window.__LIVE_RELOAD_INITIALIZED__ = true;

  let retryDelay = 1000;
  let es = null;

  function connect() {
    es = new EventSource('/__live_reload_stream');

    es.onopen = () => {
      retryDelay = 1000;
      console.log('%c[Hot Reload]%c Connected to dev server', 'color:#5948f3;font-weight:bold', 'color:inherit');
    };

    es.addEventListener('css-update', (event) => {
      try {
        const data = JSON.parse(event.data);
        const filename = data.file ? data.file.split(/[\\\\/]/).pop() : '';
        console.log('%c[Hot Reload]%c Fast updating CSS: ' + filename, 'color:#5948f3;font-weight:bold', 'color:inherit');

        const links = document.querySelectorAll('link[rel="stylesheet"]');
        let matched = false;
        links.forEach((link) => {
          const href = link.getAttribute('href');
          if (href && (href.includes(filename) || !filename)) {
            const url = new URL(link.href, location.href);
            url.searchParams.set('_hmr', Date.now());
            link.href = url.toString();
            matched = true;
          }
        });
        if (!matched) {
          location.reload();
        }
      } catch (err) {
        location.reload();
      }
    });

    es.addEventListener('full-reload', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('%c[Hot Reload]%c Reloading page due to: ' + (data.file || 'changes'), 'color:#5948f3;font-weight:bold', 'color:inherit');
      } catch (e) {}
      location.reload();
    });

    es.onerror = () => {
      es.close();
      setTimeout(connect, retryDelay);
      retryDelay = Math.min(retryDelay * 1.5, 5000);
    };
  }

  connect();
})();
</script>
`;

function broadcastMessage(eventType, data = {}) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of SSE_CLIENTS) {
    try {
      client.write(payload);
    } catch (e) {
      SSE_CLIENTS.delete(client);
    }
  }
}

let isGenerating = false;
let pendingGenerate = false;

function triggerToolPagesGeneration(cb) {
  if (isGenerating) {
    pendingGenerate = true;
    return;
  }
  isGenerating = true;
  console.log("\x1b[36m[Generator]\x1b[0m Regenerating tool pages...");
  const child = fork(path.join(__dirname, "generate-tool-pages.mjs"), [], {
    cwd: ROOT_DIR,
    stdio: "inherit",
  });
  child.on("close", (code) => {
    isGenerating = false;
    if (code === 0) {
      console.log("\x1b[32m[Generator]\x1b[0m Tool pages updated successfully.");
    }
    if (cb) cb();
    if (pendingGenerate) {
      pendingGenerate = false;
      triggerToolPagesGeneration(() => broadcastMessage("full-reload", { file: "generated pages" }));
    }
  });
}

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".vite",
  "dist",
  ".playwright-mcp",
  "agent-transcripts",
  "terminals",
]);

function shouldWatchFile(filepath) {
  const parts = filepath.split(path.sep);
  for (const p of parts) {
    if (IGNORED_DIRS.has(p)) return false;
  }
  const ext = path.extname(filepath).toLowerCase();
  return [".html", ".css", ".js", ".mjs", ".json", ".svg", ".png", ".jpg", ".webp"].includes(ext);
}

let reloadTimer = null;

function setupFileWatcher() {
  const watchOpts = { recursive: true };
  try {
    fs.watch(ROOT_DIR, watchOpts, (eventType, filename) => {
      if (!filename) return;
      const fullPath = path.join(ROOT_DIR, filename);
      if (!shouldWatchFile(fullPath)) return;

      const normalized = filename.replace(/\\/g, "/");
      const ext = path.extname(filename).toLowerCase();

      // Check if generator-related scripts changed
      if (
        normalized.startsWith("scripts/generate-tool-pages") ||
        normalized.startsWith("scripts/tool-catalog") ||
        normalized.startsWith("scripts/tool-content-blocks") ||
        normalized.startsWith("scripts/tool-content-library")
      ) {
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => {
          triggerToolPagesGeneration(() => {
            broadcastMessage("full-reload", { file: normalized });
          });
        }, 150);
        return;
      }

      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(() => {
        if (ext === ".css") {
          console.log(`\x1b[35m[HMR]\x1b[0m CSS updated: ${normalized}`);
          broadcastMessage("css-update", { file: normalized });
        } else {
          console.log(`\x1b[34m[Hot Reload]\x1b[0m File changed: ${normalized}`);
          broadcastMessage("full-reload", { file: normalized });
        }
      }, 100);
    });
    console.log("\x1b[32m[Watcher]\x1b[0m Watching project files for hot reload.");
  } catch (err) {
    console.error("Watch error:", err);
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // SSE stream endpoint
  if (pathname === "/__live_reload_stream") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write(":\n\n");
    SSE_CLIENTS.add(res);

    req.on("close", () => {
      SSE_CLIENTS.delete(res);
    });
    return;
  }

  // Rewrite root or directory requests to homepage.html or index.html
  if (pathname === "/" || pathname === "") {
    if (fs.existsSync(path.join(ROOT_DIR, "homepage.html"))) {
      pathname = "/homepage.html";
    } else {
      pathname = "/index.html";
    }
  }

  let filePath = path.join(ROOT_DIR, pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const indexInDir = path.join(filePath, "index.html");
    if (fs.existsSync(indexInDir)) {
      filePath = indexInDir;
    }
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found: " + pathname);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (ext === ".html") {
    fs.readFile(filePath, "utf8", (err, html) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading HTML: " + err.message);
        return;
      }
      let injected = html;
      if (html.includes("</body>")) {
        injected = html.replace("</body>", `${LIVE_RELOAD_CLIENT_SCRIPT}\n</body>`);
      } else {
        injected = html + LIVE_RELOAD_CLIENT_SCRIPT;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(injected);
    });
    return;
  }

  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(filePath).pipe(res);
});

function startServer(port = 8000, retries = 5) {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && retries > 0) {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1, retries - 1);
    } else {
      console.error("Server start error:", err);
    }
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`\n\x1b[32m🚀 Dev Server running with Hot Reload!\x1b[0m`);
    console.log(`  ➜  \x1b[1mLocal:\x1b[0m   http://localhost:${port}/`);
    console.log(`  ➜  \x1b[1mTools:\x1b[0m   http://localhost:${port}/tools/mesh-converter.html`);
    console.log(`  ➜  \x1b[1mCAD:\x1b[0m     http://localhost:${port}/tools/cad-converter.html`);
    console.log(`  ➜  \x1b[1mBIM:\x1b[0m     http://localhost:${port}/tools/bim-converter.html\n`);
    setupFileWatcher();
  });
}

const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const initialPort = portIndex !== -1 ? parseInt(args[portIndex + 1], 10) : 8000;

startServer(initialPort);
