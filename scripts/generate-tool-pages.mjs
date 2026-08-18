/**
 * Generate tools/{slug}.html for every online catalog tool.
 * Run: node scripts/generate-tool-pages.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "tools");

function loadBrowserIife(filePath, exportName) {
  const code = fs.readFileSync(filePath, "utf8");
  const sandbox = { window: {}, globalThis: {}, console };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.window[exportName] || sandbox[exportName];
}

const catalog = loadBrowserIife(path.join(ROOT, "scripts", "tool-catalog.js"), "WPSToolCatalog");
const tools = catalog.allOnlineTools();

let crawled = {};
const crawledPath = path.join(ROOT, "scripts", "_crawled-wps-content.json");
if (fs.existsSync(crawledPath)) {
  crawled = JSON.parse(fs.readFileSync(crawledPath, "utf8"));
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function demoPanelHtml() {
  return `
  <aside class="demo-panel is-hidden" aria-label="Demo controls" aria-hidden="true">
    <h4>Demo controls (for R&amp;D)</h4>
    <p style="margin:0 0 8px;color:var(--soft-muted)">Quota &amp; Intercept scenarios:</p>
    <div class="demo-scenario-btns" id="demo-scenarios">
      <button type="button" data-scenario="guest_exhausted">① Free — quota exhausted</button>
      <button type="button" data-scenario="guest_file_limit">② Free — file size limit</button>
      <button type="button" data-scenario="guest_count_limit">③ Free — too many files</button>
      <button type="button" data-scenario="member_ok">④ Pro+ — normal use</button>
      <button type="button" data-scenario="member_file_limit">⑤ Pro+ — file &gt;200 MB</button>
    </div>
    <p style="margin:8px 0 4px;color:var(--soft-muted)">ModelConverter API scenarios:</p>
    <div class="demo-scenario-btns" id="mc-scenarios">
      <button type="button" data-mc-scenario="normal" class="is-active">3D ① Normal API Pipeline</button>
      <button type="button" data-mc-scenario="403">3D ② 403 Capability Not Granted</button>
      <button type="button" data-mc-scenario="422_LIMIT">3D ③ 422 Limit Exceeded</button>
      <button type="button" data-mc-scenario="422_VALIDATION">3D ④ 422 Checksum Failed</button>
      <button type="button" data-mc-scenario="FAILED">3D ⑤ Task FAILED</button>
    </div>
    <label style="margin-top:8px">Uses left (manual)
      <select id="demo-uses">
        <option value="10">10</option>
        <option value="9">9</option>
        <option value="8">8</option>
        <option value="7">7</option>
        <option value="6">6</option>
        <option value="5">5</option>
        <option value="4">4</option>
        <option value="3">3</option>
        <option value="2">2</option>
        <option value="1">1</option>
        <option value="0">0</option>
      </select>
    </label>
    <button class="btn-ghost" type="button" id="demo-reset" style="margin-top:8px;width:100%">Reset all state</button>
  </aside>`;
}

function scriptsHtml() {
  return `
  <script src="../scripts/wps-links.js"></script>
  <script src="../scripts/model-converter-client.js"></script>
  <script src="../scripts/format-hubs-3d.js"></script>
  <script src="../scripts/tool-catalog.js"></script>
  <script src="../scripts/tool-routes.js"></script>
  <script src="../scripts/site-nav-3d.js"></script>
  <script src="../scripts/tools-directory.js"></script>
  <script src="../scripts/site-chrome.js"></script>
  <script src="../scripts/demo-panel.js"></script>
  <script src="../scripts/tool-quota-flow.js"></script>
  <script src="../scripts/tool-quota-modals.js"></script>
  <script src="../scripts/tool-content-library.js"></script>
  <script src="../scripts/tool-content-blocks.js"></script>
  <script src="../scripts/tool-page.js"></script>
  <script src="../scripts/tool-workflows-extra.js"></script>
  <script src="../scripts/tool-boot.js"></script>`;
}

function ratioPickerHtml(tool) {
  if (!tool.showRatio) return "";
  return `
          <div class="ratio-picker" id="ratio-picker" role="group" aria-label="Compression ratio">
            <button class="ratio-btn" type="button" data-ratio="HD">HD</button>
            <button class="ratio-btn is-selected" type="button" data-ratio="Recommended">Recommended</button>
            <button class="ratio-btn" type="button" data-ratio="Smallest">Smallest</button>
          </div>`;
}

function formatHubHtml(tool) {
  // Only Convert PDF + 3D hubs expose From/To chips. Fixed A→B tools use the regular upload UI.
  if (tool.type !== "pdf-convert" && tool.type !== "3d-conversion") return "";
  const is3d = tool.type === "3d-conversion";
  const gridClass = is3d ? "format-hub-grid format-hub-grid--aligned" : "format-hub-grid";
  const fromClass = is3d ? "format-group format-group--from" : "format-group";
  const toClass = is3d ? "format-group format-group--to" : "format-group";
  const titleClass = is3d ? ' class="format-group-title"' : "";
  return `
        <div class="format-hub" id="format-hub">
          <div class="${gridClass}">
            <div class="${fromClass}">
              <h4${titleClass}>Convert from</h4>
              <div class="format-chips" id="chips-from" role="listbox" aria-label="Input format"></div>
            </div>
            <div class="format-arrow" aria-hidden="true">
              <span class="material-symbols-rounded">arrow_forward</span>
            </div>
            <div class="${toClass}">
              <h4${titleClass}>Convert to</h4>
              <div class="format-chips" id="chips-to" role="listbox" aria-label="Output format"></div>
            </div>
          </div>
        </div>`;
}

function etaBannerHtml(tool) {
  if (tool.type === "3d-conversion") return "";
  return `<div class="eta-banner" id="eta-banner" hidden></div>`;
}

function stepsHtml(tool) {
  const labels = tool.stepLabels || ["Upload", "Process", "Download"];
  return labels.map((label, i) =>
    `<span class="workspace-step${i === 0 ? " is-active" : ""}"><span class="step-num">${i + 1}</span> ${escapeHtml(label)}</span>`
  ).join("\n            ");
}

function heroHtml(tool, h1, is3d) {
  if (!is3d) {
    return `
    <section class="tool-hero">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../homepage.html">Home</a>
        <span aria-hidden="true">›</span>
        <span id="crumb-title">${escapeHtml(tool.title)}</span>
      </nav>
      <h1 id="page-title">${escapeHtml(h1)}</h1>
      <p class="subtitle" id="page-subtitle">${escapeHtml(tool.subtitle)}</p>
    </section>`;
  }

  return `
    <section class="tool-hero tool-hero-v2">
      <div class="tool-hero-orbs" aria-hidden="true">
        <span class="tool-hero-orb tool-hero-orb--a"></span>
        <span class="tool-hero-orb tool-hero-orb--b"></span>
        <span class="tool-hero-orb tool-hero-orb--c"></span>
      </div>
      <nav class="breadcrumb bread-box" aria-label="Breadcrumb">
        <a class="bread-home" href="../homepage.html">Home</a>
        <span class="bread-chevron" aria-hidden="true">›</span>
        <span class="bread-tool" id="crumb-title">${escapeHtml(h1)}</span>
      </nav>
      <div class="hero-copy">
        <h1 class="title" id="page-title">${escapeHtml(h1)}</h1>
        <p class="subtitle desc" id="page-subtitle">${escapeHtml(tool.subtitle)}</p>
      </div>
    </section>`;
}

function quotaControlsHtml(is3d = false) {
  const icon = is3d ? "auto_awesome" : "bolt";
  const quotaText = is3d
    ? "Daily <strong>10</strong> of 10"
    : "<strong>10</strong> of 10 free uses left today";
  const quotaAction = is3d
    ? '<button class="quota-info-btn" type="button" id="quota-info" aria-label="Get more uses" title="View quota options">Get more uses</button>'
    : '<button class="quota-info-btn" type="button" id="quota-info" aria-label="Quota rules" title="Quota rules">i</button>';

  return `
          <div class="quota-wrap">
            <span class="quota-badge" id="quota-badge">
              <span class="material-symbols-rounded quota-badge-icon" aria-hidden="true">${icon}</span>
              <span id="quota-text">${quotaText}</span>
            </span>
            ${quotaAction}
            <div class="quota-tooltip" id="quota-tooltip" role="tooltip"></div>
          </div>`;
}

function workspaceToolbarHtml(tool, is3d) {
  if (is3d) return "";
  return `
        <div class="workspace-toolbar">
          <div class="workspace-steps" id="workspace-steps">
            ${stepsHtml(tool)}
          </div>
${quotaControlsHtml(false)}
        </div>`;
}

function quotaBarHtml(is3d) {
  if (!is3d) return "";
  return `
      <div class="tool-quota-bar">
        <div class="tool-quota-bar__row">
${quotaControlsHtml(true)}
        </div>
      </div>`;
}

function uploadZoneHtml({ dropLabel, fileNoun, dropSub, selectLabel, uploadIcon, is3d, fileBadge }) {
  if (!is3d) {
    return `
          <div class="upload-zone" id="upload-zone">
            <div class="upload-icon" aria-hidden="true"><span class="material-symbols-rounded">${escapeHtml(uploadIcon)}</span></div>
            <h3 id="drop-title">Drop ${escapeHtml(dropLabel)} ${fileNoun} here</h3>
            <p id="drop-sub">${escapeHtml(dropSub)}</p>
            <button class="btn-upload" type="button" id="btn-select-file">
              <span class="material-symbols-rounded">add</span>
              <span id="select-label">${escapeHtml(selectLabel)}</span>
            </button>
          </div>`;
  }

  return `
          <div class="upload-zone tool-dashed-zone hero-dropzone" id="upload-zone">
            <svg class="tool-drop-outline" viewBox="0 0 1150 526" preserveAspectRatio="none" aria-hidden="true">
              <rect x="1" y="1" width="1148" height="524" rx="14" ry="14" vector-effect="non-scaling-stroke"></rect>
            </svg>
            <div class="hero-center">
              <div class="upload-icon hero-icon-tile" aria-hidden="true">
                <span class="hero-file-sheet">
                  <span class="hero-file-badge">${escapeHtml(fileBadge)}</span>
                </span>
              </div>
              <div class="hero-copy-block">
                <h3 class="hero-upload-title" id="drop-title">Drop ${escapeHtml(dropLabel)} ${fileNoun} here</h3>
                <p class="hero-upload-sub" id="drop-sub">${escapeHtml(dropSub)}</p>
              </div>
              <button class="btn-upload hero-select-btn" type="button" id="btn-select-file">
                <span class="material-symbols-rounded">add</span>
                <span id="select-label">${escapeHtml(selectLabel)}</span>
              </button>
            </div>
            <p class="upload-privacy-note">
              <span class="material-symbols-rounded" aria-hidden="true">shield</span>
              Your files stay private and are deleted after processing.
            </p>
          </div>`;
}

function metaDescription(tool, crawl) {
  if (crawl?.description && !/Free PDF Tools Online/i.test(crawl.description)) {
    return crawl.description.slice(0, 160);
  }
  return (tool.subtitle || "").slice(0, 160);
}

function renderPage(tool) {
  const crawl = crawled[tool.slug] || {};
  const pageTitle = `${tool.pageTitle} | WPS PDF Tools`;
  const desc = metaDescription(tool, crawl);
  const h1 = (crawl.h1 && !/^Free PDF Tools Online$/i.test(crawl.h1)) ? crawl.h1 : tool.pageTitle;
  const hasFormatHub = tool.type === "pdf-convert" || tool.type === "3d-conversion";
  const isFixedPair = Boolean(tool.fixedPair);
  const isConvert = hasFormatHub || isFixedPair;
  const uploadIcon = tool.uploadIcon || (isConvert ? "sync_alt" : "upload_file");
  const accept = tool.accept || (isConvert ? "" : ".pdf,application/pdf");
  const dropLabel = isFixedPair || hasFormatHub
    ? (tool.defaultFrom || "files")
    : "PDF";
  const selectLabel = isFixedPair || hasFormatHub
    ? `Select ${tool.defaultFrom || "File"} File`
    : "Select PDF File";
  const dropSub = isFixedPair
    ? `Convert to ${tool.defaultTo || "output"}`
    : "or click to select from your device";
  const continueLabel = tool.continueLabel || (isConvert ? "Continue to convert" : "Continue");
  const resultTitle = tool.resultTitle || (isConvert ? "Conversion complete" : "Complete");
  const downloadLabel = tool.downloadLabel || "Download result";
  const singleFile = Boolean(tool.singleFile) || tool.workflow === "split" || tool.workflow === "sign";
  const multipleAttr = singleFile ? "" : " multiple";
  const fileNoun = singleFile ? "file" : "files";
  const is3d = tool.type === "3d-conversion";
  const bodyClass = is3d ? "tool-page tool-page--3d-parity" : "tool-page";
  const parityStylesheet = is3d
    ? '\n  <link rel="stylesheet" href="../tool-3d-parity.css" />'
    : "";
  const hero = heroHtml(tool, h1, is3d);
  const workspaceControlsOpen = is3d ? '\n      <div class="workspace-controls">' : "";
  const workspaceControlsClose = is3d ? "\n      </div>" : "";
  const uploadZone = uploadZoneHtml({
    dropLabel,
    fileNoun,
    dropSub,
    selectLabel,
    uploadIcon,
    is3d,
    fileBadge: tool.title.charAt(0)
  });

  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#ffffff" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700&family=Roboto:wght@400;500;600&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
  <link rel="stylesheet" href="../site-chrome.css" />
  <link rel="stylesheet" href="../tool-shell.css" />
  <link rel="stylesheet" href="../tool-home-sections.css" />${parityStylesheet}
</head>
<body class="${bodyClass}" data-tool-slug="${escapeHtml(tool.slug)}" data-tool-id="${escapeHtml(tool.slug)}" data-asset-base="../">
  <div id="site-chrome-header"></div>

  <main class="tool-page-main">
${hero}

    <section class="tool-workspace-wrap${is3d ? " tool-workspace-wrap--3d" : ""}">
${quotaBarHtml(is3d)}
      <div class="workspace-card${is3d ? " workspace-card--3d" : ""}">${workspaceControlsOpen}
${formatHubHtml(tool)}
${etaBannerHtml(tool)}
${workspaceToolbarHtml(tool, is3d)}
${workspaceControlsClose}

        <div class="workspace-body" id="workspace-body">
          ${ratioPickerHtml(tool)}
${uploadZone}

          <div class="processing-panel" id="processing-panel" hidden>
            <div class="processing-panel-head">
              <h3 id="progress-phase">Processing</h3>
              <button class="batch-file-cancel" type="button" id="btn-pipeline-cancel" aria-label="Cancel">
                <span class="material-symbols-rounded">close</span>
              </button>
            </div>
            <p class="process-meta"><span id="process-filename">file</span> · <span id="process-filesize">0 KB</span></p>
            <div class="progress-track"><div class="progress-bar" id="progress-bar"></div></div>
            <div class="progress-row">
              <span id="progress-percent">0%</span>
              <span id="progress-eta" class="progress-eta">Calculating…</span>
            </div>
            <p class="progress-hint" id="progress-hint" hidden></p>
          </div>

          <div class="upload-success-panel" id="upload-success-panel" hidden>
            <div class="upload-success-icon" aria-hidden="true"><span class="material-symbols-rounded">cloud_done</span></div>
            <h3>Upload complete</h3>
            <p class="process-meta"><span id="upload-success-filename">file</span> · <span id="upload-success-filesize">0 KB</span></p>
            <div class="upload-success-actions">
              <button class="btn-primary" type="button" id="btn-upload-continue">${escapeHtml(continueLabel)}</button>
            </div>
          </div>

          <div class="batch-panel" id="batch-panel" hidden>
            <ul class="batch-file-list" id="batch-file-list" role="list"></ul>
            <div class="batch-footer" id="batch-footer">
              <button class="btn-batch-zip" type="button" id="btn-batch-zip" hidden>
                <span class="material-symbols-rounded">folder_zip</span>
                Download all as ZIP
              </button>
              <button class="btn-secondary btn-batch-client" type="button" id="btn-batch-client" hidden>
                Download for All Features
              </button>
              <p class="result-client-hint" id="batch-client-hint" hidden>Download Desktop to get more free quota</p>
            </div>
          </div>

          <div class="result-panel" id="result-panel" hidden data-visible="false">
            <div class="result-icon" aria-hidden="true"><span class="material-symbols-rounded">check_circle</span></div>
            <h3>${escapeHtml(resultTitle)}</h3>
            <p class="process-meta" id="result-filename">output</p>
            <div class="result-stats" id="result-stats"></div>
            <div class="result-actions">
              <a class="btn-download-result" id="download-btn" href="#" download>
                <span class="material-symbols-rounded">download</span>
                <span id="download-label">${escapeHtml(downloadLabel)}</span>
              </a>
              <div class="result-client-cta">
                <button class="btn-secondary" type="button" id="btn-download-client">Download for All Features</button>
                <p class="result-client-hint">Download Desktop to get more free quota</p>
              </div>
            </div>
          </div>

          <div id="special-workflow" hidden></div>
        </div>

        <div class="workspace-back-wrap" id="workspace-back-wrap" hidden>
          <button class="btn-workspace-back" type="button" id="btn-workspace-back">
            <span class="material-symbols-rounded" aria-hidden="true">arrow_back</span>
            Back
          </button>
        </div>
      </div>
    </section>

    <input type="file" id="file-input"${accept ? ` accept="${escapeHtml(accept)}"` : ""}${multipleAttr} hidden />
    <div id="tool-content-mount"></div>
  </main>

  <div id="site-chrome-footer"></div>

  ${demoPanelHtml()}
  ${scriptsHtml()}
</body>
</html>
`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const written = [];
for (const tool of tools) {
  const file = path.join(OUT_DIR, `${tool.slug}.html`);
  fs.writeFileSync(file, renderPage(tool), "utf8");
  written.push(path.relative(ROOT, file).replace(/\\/g, "/"));
  console.log("wrote", written[written.length - 1]);
}

console.log(`\nGenerated ${written.length} tool pages.`);
