/**
 * Shared tool inner page controller (demo).
 */
(function (global) {
  const Links = () => global.WPSLinks;

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function extForFormat(fmt) {
    const map = {
      PDF: "pdf", Word: "docx", Excel: "xlsx", PPT: "pptx", JPG: "jpg", XML: "xml",
      OBJ: "obj", STL: "stl", FBX: "fbx", "GLB/GLTF": "glb", DAE: "dae", "3MF": "3mf", PLY: "ply",
      STEP: "step"
    };
    return map[fmt] || "bin";
  }

  function mimeForExt(ext) {
    const map = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      jpg: "image/jpeg",
      xml: "application/xml",
      txt: "text/plain",
      obj: "model/obj",
      stl: "model/stl",
      fbx: "application/octet-stream",
      glb: "model/gltf-binary",
      dae: "model/vnd.collada+xml",
      "3mf": "model/3mf",
      ply: "application/x-ply",
      step: "application/step"
    };
    return map[ext] || "application/octet-stream";
  }

  function makeRtfFromName(name, from, to) {
    const text = `Converted from ${name} (${from} to ${to}) using WPS PDF Tools demo.`;
    return new Blob([`{\\rtf1\\ansi ${text.replace(/\\/g, "\\\\")} }`], { type: "application/rtf" });
  }

  function formatEta(seconds) {
    const s = Math.max(0, Math.ceil(Number(seconds) || 0));
    if (s <= 0) return "Almost done…";
    if (s < 60) return `~${s}s remaining`;
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return rem ? `~${m}m ${rem}s remaining` : `~${m}m remaining`;
  }

  async function simulateUpload(onProgress, file, shouldAbort) {
    const durationMs = 900 + Math.min(file.size / 12000, 2200);
    const start = performance.now();
    return new Promise((resolve) => {
      const tick = () => {
        if (shouldAbort?.()) {
          resolve(false);
          return;
        }
        const elapsed = performance.now() - start;
        const p = Math.min(1, elapsed / durationMs);
        const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
        onProgress({ percent: Math.round(p * 100), eta: remaining, phase: "Uploading" });
        if (p >= 1) resolve(true);
        else requestAnimationFrame(tick);
      };
      tick();
    });
  }

  async function simulateProcessing(onProgress, durationMs, phaseHint, shouldAbort) {
    const start = performance.now();
    return new Promise((resolve) => {
      const tick = () => {
        if (shouldAbort?.()) {
          resolve(false);
          return;
        }
        const elapsed = performance.now() - start;
        const p = Math.min(1, elapsed / durationMs);
        const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
        const phase = phaseHint
          || (p < 0.15 ? "Preparing" : p < 0.85 ? "Processing" : "Finalizing");
        onProgress({ percent: Math.round(p * 100), eta: remaining, phase });
        if (p >= 1) resolve(true);
        else requestAnimationFrame(tick);
      };
      tick();
    });
  }

  async function processCompress(file, ratio, onProgress, shouldAbort) {
    const ok = await simulateProcessing(
      onProgress,
      2200 + Math.min(file.size / 8000, 1800),
      "Compressing",
      shouldAbort
    );
    if (!ok || shouldAbort?.()) return null;
    const reduction = ratio === "Smallest" ? 0.55 : ratio === "Recommended" ? 0.72 : 0.88;
    const outSize = Math.max(1024, Math.round(file.size * reduction));
    const buffer = await file.arrayBuffer();
    if (shouldAbort?.()) return null;
    const blob = new Blob([buffer], { type: "application/pdf" });
    const base = file.name.replace(/\.pdf$/i, "") || "document";
    return {
      blob,
      filename: `${base}_compressed_${ratio.toLowerCase()}.pdf`,
      stats: {
        originalSize: file.size,
        outputSize: outSize,
        saved: file.size - outSize,
        ratio
      }
    };
  }

  function convertDurationMs(file, profile) {
    // Profiles mirror 3D capability inventory typical ranges (scaled for demo UX).
    if (profile === "mesh") return 4500 + Math.min(file.size / 4000, 12000);
    if (profile === "cad") return 7000 + Math.min(file.size / 3000, 18000);
    if (profile === "bim") return 9000 + Math.min(file.size / 2500, 22000);
    return 2600 + Math.min(file.size / 6000, 2000);
  }

  async function processConvert(file, from, to, onProgress, options) {
    const profile = options?.etaProfile || "pdf";
    const duration = convertDurationMs(file, profile);
    const phaseHint = profile === "pdf" ? "Converting" : "Converting 3D model";
    const shouldAbort = options?.shouldAbort;
    const ok = await simulateProcessing(onProgress, duration, phaseHint, shouldAbort);
    if (!ok || shouldAbort?.()) return null;
    const base = file.name.replace(/\.[^.]+$/, "") || "document";
    const outExt = extForFormat(to);
    let blob;
    let filename;

    if (to === "Word") {
      blob = makeRtfFromName(file.name, from, to);
      filename = `${base}.doc`;
    } else if (to === "PDF" && from !== "PDF") {
      const pdfHeader = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\nxref\n0 2\ntrailer<</Root 1 0 R>>\n%%EOF";
      blob = new Blob([pdfHeader], { type: "application/pdf" });
      filename = `${base}.pdf`;
    } else if (to === "JPG") {
      if (shouldAbort?.()) return null;
      blob = new Blob([await file.arrayBuffer()], { type: file.type || "image/jpeg" });
      filename = `${base}.jpg`;
    } else {
      const content = `WPS PDF demo output\nSource: ${file.name}\nConversion: ${from} → ${to}\nGenerated: ${new Date().toISOString()}`;
      blob = new Blob([content], { type: mimeForExt(outExt) });
      filename = `${base}.${outExt}`;
    }

    return {
      blob,
      filename,
      stats: { from, to, originalSize: file.size, outputSize: blob.size, etaProfile: profile }
    };
  }

  function acceptForFormat(fmt) {
    const map = {
      PDF: ".pdf,application/pdf",
      Word: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      Excel: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      PPT: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
      JPG: ".jpg,.jpeg,.png,image/jpeg,image/png",
      XML: ".xml,application/xml,text/xml"
    };
    return map[fmt] || "*/*";
  }

  /** Minimal ZIP (store / no compression) for multi-file “Download all”. */
  function crc32(bytes) {
    let c = ~0;
    for (let i = 0; i < bytes.length; i += 1) {
      c ^= bytes[i];
      for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
    return ~c >>> 0;
  }

  function u16(n) {
    return new Uint8Array([n & 255, (n >>> 8) & 255]);
  }

  function u32(n) {
    return new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]);
  }

  function concatBytes(parts) {
    const total = parts.reduce((n, p) => n + p.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    parts.forEach((p) => {
      out.set(p, offset);
      offset += p.length;
    });
    return out;
  }

  async function createZipBlob(entries) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    for (const entry of entries) {
      const nameBytes = encoder.encode(entry.name.replace(/\\/g, "/"));
      const data = entry.data instanceof Uint8Array ? entry.data : new Uint8Array(await entry.data.arrayBuffer());
      const crc = crc32(data);
      const localHeader = concatBytes([
        u32(0x04034b50),
        u16(20),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(nameBytes.length),
        u16(0),
        nameBytes
      ]);
      localParts.push(localHeader, data);
      const centralHeader = concatBytes([
        u32(0x02014b50),
        u16(20),
        u16(20),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(nameBytes.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
        nameBytes
      ]);
      centralParts.push(centralHeader);
      offset += localHeader.length + data.length;
    }

    const centralDir = concatBytes(centralParts);
    const end = concatBytes([
      u32(0x06054b50),
      u16(0),
      u16(0),
      u16(entries.length),
      u16(entries.length),
      u32(centralDir.length),
      u32(offset),
      u16(0)
    ]);
    return new Blob([concatBytes(localParts), centralDir, end], { type: "application/zip" });
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderQuotaTooltip(el, Q) {
    if (!el) return;
    const data = Q.getQuotaRules(document.body?.dataset?.toolSlug || "");
    const Modals = global.WPSQuotaModals;
    el.innerHTML = Modals?.renderQuotaTooltipHTML
      ? Modals.renderQuotaTooltipHTML(data)
      : `<div class="quota-tooltip-head"><strong>${data.title}</strong></div>`;
    Modals?.wireQuotaTooltipActions?.(el);
  }

  function bindQuotaTooltip(els, Q) {
    if (!els.quotaTooltip) return;
    renderQuotaTooltip(els.quotaTooltip, Q);
    const wrap = els.quotaInfo?.closest(".quota-wrap");
    let hideTimer;
    const show = () => { clearTimeout(hideTimer); els.quotaTooltip.classList.add("is-visible"); };
    const hide = () => { hideTimer = setTimeout(() => els.quotaTooltip.classList.remove("is-visible"), 120); };
    els.quotaInfo?.addEventListener("mouseenter", show);
    els.quotaInfo?.addEventListener("focus", show);
    wrap?.addEventListener("mouseleave", hide);
    els.quotaInfo?.addEventListener("blur", hide);
    els.quotaTooltip.addEventListener("mouseenter", show);
    els.quotaTooltip.addEventListener("mouseleave", hide);
  }

  function initToolPage(config) {
    const Q = global.WPSQuotaFlow;
    const els = config.els;
    let lastResultUrl = null;
    let selectedRatio = "Recommended";
    let pendingFile = null;
    let pendingFiles = [];
    let batchItems = [];
    let batchPhase = "idle"; // idle | uploading | ready | processing | done
    let workflowView = "upload";
    let runToken = 0;
    const longRunning = Boolean(config.longRunning);
    const etaProfile = config.etaProfile || "pdf";
    const autoProcessAfterUpload = config.autoProcessAfterUpload !== false;
    const sharedPipeline = Boolean(config.sharedPipeline);
    const singleFile = Boolean(config.singleFile);
    const UPLOAD_PORTION = 0.35;
    const batchActionLabel = config.batchActionLabel
      || (config.mode === "compress" ? "Compress" : "Convert");
    const processVerb = config.processingLabel
      || (config.mode === "compress" ? "Compressing" : "Converting");
    const successLabel = config.batchSuccessLabel
      || (config.mode === "compress" ? "Compression succeeded!" : "Conversion succeeded!");
    const progressHint =
      config.progressHint
      || (etaProfile === "mesh"
        ? "Typical mesh conversion takes about 10s–2 min. Please keep this tab open."
        : etaProfile === "cad"
          ? "Typical CAD conversion takes about 30s–5 min. Please keep this tab open."
          : etaProfile === "bim"
            ? "Typical BIM conversion takes about 1–10 min. Please keep this tab open."
            : "");

    if (singleFile && els.fileInput) {
      els.fileInput.removeAttribute("multiple");
    }

    function estimateProcessSeconds(file) {
      if (config.mode === "compress") {
        return Math.max(1, Math.ceil((2200 + Math.min(file.size / 8000, 1800)) / 1000));
      }
      return Math.max(1, Math.ceil(convertDurationMs(file, etaProfile) / 1000));
    }

    function mapPipelineProgress(phase, localPercent) {
      const p = Math.min(100, Math.max(0, Number(localPercent) || 0)) / 100;
      if (phase === "upload") return Math.round(p * UPLOAD_PORTION * 100);
      return Math.round((UPLOAD_PORTION + p * (1 - UPLOAD_PORTION)) * 100);
    }

    function mapPipelineEta(phase, localEta, file) {
      const local = Math.max(0, Math.ceil(Number(localEta) || 0));
      if (phase === "upload") return local + estimateProcessSeconds(file);
      return local;
    }

    function ensureWorkspaceBack() {
      let wrap = document.getElementById("workspace-back-wrap");
      if (wrap) return wrap;
      wrap = document.createElement("div");
      wrap.id = "workspace-back-wrap";
      wrap.className = "workspace-back-wrap";
      wrap.hidden = true;
      wrap.innerHTML = `
        <button class="btn-workspace-back" type="button" id="btn-workspace-back">
          <span class="material-symbols-rounded" aria-hidden="true">arrow_back</span>
          Back
        </button>`;
      const card = document.querySelector(".workspace-card");
      const host = document.querySelector(".tool-workspace-wrap") || card?.parentElement;
      if (card && host) host.insertBefore(wrap, card.nextSibling);
      else document.getElementById("workspace-body")?.parentElement?.appendChild(wrap);
      return wrap;
    }

    function syncWorkspaceBackVisible() {
      const wrap = ensureWorkspaceBack();
      wrap.hidden = workflowView === "upload";
    }

    function ensureBatchPanel() {
      let panel = document.getElementById("batch-panel");
      if (panel) return panel;
      panel = document.createElement("div");
      panel.id = "batch-panel";
      panel.className = "batch-panel";
      panel.hidden = true;
      panel.innerHTML = `
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
        </div>`;
      const host = els.workspaceBody || document.getElementById("workspace-body");
      const result = document.getElementById("result-panel");
      if (host && result) host.insertBefore(panel, result);
      else host?.appendChild(panel);
      return panel;
    }

    function batchEls() {
      ensureBatchPanel();
      return {
        panel: document.getElementById("batch-panel"),
        list: document.getElementById("batch-file-list"),
        action: document.getElementById("btn-batch-action"),
        zip: document.getElementById("btn-batch-zip")
      };
    }

    function revokeBatchUrls() {
      batchItems.forEach((item) => {
        if (item.downloadUrl) URL.revokeObjectURL(item.downloadUrl);
      });
    }

    function clearBatch() {
      revokeBatchUrls();
      batchItems = [];
      batchPhase = "idle";
    }

    function syncBatchFooter() {
      const { action, zip } = batchEls();
      if (action) action.hidden = true;
      const doneCount = batchItems.filter((i) => i.status === "done").length;
      const showBatchFooter = batchPhase === "done" && doneCount > 0;
      if (zip) zip.hidden = !showBatchFooter;
      const clientBtn = document.getElementById("btn-batch-client");
      const clientHint = document.getElementById("batch-client-hint");
      if (clientBtn) clientBtn.hidden = !showBatchFooter;
      if (clientHint) clientHint.hidden = !showBatchFooter;
    }

    function batchRowHtml(item, index) {
      const icon = `<span class="batch-file-icon" aria-hidden="true"><span class="material-symbols-rounded">picture_as_pdf</span></span>`;
      const name = `<div class="batch-file-main">${icon}<span class="batch-file-name" title="${escapeHtml(item.file.name)}">${escapeHtml(item.file.name)}</span></div>`;
      let mid = "";
      let end = `<div class="batch-file-actions"></div>`;

      if (item.status === "working" || item.status === "queued") {
        mid = item.status === "working"
          ? `
          <div class="batch-file-progress">
            <div class="progress-track"><div class="progress-bar" data-batch-bar style="width:${item.progress || 0}%"></div></div>
            <div class="batch-file-progress-meta">
              <span data-batch-meta>${escapeHtml(item.phaseLabel || "Processing")}… · ${escapeHtml(item.etaText || "")}</span>
              <span data-batch-pct>${item.progress || 0}%</span>
            </div>
          </div>`
          : `<div class="batch-file-status">Waiting…</div>`;
        end = `
          <div class="batch-file-actions">
            <button class="batch-file-cancel" type="button" data-batch-cancel="${index}" aria-label="Cancel">
              <span class="material-symbols-rounded">close</span>
            </button>
          </div>`;
      } else if (item.status === "done" && item.result) {
        const stats = item.result.stats || {};
        let meta = formatBytes(stats.outputSize || item.result.blob.size);
        if (stats.originalSize && stats.outputSize != null) {
          const pct = (-((1 - stats.outputSize / stats.originalSize) * 100)).toFixed(2);
          meta = `${formatBytes(stats.outputSize)} (${pct}%)`;
        } else if (stats.from && stats.to) {
          meta = `${stats.from} → ${stats.to}`;
        }
        mid = `
          <div class="batch-file-status is-ok">
            <span class="batch-status-ok" aria-hidden="true"><span class="material-symbols-rounded">check</span></span>
            <span>${escapeHtml(successLabel)}</span>
            <span class="batch-file-meta">${escapeHtml(meta)}</span>
          </div>`;
        end = `
          <div class="batch-file-actions">
            <a class="batch-file-download" href="${item.downloadUrl}" download="${escapeHtml(item.result.filename)}">Download</a>
          </div>`;
      } else if (item.status === "error") {
        mid = `<div class="batch-file-status">Failed</div>`;
      } else if (item.status === "cancelled") {
        mid = `<div class="batch-file-status is-cancelled">Skipped</div>`;
        end = `
          <div class="batch-file-actions">
            <span class="batch-file-cancel is-skipped" title="Skipped" aria-label="Skipped">
              <span class="material-symbols-rounded">close</span>
            </span>
          </div>`;
      }

      return `<li class="batch-file-row" data-batch-index="${index}" data-batch-status="${item.status}">${name}${mid}${end}</li>`;
    }

    function renderBatchList() {
      const { list } = batchEls();
      if (!list) return;
      list.innerHTML = batchItems.map((item, index) => batchRowHtml(item, index)).join("");
      syncBatchFooter();
    }

    /** Progress ticks only — keep × buttons alive (full innerHTML kills click). */
    function updateBatchProgressRow(index) {
      const item = batchItems[index];
      const { list } = batchEls();
      if (!item || !list) return;
      const row = list.querySelector(`[data-batch-index="${index}"]`);
      if (!row || row.dataset.batchStatus !== item.status || item.status !== "working") {
        renderBatchList();
        return;
      }
      const bar = row.querySelector("[data-batch-bar]");
      const meta = row.querySelector("[data-batch-meta]");
      const pct = row.querySelector("[data-batch-pct]");
      if (!bar || !meta || !pct) {
        renderBatchList();
        return;
      }
      bar.style.width = `${item.progress || 0}%`;
      meta.textContent = `${item.phaseLabel || "Processing"}… · ${item.etaText || ""}`;
      pct.textContent = `${item.progress || 0}%`;
    }

    function getToolSlug() {
      return document.body?.dataset?.toolSlug || "";
    }

    function interceptFiles(files) {
      return global.WPSQuotaModals?.interceptUpload(files, getToolSlug());
    }

    function setView(view) {
      workflowView = view;
      const isBatch = view === "batch";
      els.uploadZone.hidden = view !== "upload";
      els.processingPanel.hidden = view !== "uploading" && view !== "processing";
      els.uploadSuccessPanel && (els.uploadSuccessPanel.hidden = view !== "upload-success");
      els.resultPanel.hidden = view !== "result";
      const batchPanel = document.getElementById("batch-panel");
      if (batchPanel) batchPanel.hidden = !isBatch;
      syncWorkspaceBackVisible();
    }

    function updateProgressUI({ percent, eta, phase, detail }) {
      els.progressBar.style.width = percent + "%";
      els.progressPercent.textContent = percent + "%";
      if (els.progressEta) {
        els.progressEta.textContent = formatEta(eta);
        els.progressEta.classList.add("progress-eta");
      }
      els.progressPhase.textContent = phase;
      const inProcessPhase = phase && /compress|convert|process|upload|verif|task|fetch/i.test(phase);
      els.processingPanel?.classList.toggle("is-long-running", longRunning && inProcessPhase);
      if (els.progressHint) {
        const hintText = detail || (longRunning && inProcessPhase ? progressHint : "");
        els.progressHint.hidden = !hintText;
        if (hintText) els.progressHint.textContent = hintText;
      }
    }

    function updateSteps(active) {
      const steps = els.workspaceSteps?.length
        ? els.workspaceSteps
        : document.querySelectorAll("#workspace-steps .workspace-step");
      steps.forEach((step, i) => {
        step.classList.toggle("is-active", i === active);
      });
    }

    function clearPendingFile() {
      pendingFile = null;
      pendingFiles = [];
    }

    function renderUI() {
      const state = Q.getState();
      config.onSyncDemo?.(state);

      const siteHeader = els.header || document.querySelector(".site-header");
      const chromeLogin = document.getElementById("chrome-login-link");
      if (siteHeader) siteHeader.classList.toggle("is-logged-in", state.loggedIn);
      if (chromeLogin) {
        chromeLogin.textContent = state.loggedIn ? state.userName : "login";
        chromeLogin.href = Links()?.SIGN_IN_URL || "#";
      }

      els.formatHub?.classList.remove("is-dimmed");
      els.workspaceBody?.classList.remove("is-locked");
      els.uploadZone?.classList.remove("is-quota-blocked");
      els.btnSelectFile?.classList.remove("is-quota-blocked");
      els.btnSelectFile?.setAttribute("aria-disabled", "false");

      const summary = Q.getQuotaSummary(state, {
        compact: document.body?.classList.contains("tool-page--3d-parity")
      });
      els.quotaText.innerHTML = summary.sub
        ? `${summary.text} <span class="quota-sub">(${summary.sub})</span>`
        : summary.text;
      renderQuotaTooltip(els.quotaTooltip, Q);

      const busyBatch = workflowView === "batch";
      const busySingle = workflowView === "uploading" || workflowView === "processing" || workflowView === "upload-success";
      if (busyBatch) { setView("batch"); return; }
      if (workflowView === "result" && els.resultPanel.dataset.visible === "true") { setView("result"); return; }
      if (workflowView === "uploading") { setView("uploading"); return; }
      if (workflowView === "upload-success") { setView("upload-success"); return; }
      if (workflowView === "processing") { setView("processing"); return; }
      if (!busySingle) setView("upload");
    }

    function resetResult() {
      if (lastResultUrl) URL.revokeObjectURL(lastResultUrl);
      lastResultUrl = null;
      els.resultPanel.dataset.visible = "false";
      els.resultPanel.hidden = true;
      clearPendingFile();
      clearBatch();
      workflowView = "upload";
      const batchPanel = document.getElementById("batch-panel");
      if (batchPanel) batchPanel.hidden = true;
    }

    async function runSingleFilePipeline(file, token, onTick, isCancelled) {
      const cancelled = () => (token !== runToken) || (isCancelled && isCancelled());

      // If 3D ModelConverter pipeline (CAD / Mesh / BIM), execute full 8-step API pipeline
      if ((etaProfile === "cad" || etaProfile === "mesh" || etaProfile === "bim") && global.ModelConverterClient) {
        const formats = config.getFormats ? config.getFormats() : { from: "STEP", to: "GLB" };
        const mcClient = new global.ModelConverterClient();
        const demoScenario = sessionStorage.getItem("mc_demo_scenario");
        if (demoScenario) mcClient.setScenario(demoScenario);

        return await mcClient.executeConversion(file, {
          fromFormat: formats.from,
          toFormat: formats.to,
          clientReference: `wps_req_${Date.now()}`,
          onProgress: ({ phase, percent, eta, detail }) => {
            if (cancelled()) return;
            onTick({
              phase: "process",
              phaseLabel: phase,
              progress: percent,
              eta: eta,
              detail: detail
            });
          },
          shouldAbort: cancelled
        });
      }

      const uploaded = await simulateUpload(({ percent, eta }) => {
        if (cancelled()) return;
        onTick({
          phase: "upload",
          phaseLabel: "Uploading",
          progress: mapPipelineProgress("upload", percent),
          eta: mapPipelineEta("upload", eta, file)
        });
      }, file, cancelled);
      if (!uploaded || cancelled()) return null;

      const onProcess = ({ percent, eta }) => {
        if (cancelled()) return;
        onTick({
          phase: "process",
          phaseLabel: processVerb,
          progress: mapPipelineProgress("process", percent),
          eta: mapPipelineEta("process", eta, file)
        });
      };

      if (config.mode === "compress") {
        return processCompress(file, selectedRatio, onProcess, cancelled);
      }
      const formats = config.getFormats
        ? config.getFormats()
        : { from: "PDF", to: "Word" };
      return processConvert(file, formats.from, formats.to, onProcess, {
        etaProfile,
        shouldAbort: cancelled
      });
    }

    async function startBatchUpload(list) {
      const consume = Q.consumeUse();
      if (!consume.ok) {
        global.WPSQuotaModals?.openQuotaExhausted();
        renderUI();
        return;
      }

      const token = ++runToken;
      clearBatch();
      batchItems = list.map((file) => ({
        file,
        status: "queued",
        progress: 0,
        phaseLabel: "Waiting",
        etaText: "",
        cancelled: false,
        result: null,
        downloadUrl: null
      }));
      batchPhase = "processing";
      setView("batch");
      updateSteps(1);
      renderBatchList();

      try {
        for (let i = 0; i < batchItems.length; i += 1) {
          if (token !== runToken) return;
          const item = batchItems[i];
          if (item.cancelled) {
            item.status = "cancelled";
            renderBatchList();
            continue;
          }
          item.status = "working";
          item.progress = 0;
          item.phaseLabel = "Uploading";
          item.etaText = formatEta(mapPipelineEta("upload", 3, item.file));
          renderBatchList();

          const result = await runSingleFilePipeline(
            item.file,
            token,
            (tick) => {
              if (item.cancelled) return;
              item.status = "working";
              item.progress = tick.progress;
              item.phaseLabel = tick.phaseLabel;
              item.etaText = formatEta(tick.eta);
              updateBatchProgressRow(i);
            },
            () => item.cancelled
          );
          if (token !== runToken) return;
          if (item.cancelled || !result) {
            item.status = "cancelled";
            renderBatchList();
            continue;
          }
          item.result = result;
          item.downloadUrl = URL.createObjectURL(result.blob);
          item.status = "done";
          item.progress = 100;
          renderBatchList();
        }
        if (token !== runToken) return;
        const doneCount = batchItems.filter((i) => i.status === "done").length;
        if (!doneCount) {
          clearBatch();
          setView("upload");
          updateSteps(0);
        } else {
          batchPhase = "done";
          renderBatchList();
          updateSteps(2);
        }
      } catch (err) {
        if (token !== runToken) return;
        alert("Processing failed in demo: " + err.message);
        clearBatch();
        setView("upload");
      }
      renderUI();
    }

    function showSingleResult(result) {
      lastResultUrl = URL.createObjectURL(result.blob);
      els.resultFilename.textContent = result.filename;
      if (result.stats.ratio) {
        els.resultStats.innerHTML = `
          <span>Original: ${formatBytes(result.stats.originalSize)}</span>
          <span>Compressed: ${formatBytes(result.stats.outputSize)}</span>
          <span class="result-saved">Saved ${formatBytes(result.stats.saved)} (${result.stats.ratio})</span>
        `;
      } else if (result.stats.taskId) {
        els.resultStats.innerHTML = `
          <span>${result.stats.from} → ${result.stats.to}</span>
          <span>Output: ${formatBytes(result.stats.outputSize)}</span>
          <span class="result-sha256" title="SHA-256: ${escapeHtml(result.stats.sha256)}">SHA-256: <code>${escapeHtml((result.stats.sha256 || "").slice(0, 10))}…</code> <span class="material-symbols-rounded" style="font-size:14px;vertical-align:middle;color:#00af57">verified</span></span>
          <span class="result-taskid" style="color:var(--soft-muted);font-size:12px">Task: <code>${escapeHtml(result.stats.taskId)}</code></span>
        `;
      } else {
        els.resultStats.innerHTML = `
          <span>${result.stats.from} → ${result.stats.to}</span>
          <span>Output: ${formatBytes(result.stats.outputSize)}</span>
        `;
      }
      els.downloadBtn.href = lastResultUrl;
      els.downloadBtn.download = result.filename;
      const dlLabel = config.downloadLabel || (config.mode === "compress" ? "Download compressed PDF" : "Download converted file");
      if (els.downloadLabel) els.downloadLabel.textContent = dlLabel;
      els.resultPanel.dataset.visible = "true";
      setView("result");
      updateSteps(2);
    }

    async function startUpload(files) {
      const list = Array.from(files || []).filter(Boolean);
      if (!list.length) return;
      if (singleFile && list.length > 1) {
        global.WPSQuotaModals?.openMemberFileLimit(
          "This 3D converter supports one file at a time. Please select a single file."
        );
        return;
      }
      if (interceptFiles(list)) return;

      if (list.length > 1) {
        await startBatchUpload(list);
        return;
      }

      const consume = Q.consumeUse();
      if (!consume.ok) {
        global.WPSQuotaModals?.openQuotaExhausted();
        renderUI();
        return;
      }

      const token = ++runToken;
      pendingFiles = list;
      const file = list[0];
      pendingFile = file;
      setView("processing");
      els.processFilename.textContent = file.name;
      els.processFilesize.textContent = formatBytes(file.size);
      els.progressBar.style.width = "0%";
      if (els.progressHint) els.progressHint.hidden = true;

      try {
        const result = await runSingleFilePipeline(file, token, (tick) => {
          updateProgressUI({
            percent: tick.progress,
            eta: tick.eta,
            phase: tick.phaseLabel,
            detail: tick.detail
          });
        });
        if (token !== runToken) return;
        if (!result) return;
        clearPendingFile();
        showSingleResult(result);
      } catch (err) {
        if (token !== runToken) return;
        alert("Processing failed in demo: " + err.message);
        clearPendingFile();
        setView("upload");
      }
      renderUI();
    }

    function handleWorkspaceBack() {
      runToken += 1;
      resetResult();
      setView("upload");
      updateSteps(0);
      renderUI();
    }

    function handleUploadBack() {
      handleWorkspaceBack();
    }

    function removeBatchItem() {
      // Mid-pipeline delete disabled — use × / Back to cancel.
    }

    function cancelBatchItem(index) {
      const item = batchItems[index];
      if (!item) return;
      if (item.status === "done" || item.status === "cancelled") return;
      // Abort this item only; batch loop continues with the next file.
      item.cancelled = true;
      item.status = "cancelled";
      item.progress = 0;
      item.phaseLabel = "Skipped";
      item.etaText = "";
      renderBatchList();

      // If nothing left to run and no successes yet, end the batch UI.
      // Do NOT bump runToken while other items are still queued/working —
      // that would kill the whole batch instead of skipping one row.
      const stillActive = batchItems.some((i) => i.status === "working" || i.status === "queued");
      const doneCount = batchItems.filter((i) => i.status === "done").length;
      if (!stillActive && !doneCount) {
        runToken += 1;
        clearBatch();
        setView("upload");
        updateSteps(0);
        renderUI();
      } else if (!stillActive && doneCount) {
        batchPhase = "done";
        renderBatchList();
        updateSteps(2);
      }
    }

    async function handleBatchAction() {
      // Confirmation step removed — batch auto-runs after select.
    }

    async function handleBatchZip() {
      const doneItems = batchItems.filter((i) => i.status === "done" && i.result);
      if (!doneItems.length) return;
      const entries = [];
      for (const item of doneItems) {
        entries.push({
          name: item.result.filename,
          data: new Uint8Array(await item.result.blob.arrayBuffer())
        });
      }
      const zipBlob = await createZipBlob(entries);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wps-tools-results.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    function handleAction(action) {
      const L = Links();
      if (action === "login") L?.openSignIn();
      else if (action === "premium") { L?.openPremium(); Q.upgradePremium(); resetResult(); renderUI(); }
    }

    document.getElementById("chrome-login-link")?.addEventListener("click", (e) => {
      const state = Q.getState();
      if (!state.loggedIn) return;
      e.preventDefault();
    });


    els.btnSelectFile?.addEventListener("click", () => {
      els.fileInput.click();
    });

    els.fileInput?.addEventListener("change", (e) => {
      startUpload(e.target.files);
      e.target.value = "";
    });

    ["dragenter", "dragover"].forEach((ev) => {
      els.uploadZone?.addEventListener(ev, (e) => {
        e.preventDefault();
        els.uploadZone.classList.add("is-dragover");
        els.uploadZone.classList.remove("is-drag-denied");
      });
    });
    ["dragleave", "drop"].forEach((ev) => {
      els.uploadZone?.addEventListener(ev, (e) => {
        e.preventDefault();
        els.uploadZone.classList.remove("is-dragover", "is-drag-denied");
        if (ev === "drop") {
          startUpload(e.dataTransfer.files);
        }
      });
    });

    els.btnUploadBack?.addEventListener("click", handleUploadBack);
    els.btnUploadContinue?.addEventListener("click", () => handleUploadContinue());

    ensureWorkspaceBack();
    document.getElementById("btn-workspace-back")?.addEventListener("click", handleWorkspaceBack);

    ensureBatchPanel();
    // pointerdown: cancel before a progress frame can destroy the button mid-click
    document.getElementById("batch-panel")?.addEventListener("pointerdown", (e) => {
      const cancel = e.target.closest("[data-batch-cancel]");
      if (!cancel || cancel.classList.contains("is-skipped")) return;
      e.preventDefault();
      e.stopPropagation();
      cancelBatchItem(Number(cancel.dataset.batchCancel));
    });
    document.getElementById("batch-panel")?.addEventListener("click", (e) => {
      const del = e.target.closest("[data-batch-delete]");
      if (del) removeBatchItem(Number(del.dataset.batchDelete));
    });
    document.getElementById("btn-batch-action")?.addEventListener("click", handleBatchAction);
    document.getElementById("btn-batch-zip")?.addEventListener("click", handleBatchZip);
    document.getElementById("btn-batch-client")?.addEventListener("click", () => {
      Links()?.openDownload("auto");
    });
    document.getElementById("btn-pipeline-cancel")?.addEventListener("click", handleWorkspaceBack);

    els.btnDownloadClient?.addEventListener("click", () => {
      Links()?.openDownload("auto");
    });

    els.ratioButtons?.forEach((btn) => {
      btn.addEventListener("click", () => {
        els.ratioButtons.forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        selectedRatio = btn.dataset.ratio;
      });
    });

    bindQuotaTooltip(els, Q);
    config.bindFormatPicker?.();
    config.bindDemoPanel?.(renderUI, resetResult);

    if (els.btnUploadContinue && config.continueLabel) {
      els.btnUploadContinue.textContent = config.continueLabel;
    }

    Links()?.wireDownloadTriggers(document.getElementById("tool-content-mount"));
    global.WPSQuotaModals?.wireUpgradeListener?.(() => {
      resetResult();
      renderUI();
    });
    renderUI();
  }

  global.WPSToolPage = {
    initToolPage,
    formatBytes,
    formatEta,
    simulateUpload,
    simulateProcessing,
    createZipBlob,
    processCompress,
    processConvert,
    acceptForFormat
  };
})(window);
