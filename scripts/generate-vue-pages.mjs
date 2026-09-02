import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localeTools = [
  { dir: "en", htmlLang: "en-US" },
  { dir: "zh", htmlLang: "zh-Hant-TW" }
];

function loadBrowserIife(filePath, exportName) {
  const code = fs.readFileSync(filePath, "utf8");
  const sandbox = { window: {}, globalThis: {}, console };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.window[exportName] || sandbox[exportName];
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const catalog = loadBrowserIife(path.join(root, "src", "runtime", "tool-catalog.js"), "WPSToolCatalog");
const tools = catalog.allOnlineTools();
const crawledPath = path.join(root, "scripts", "_crawled-wps-content.json");
const crawled = fs.existsSync(crawledPath) ? JSON.parse(fs.readFileSync(crawledPath, "utf8")) : {};
const homepageHead = fs.readFileSync(path.join(root, "src", "content", "homepage-head.html"), "utf8");

function metaDescription(tool) {
  const description = crawled[tool.slug]?.description;
  return description && !/Free PDF Tools Online/i.test(description)
    ? description.slice(0, 160)
    : (tool.subtitle || "").slice(0, 160);
}

function homepageHtml() {
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
${homepageHead}
  <link rel="stylesheet" href="/src/styles/homepage.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/entries/home/main.js"></script>
</body>
</html>
`;
}

function toolHtml(tool, locale) {
  const is3d = tool.type === "3d-conversion";
  const officialShell = is3d || Boolean(tool.officialShell);
  const bodyClass = is3d
    ? "tool-page tool-page--3d-parity"
    : officialShell
      ? "tool-page tool-page--pdf-parity"
      : "tool-page";
  const description = metaDescription(tool);
  return `<!DOCTYPE html>
<html lang="${locale.htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#ffffff" />
  <title>${escapeHtml(tool.pageTitle)} | WPS PDF Tools</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700&family=Roboto:wght@400;500;600&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body class="${bodyClass}" data-tool-slug="${escapeHtml(tool.slug)}" data-tool-id="${escapeHtml(tool.slug)}" data-asset-base="../../../">
  <div id="app"></div>
  <script type="module" src="../../../src/entries/tool/main.js"></script>
</body>
</html>
`;
}

fs.writeFileSync(path.join(root, "index.html"), homepageHtml(), "utf8");

for (const locale of localeTools) {
  const localeRoot = path.join(root, locale.dir, "pdf-tools");
  for (const tool of tools) {
    const canonicalSlug = tool.slug === "signing-pdf" ? "sign-pdf" : tool.slug;
    const canonicalDir = path.join(localeRoot, canonicalSlug);
    fs.mkdirSync(canonicalDir, { recursive: true });
    fs.writeFileSync(path.join(canonicalDir, "index.html"), toolHtml(tool, locale), "utf8");
  }
}

console.log(`Generated Vue MPA pages: ${tools.length} tools across ${localeTools.length} locales.`);
