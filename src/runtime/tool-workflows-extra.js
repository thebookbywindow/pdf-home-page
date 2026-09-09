/**
 * Specialized demo workflows: Split PDF, Merge PDF, Sign PDF.
 * Skips the shared convert/compress pipeline (sharedPipeline: false).
 */
(function (global) {
  const SIG_COLORS = ["#121317", "#5948f3", "#00af57", "#e11d48", "#2563eb"];

  function helpersFromPage() {
    const TP = global.WPSToolPage || {};
    return {
      Q: global.WPSQuotaFlow,
      Links: () => global.WPSLinks,
      formatBytes: TP.formatBytes,
      formatEta: TP.formatEta,
      simulateUpload: TP.simulateUpload,
      simulateProcessing: TP.simulateProcessing,
      createZipBlob: TP.createZipBlob
    };
  }

  function isPdfFile(file) {
    if (!file) return false;
    const name = (file.name || "").toLowerCase();
    return file.type === "application/pdf" || name.endsWith(".pdf");
  }

  function estimatePageCount(file) {
    const n = Math.round((file.size || 0) / (95 * 1024)) + 1;
    return Math.max(1, Math.min(16, n));
  }

  function makeDemoPdfBlob(label) {
    const body = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\n% ${String(label || "WPS demo").replace(/%/g, "")}\nxref\n0 2\ntrailer<</Root 1 0 R>>\n%%EOF`;
    return new Blob([body], { type: "application/pdf" });
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function thumbHue(seed) {
    return Math.abs(Number(seed) || 0) % 360;
  }

  function pageThumbStyle(index, seed) {
    const h = (thumbHue(seed) + index * 37) % 360;
    return `background: linear-gradient(160deg, hsl(${h} 42% 94%), hsl(${(h + 40) % 360} 38% 88%));`;
  }

  function initSharedChrome(config) {
    const { tool, els, bindUserSwitcher } = config;
    const H = helpersFromPage();
    const Q = H.Q;
    const Links = H.Links;
    let workflowView = "upload";
    let runToken = 0;
    let lastProcessingSource = "web";
    let lastResultUrl = null;
    let dragGateFlashTimer = null;

    function setWorkspaceBackVisible(show) {
      const wrap = document.getElementById("workspace-back-wrap");
      if (wrap) wrap.hidden = !show;
    }

    function updateSteps(active) {
      const steps = document.querySelectorAll("#workspace-steps .workspace-step");
      steps.forEach((step, i) => step.classList.toggle("is-active", i === active));
    }

    function getToolSlug() {
      return document.body?.dataset?.toolSlug || tool.slug || "";
    }

    function interceptFiles(files) {
      return global.WPSQuotaModals?.interceptUpload(files, getToolSlug());
    }

    function handleAction(action) {
      const L = Links();
      if (action === "login") L?.openSignIn();
      else if (action === "premium") { L?.openPremium(); Q.upgradePremium(); resetToUpload(); }
    }

    function renderQuotaTooltip() {
      const el = els.quotaTooltip;
      if (!el || !Q.getQuotaRules) return;
      const Modals = global.WPSQuotaModals;
      el.innerHTML = Modals?.renderQuotaTooltipHTML
        ? Modals.renderQuotaTooltipHTML(Q.getQuotaRules())
        : "";
      Modals?.wireQuotaTooltipActions?.(el);
    }

    function bindQuotaTooltip() {
      if (!els.quotaTooltip) return;
      renderQuotaTooltip();
      const trigger = els.quotaTrigger || els.quotaInfo || els.quotaBadge;
      const wrap = trigger?.closest(".quota-wrap");
      let hideTimer;
      const show = () => { clearTimeout(hideTimer); els.quotaTooltip.classList.add("is-visible"); };
      const hide = () => { hideTimer = setTimeout(() => els.quotaTooltip.classList.remove("is-visible"), 120); };
      trigger?.addEventListener("mouseenter", show);
      trigger?.addEventListener("focus", show);
      if (els.quotaBadge) {
        els.quotaBadge.addEventListener("click", (event) => {
          const target = event.target;
          if (!target || typeof target.closest !== "function") return;
          const signInBtn = target.closest(".quota-sign-in-link, [data-quota-sign-in='true']");
          if (!signInBtn) return;
          event.preventDefault();
          event.stopPropagation();
          els.quotaTooltip?.classList.remove("is-visible");
          Links()?.openSignIn?.();
        });
      }
      wrap?.addEventListener("mouseleave", hide);
      trigger?.addEventListener("blur", hide);
      els.quotaTooltip.addEventListener("mouseenter", show);
      els.quotaTooltip.addEventListener("mouseleave", hide);
    }

    function ensureEdgeProgress() {
      let rail = document.getElementById("workspace-edge-progress");
      if (rail) return rail;
      rail = document.createElement("div");
      rail.id = "workspace-edge-progress";
      rail.className = "workspace-edge-progress";
      rail.hidden = true;
      rail.innerHTML = `
        <div class="workspace-edge-track" aria-hidden="true">
          <div class="workspace-edge-bar" id="edge-progress-bar"></div>
        </div>
        <div class="workspace-edge-meta">
          <span class="workspace-edge-label" id="edge-progress-label">
            <span class="material-symbols-rounded" aria-hidden="true">picture_as_pdf</span>
            <span id="edge-progress-phase">Uploading…</span>
          </span>
          <span class="workspace-edge-eta" id="edge-progress-eta"></span>
        </div>`;
      const card = document.querySelector(".workspace-card");
      // Last child of the card = flush with bottom edge (below Back)
      if (card) card.appendChild(rail);
      else (els.workspaceBody || document.body).appendChild(rail);
      return rail;
    }

    function showEdgeProgress(show) {
      const rail = ensureEdgeProgress();
      rail.hidden = !show;
      rail.classList.toggle("is-active", !!show);
      if (!show) {
        const bar = document.getElementById("edge-progress-bar");
        if (bar) bar.style.width = "0%";
      }
    }

    function hideStandardPanels() {
      if (els.uploadZone) els.uploadZone.hidden = true;
      if (els.processingPanel) els.processingPanel.hidden = true;
      if (els.uploadSuccessPanel) els.uploadSuccessPanel.hidden = true;
      if (els.resultPanel) {
        els.resultPanel.hidden = true;
        els.resultPanel.dataset.visible = "false";
      }
      const batch = document.getElementById("batch-panel");
      if (batch) batch.hidden = true;
      els.stageGate?.classList.remove("is-visible");
      const special = document.getElementById("special-workflow");
      if (special) special.hidden = true;
      showEdgeProgress(false);
    }

    function setView(view) {
      workflowView = view;
      hideStandardPanels();
      const special = document.getElementById("special-workflow");
      const hasSpecial = !!(special && special.innerHTML.trim().length);

      if (view === "upload") {
        if (els.uploadZone) els.uploadZone.hidden = false;
        setWorkspaceBackVisible(false);
        updateSteps(0);
      } else if (view === "uploading" || view === "processing") {
        // Keep context visible (upload zone or special workspace); progress hugs bottom edge
        if (hasSpecial) special.hidden = false;
        else if (els.uploadZone) els.uploadZone.hidden = false;
        showEdgeProgress(true);
        setWorkspaceBackVisible(true);
        updateSteps(view === "uploading" ? 0 : 1);
      } else if (view === "workspace") {
        if (special) special.hidden = false;
        setWorkspaceBackVisible(true);
        updateSteps(1);
      } else if (view === "result") {
        if (els.resultPanel) {
          els.resultPanel.hidden = false;
          els.resultPanel.dataset.visible = "true";
        }
        setWorkspaceBackVisible(true);
        updateSteps(2);
      }
    }

    function updateProgressUI({ percent, eta, phase }) {
      ensureEdgeProgress();
      const bar = document.getElementById("edge-progress-bar");
      const phaseEl = document.getElementById("edge-progress-phase");
      const etaEl = document.getElementById("edge-progress-eta");
      const pct = Math.max(0, Math.min(100, Number(percent) || 0));
      if (bar) bar.style.width = pct + "%";
      if (phaseEl) phaseEl.textContent = phase || "Processing…";
      if (etaEl) etaEl.textContent = H.formatEta ? H.formatEta(eta) : "";
      if (els.progressBar) els.progressBar.style.width = pct + "%";
      if (els.progressPercent) els.progressPercent.textContent = pct + "%";
      if (els.progressEta) els.progressEta.textContent = H.formatEta(eta);
      if (els.progressPhase) els.progressPhase.textContent = phase;
      if (els.progressHint) els.progressHint.hidden = true;
    }

    function showResult({ blob, filename, title, statsHtml, downloadLabel }) {
      if (lastResultUrl) URL.revokeObjectURL(lastResultUrl);
      lastResultUrl = URL.createObjectURL(blob);
      const resultTitle = els.resultPanel?.querySelector("h3");
      if (resultTitle && title) resultTitle.textContent = title;
      if (els.resultFilename) els.resultFilename.textContent = filename;
      if (els.resultStats) els.resultStats.innerHTML = statsHtml || "";
      if (els.downloadBtn) {
        els.downloadBtn.href = lastResultUrl;
        els.downloadBtn.download = filename;
      }
      if (els.downloadLabel) {
        els.downloadLabel.textContent = downloadLabel || tool.downloadLabel || "Download PDF";
      }
      setView("result");
    }

    function resetToUpload() {
      runToken += 1;
      if (lastResultUrl) URL.revokeObjectURL(lastResultUrl);
      lastResultUrl = null;
      if (els.fileInput) els.fileInput.value = "";
      const special = document.getElementById("special-workflow");
      if (special) special.innerHTML = "";
      showEdgeProgress(false);
      setView("upload");
      renderUI();
    }

    function renderUI() {
      const state = Q.getState();
      config.onSyncUserState?.(state);

      const siteHeader = els.header || document.querySelector(".site-header");
      const chromeLogin = document.getElementById("chrome-login-link");
      if (siteHeader) siteHeader.classList.toggle("is-logged-in", state.loggedIn);
      if (chromeLogin) {
        const chromeLoginLabel = document.getElementById("chrome-login-label");
        if (chromeLoginLabel) {
          chromeLoginLabel.textContent = state.isPremium
            ? "WPS Pro+"
            : (state.loggedIn ? "Free user" : "Not signed in");
        } else {
          chromeLogin.textContent = state.loggedIn ? state.userName : "login";
        }
        chromeLogin.href = "#";
      }

      const summary = Q.getQuotaSummary(state);
      if (els.quotaText) {
        els.quotaText.innerHTML = summary.sub
          ? `${summary.text} <span class="quota-sub">(${summary.sub})</span>`
          : summary.text;
      }
      const clientQuotaText = document.getElementById("client-quota-text");
      const showClientQuota = state.loggedIn && !state.isPremium;
      if (clientQuotaText) {
        clientQuotaText.hidden = !showClientQuota;
        if (showClientQuota) {
          clientQuotaText.textContent = `WPS Drive: ${Q.formatUsesLeft(state.clientUsesRemaining)}`;
        }
      }
      renderQuotaTooltip();
      els.uploadZone?.classList.remove("is-quota-blocked");
      els.btnSelectFile?.classList.remove("is-quota-blocked");
      els.btnSelectFile?.setAttribute("aria-disabled", "false");
      const cloudHint = document.getElementById("batch-client-hint");
      if (cloudHint) {
        cloudHint.textContent = lastProcessingSource === "wps-office"
          ? "Saved to WPS Cloud Documents. Download WPS Office, then open Cloud Documents to view and edit."
          : "Download WPS Office, then open Cloud Documents to view and edit.";
      }

      const busy = workflowView !== "upload";
      if (!busy) setView("upload");
    }

    function tryConsumeUse() {
      const consume = Q.consumeUse();
      if (!consume.ok) {
        global.WPSQuotaModals?.openQuotaExhausted();
        renderUI();
        return false;
      }
      lastProcessingSource = consume.source || "web";
      return true;
    }

    function tryStartProcess(files, onLogin) {
      const list = Array.from(files || []).filter(Boolean);
      if (!list.length) return false;
      if (global.WPSQuotaModals?.interceptUnauthenticatedPdf?.(list, onLogin)) return false;
      if (interceptFiles(list)) return false;
      return tryConsumeUse();
    }

    async function runUploadProgress(file, token, label) {
      setView("uploading");
      updateProgressUI({ percent: 0, eta: 3, phase: "Uploading…" });
      await H.simulateUpload(({ percent, eta }) => {
        if (token !== runToken) return;
        updateProgressUI({ percent, eta, phase: "Uploading…" });
      }, file);
      if (token === runToken) showEdgeProgress(false);
      return token === runToken;
    }

    async function runCombinedUploadProgress(files, token) {
      const list = Array.from(files || []).filter(Boolean);
      if (!list.length) return true;
      setView("uploading");
      updateProgressUI({
        percent: 0,
        eta: Math.max(2, list.length * 1.5),
        phase: `Uploading (0/${list.length})…`
      });
      for (let i = 0; i < list.length; i += 1) {
        if (token !== runToken) return false;
        await H.simulateUpload(({ percent, eta }) => {
          if (token !== runToken) return;
          const overall = Math.round(((i + percent / 100) / list.length) * 100);
          const remain = Math.ceil(eta + (list.length - i - 1) * 1.2);
          updateProgressUI({
            percent: overall,
            eta: remain,
            phase: `Uploading (${i + 1}/${list.length})…`
          });
        }, list[i]);
      }
      if (token === runToken) showEdgeProgress(false);
      return token === runToken;
    }

    async function runProcessProgress(file, token, phase, durationMs) {
      setView("processing");
      updateProgressUI({
        percent: 0,
        eta: Math.ceil((durationMs || 1800) / 1000),
        phase: phase || "Processing…"
      });
      await H.simulateProcessing(({ percent, eta, phase: p }) => {
        if (token !== runToken) return;
        updateProgressUI({ percent, eta, phase: phase || p });
      }, durationMs || 1800, phase);
      if (token === runToken) showEdgeProgress(false);
      return token === runToken;
    }

    function specialRoot() {
      let el = document.getElementById("special-workflow");
      if (!el) {
        el = document.createElement("div");
        el.id = "special-workflow";
        el.hidden = true;
        (els.workspaceBody || document.getElementById("workspace-body"))?.appendChild(el);
      }
      return el;
    }

    // Wire shared chrome once
    document.getElementById("btn-workspace-back")?.addEventListener("click", () => resetToUpload());
    els.btnDownloadClient?.addEventListener("click", () => Links()?.openDownload("auto"));
    bindQuotaTooltip();
    bindUserSwitcher?.(renderUI, resetToUpload);
    Links()?.wireDownloadTriggers(document.getElementById("tool-content-mount"));
    global.WPSQuotaModals?.wireUpgradeListener?.(() => {
      resetToUpload();
      renderUI();
    });

    // Configure file input for single vs multi
    if (els.fileInput) {
      els.fileInput.accept = tool.accept || ".pdf,application/pdf";
      if (tool.singleFile || tool.workflow === "split" || tool.workflow === "sign") {
        els.fileInput.removeAttribute("multiple");
      } else {
        els.fileInput.setAttribute("multiple", "");
      }
    }

    const dropTitle = document.getElementById("drop-title");
    const selectLabel = document.getElementById("select-label");
    if (tool.workflow === "merge") {
      if (dropTitle) dropTitle.textContent = "Drop PDF files here";
      if (selectLabel) selectLabel.textContent = "Select PDF Files";
    } else {
      if (dropTitle) dropTitle.textContent = "Drop a PDF file here";
      if (selectLabel) selectLabel.textContent = "Select PDF File";
    }

    return {
      H,
      Q,
      Links,
      els,
      tool,
      get runToken() { return runToken; },
      bumpToken() { runToken += 1; return runToken; },
      getToken() { return runToken; },
      setView,
      updateSteps,
      updateProgressUI,
      showResult,
      resetToUpload,
      renderUI,
      tryConsumeUse,
      tryStartProcess,
      runUploadProgress,
      runCombinedUploadProgress,
      runProcessProgress,
      specialRoot,
      dragGateFlashTimer: {
        get value() { return dragGateFlashTimer; },
        set value(v) { dragGateFlashTimer = v; }
      }
    };
  }

  function bindUploadZone(ctx, onFiles) {
    const { els } = ctx;

    function acceptFiles(files) {
      const list = Array.from(files || []).filter(Boolean);
      if (!list.length) return;
      onFiles(list);
    }

    els.btnSelectFile?.addEventListener("click", () => {
      els.fileInput.click();
    });

    els.fileInput?.addEventListener("change", (e) => {
      acceptFiles(e.target.files);
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
        if (ev === "drop") acceptFiles(e.dataTransfer.files);
      });
    });
  }

  /* ───────────── Split ───────────── */
  function initSplit(config) {
    const ctx = initSharedChrome(config);
    const { H, specialRoot, setView, showResult, resetToUpload, tryStartProcess, runUploadProgress, runProcessProgress, bumpToken, getToken, renderUI } = ctx;
    let sourceFile = null;
    let pageCount = 0;
    let selected = new Set();

    function renderSplitWorkspace() {
      const root = specialRoot();
      if (pageCount <= 1) {
        root.innerHTML = `
          <div class="split-workspace">
            <div class="workflow-empty-msg">
              <span class="material-symbols-rounded" aria-hidden="true">info</span>
              <h3>Single-page PDF cannot be split</h3>
              <p>This file appears to have only one page. Upload a multi-page PDF to extract pages.</p>
            </div>
          </div>`;
        setView("workspace");
        return;
      }

      const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
      root.innerHTML = `
        <div class="split-workspace">
          <div class="split-toolbar">
            <label class="split-select-all">
              <input type="checkbox" id="split-select-all" />
              Select all pages
            </label>
            <p class="split-hint">${escapeHtml(sourceFile.name)} · ${pageCount} pages</p>
          </div>
          <div class="page-thumb-grid" id="split-page-grid" role="list"></div>
          <div class="split-actions">
            <button class="btn-primary" type="button" id="btn-extract-multi" disabled>Extract to 0 PDF</button>
            <button class="btn-secondary" type="button" id="btn-extract-one" disabled>Extract to 1 PDF</button>
          </div>
        </div>`;

      const grid = root.querySelector("#split-page-grid");
      grid.innerHTML = pages.map((n) => `
        <button type="button" class="page-thumb${selected.has(n) ? " is-selected" : ""}" data-page="${n}" role="listitem" aria-pressed="${selected.has(n)}">
          <span class="page-thumb-preview" style="${pageThumbStyle(n, sourceFile.size)}"></span>
          <span class="page-thumb-label">Page ${n}</span>
          <span class="page-thumb-check" aria-hidden="true"><span class="material-symbols-rounded">check</span></span>
        </button>`).join("");

      function syncActions() {
        const n = selected.size;
        const multi = root.querySelector("#btn-extract-multi");
        const one = root.querySelector("#btn-extract-one");
        const all = root.querySelector("#split-select-all");
        if (multi) {
          multi.textContent = `Extract to ${n} PDF`;
          multi.disabled = n < 1;
        }
        if (one) one.disabled = n < 1;
        if (all) all.checked = n === pageCount && pageCount > 0;
        grid.querySelectorAll(".page-thumb").forEach((btn) => {
          const p = Number(btn.dataset.page);
          const on = selected.has(p);
          btn.classList.toggle("is-selected", on);
          btn.setAttribute("aria-pressed", on ? "true" : "false");
        });
      }

      grid.addEventListener("click", (e) => {
        const btn = e.target.closest(".page-thumb");
        if (!btn) return;
        const p = Number(btn.dataset.page);
        if (selected.has(p)) selected.delete(p);
        else selected.add(p);
        syncActions();
      });

      root.querySelector("#split-select-all")?.addEventListener("change", (e) => {
        selected.clear();
        if (e.target.checked) pages.forEach((p) => selected.add(p));
        syncActions();
      });

      root.querySelector("#btn-extract-multi")?.addEventListener("click", () => extractPages(false));
      root.querySelector("#btn-extract-one")?.addEventListener("click", () => extractPages(true));
      syncActions();
      setView("workspace");
    }

    async function extractPages(asOne) {
      const pages = Array.from(selected).sort((a, b) => a - b);
      if (!pages.length || !sourceFile) return;
      if (!tryStartProcess([sourceFile], () => extractPages(asOne))) return;
      const token = bumpToken();
      const ok = await runProcessProgress(sourceFile, token, "Splitting...", 1600 + pages.length * 180);
      if (!ok) return;

      const base = sourceFile.name.replace(/\.pdf$/i, "") || "document";
      if (!asOne && pages.length > 1) {
        const entries = [];
        for (const p of pages) {
          entries.push({
            name: `${base}_page_${p}.pdf`,
            data: new Uint8Array(await makeDemoPdfBlob(`page ${p}`).arrayBuffer())
          });
        }
        const zipBlob = await H.createZipBlob(entries);
        showResult({
          blob: zipBlob,
          filename: `${base}_split.zip`,
          title: "Split complete",
          statsHtml: `<span>${pages.length} PDFs in ZIP</span><span>Pages: ${pages.join(", ")}</span>`,
          downloadLabel: "Download ZIP"
        });
      } else {
        const blob = makeDemoPdfBlob(asOne ? `pages ${pages.join("-")}` : `page ${pages[0]}`);
        const name = asOne || pages.length === 1
          ? (pages.length === 1 ? `${base}_page_${pages[0]}.pdf` : `${base}_pages_${pages.join("-")}.pdf`)
          : `${base}_page_${pages[0]}.pdf`;
        showResult({
          blob,
          filename: name,
          title: "Split complete",
          statsHtml: `<span>1 PDF</span><span>Pages: ${pages.join(", ")}</span>`,
          downloadLabel: "Download split PDF"
        });
      }
      renderUI();
    }

    async function startWithFile(file) {
      sourceFile = file;
      pageCount = estimatePageCount(file);
      selected = new Set();
      const token = bumpToken();
      const ok = await runUploadProgress(file, token);
      if (!ok) return;
      renderSplitWorkspace();
      renderUI();
    }

    bindUploadZone(ctx, (files) => {
      const pdfs = files.filter(isPdfFile);
      if (!pdfs.length) return;
      startWithFile(pdfs[0]);
    });

    setView("upload");
    renderUI();
  }

  /* ───────────── Merge ───────────── */
  function initMerge(config) {
    const ctx = initSharedChrome(config);
    const { H, specialRoot, setView, tryStartProcess, runUploadProgress, runCombinedUploadProgress, runProcessProgress, bumpToken, getToken, renderUI, els } = ctx;
    let mergeFiles = []; // { id, file }
    let idSeq = 0;
    let merging = false;

    function renderMergeWorkspace() {
      const root = specialRoot();
      root.innerHTML = `
        <div class="merge-workspace">
          <p class="merge-hint">Drag and drop the file thumbnails to sort them.</p>
          <div class="merge-thumb-list" id="merge-thumb-list" role="list"></div>
          <div class="merge-actions">
            <button class="btn-secondary" type="button" id="btn-merge-add">
              <span class="material-symbols-rounded">add</span>
              Add File
            </button>
            <button class="btn-primary" type="button" id="btn-merge-run" disabled>Merge</button>
          </div>
        </div>`;

      const list = root.querySelector("#merge-thumb-list");
      list.innerHTML = mergeFiles.map((item, index) => `
        <div class="merge-thumb" draggable="true" data-id="${item.id}" role="listitem">
          <span class="merge-thumb-preview" style="${pageThumbStyle(index, item.file.size)}"></span>
          <span class="merge-thumb-name" title="${escapeHtml(item.file.name)}">${escapeHtml(item.file.name)}</span>
          <button type="button" class="merge-thumb-remove" data-remove="${item.id}" aria-label="Remove">×</button>
        </div>`).join("") + `
        <button type="button" class="merge-thumb merge-thumb-add" id="merge-thumb-add-slot" aria-label="Add file">
          <span class="material-symbols-rounded">add</span>
        </button>`;

      const mergeBtn = root.querySelector("#btn-merge-run");
      mergeBtn.disabled = mergeFiles.length < 2 || merging;
      mergeBtn.textContent = merging ? "Merging..." : "Merge";

      let dragId = null;
      list.querySelectorAll(".merge-thumb[draggable]").forEach((el) => {
        el.addEventListener("dragstart", () => {
          dragId = el.dataset.id;
          el.classList.add("is-dragging");
        });
        el.addEventListener("dragend", () => {
          el.classList.remove("is-dragging");
          dragId = null;
        });
        el.addEventListener("dragover", (e) => {
          e.preventDefault();
          el.classList.add("is-drag-over");
        });
        el.addEventListener("dragleave", () => el.classList.remove("is-drag-over"));
        el.addEventListener("drop", (e) => {
          e.preventDefault();
          el.classList.remove("is-drag-over");
          const targetId = el.dataset.id;
          if (!dragId || dragId === targetId) return;
          const from = mergeFiles.findIndex((f) => String(f.id) === String(dragId));
          const to = mergeFiles.findIndex((f) => String(f.id) === String(targetId));
          if (from < 0 || to < 0) return;
          const [moved] = mergeFiles.splice(from, 1);
          mergeFiles.splice(to, 0, moved);
          renderMergeWorkspace();
        });
      });

      list.addEventListener("click", (e) => {
        const rem = e.target.closest("[data-remove]");
        if (rem) {
          mergeFiles = mergeFiles.filter((f) => String(f.id) !== String(rem.dataset.remove));
          if (!mergeFiles.length) resetToUploadAndClear();
          else renderMergeWorkspace();
          return;
        }
        if (e.target.closest("#merge-thumb-add-slot")) openAddFiles();
      });

      root.querySelector("#btn-merge-add")?.addEventListener("click", openAddFiles);
      root.querySelector("#btn-merge-run")?.addEventListener("click", runMerge);
      setView("workspace");
    }

    function resetToUploadAndClear() {
      mergeFiles = [];
      ctx.resetToUpload();
    }

    function openAddFiles() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,application/pdf";
      input.multiple = true;
      input.hidden = true;
      document.body.appendChild(input);
      input.addEventListener("change", () => {
        const pdfs = Array.from(input.files || []).filter(isPdfFile);
        input.remove();
        if (pdfs.length) addFilesAfterUpload(pdfs);
      });
      input.click();
    }

    async function addFilesAfterUpload(pdfs) {
      if (!pdfs.length) return;

      const token = bumpToken();
      // Keep existing thumbs visible; one combined bar for multi upload
      if (mergeFiles.length) renderMergeWorkspace();
      const ok = await runCombinedUploadProgress(pdfs, token);
      if (!ok) return;
      pdfs.forEach((file) => mergeFiles.push({ id: ++idSeq, file }));
      renderMergeWorkspace();
      renderUI();
    }

    async function runMerge() {
      if (mergeFiles.length < 2 || merging) return;
      if (!tryStartProcess(mergeFiles.map((item) => item.file), runMerge)) return;
      merging = true;
      renderMergeWorkspace();
      const token = bumpToken();
      const fake = mergeFiles[0].file;
      const ok = await runProcessProgress(
        { name: `${mergeFiles.length} PDFs`, size: mergeFiles.reduce((n, f) => n + f.file.size, 0) },
        token,
        "Merging...",
        2000 + mergeFiles.length * 200
      );
      merging = false;
      if (!ok) {
        renderMergeWorkspace();
        return;
      }
      const base = (mergeFiles[0].file.name.replace(/\.pdf$/i, "") || "document") + "_merged";
      showResult({
        blob: makeDemoPdfBlob(`merged ${mergeFiles.length}`),
        filename: `${base}.pdf`,
        title: "Merge complete",
        statsHtml: `<span>${mergeFiles.length} files merged</span><span>Output: ${H.formatBytes(fake.size)}</span>`,
        downloadLabel: "Download merged PDF"
      });
      renderUI();
    }

    bindUploadZone(ctx, (files) => {
      const pdfs = files.filter(isPdfFile);
      if (!pdfs.length) return;
      addFilesAfterUpload(pdfs);
    });

    // Override back to clear merge state
    document.getElementById("btn-workspace-back")?.addEventListener("click", () => {
      mergeFiles = [];
      merging = false;
    });

    setView("upload");
    renderUI();
  }

  /* ───────────── Sign ───────────── */
  function initSign(config) {
    const ctx = initSharedChrome(config);
    const { H, specialRoot, setView, tryStartProcess, runUploadProgress, runProcessProgress, bumpToken, renderUI } = ctx;
    let sourceFile = null;
    let signatures = []; // { id, type, dataUrl, label }
    let placements = []; // { id, sigId, x, y }
    let sigIdSeq = 0;
    let placeIdSeq = 0;
    let activeSigId = null;

    function openSignatureModal() {
      const existing = document.getElementById("sign-modal-backdrop");
      if (existing) existing.remove();

      const backdrop = document.createElement("div");
      backdrop.id = "sign-modal-backdrop";
      backdrop.className = "sign-modal-backdrop";
      backdrop.innerHTML = `
        <div class="sign-modal" role="dialog" aria-labelledby="sign-modal-title">
          <div class="sign-modal-head">
            <h3 id="sign-modal-title">New Signature</h3>
            <button type="button" class="sign-modal-close" data-close aria-label="Close">×</button>
          </div>
          <div class="sign-modal-tabs" role="tablist">
            <button type="button" class="sign-tab is-active" data-tab="draw">Draw</button>
            <button type="button" class="sign-tab" data-tab="text">Text</button>
            <button type="button" class="sign-tab" data-tab="image">Image</button>
          </div>
          <div class="sign-modal-body">
            <div class="sign-pane is-active" data-pane="draw">
              <canvas id="sign-draw-canvas" width="480" height="160"></canvas>
              <div class="sign-color-row" id="sign-draw-colors"></div>
              <button type="button" class="btn-ghost" id="sign-draw-clear">Clear</button>
            </div>
            <div class="sign-pane" data-pane="text">
              <input type="text" id="sign-text-input" class="sign-text-input" placeholder="Type your name" maxlength="40" />
              <label class="sign-font-label">Font
                <select id="sign-font-select">
                  <option value="cursive">Script</option>
                  <option value="Georgia, serif">Serif</option>
                  <option value="Roboto, sans-serif">Sans</option>
                </select>
              </label>
              <div class="sign-color-row" id="sign-text-colors"></div>
              <div class="sign-text-preview" id="sign-text-preview">Your Name</div>
            </div>
            <div class="sign-pane" data-pane="image">
              <label class="sign-image-zone" id="sign-image-zone">
                <span class="material-symbols-rounded">add</span>
                <span>Upload signature image</span>
                <input type="file" id="sign-image-input" accept="image/*" hidden />
              </label>
              <img id="sign-image-preview" class="sign-image-preview" alt="" hidden />
            </div>
          </div>
          <div class="sign-modal-foot">
            <button type="button" class="btn-secondary" data-close>Cancel</button>
            <button type="button" class="btn-primary" id="sign-modal-save">Save</button>
          </div>
        </div>`;
      document.body.appendChild(backdrop);

      let tab = "draw";
      let drawColor = SIG_COLORS[0];
      let textColor = SIG_COLORS[0];
      let imageDataUrl = null;
      const canvas = backdrop.querySelector("#sign-draw-canvas");
      const cctx = canvas.getContext("2d");
      cctx.strokeStyle = drawColor;
      cctx.lineWidth = 2.5;
      cctx.lineCap = "round";
      let drawing = false;

      function paintColors(row, current, onPick) {
        row.innerHTML = SIG_COLORS.map((c) =>
          `<button type="button" class="sign-color-swatch${c === current ? " is-selected" : ""}" data-color="${c}" style="background:${c}" aria-label="Color"></button>`
        ).join("");
        row.onclick = (e) => {
          const btn = e.target.closest("[data-color]");
          if (!btn) return;
          onPick(btn.dataset.color);
          paintColors(row, btn.dataset.color, onPick);
        };
      }

      paintColors(backdrop.querySelector("#sign-draw-colors"), drawColor, (c) => {
        drawColor = c;
        cctx.strokeStyle = c;
      });
      paintColors(backdrop.querySelector("#sign-text-colors"), textColor, (c) => {
        textColor = c;
        updateTextPreview();
      });

      function updateTextPreview() {
        const input = backdrop.querySelector("#sign-text-input");
        const font = backdrop.querySelector("#sign-font-select").value;
        const preview = backdrop.querySelector("#sign-text-preview");
        preview.textContent = input.value.trim() || "Your Name";
        preview.style.fontFamily = font;
        preview.style.color = textColor;
      }

      function setTab(name) {
        tab = name;
        backdrop.querySelectorAll(".sign-tab").forEach((t) => t.classList.toggle("is-active", t.dataset.tab === name));
        backdrop.querySelectorAll(".sign-pane").forEach((p) => p.classList.toggle("is-active", p.dataset.pane === name));
      }

      backdrop.querySelectorAll(".sign-tab").forEach((t) => {
        t.addEventListener("click", () => setTab(t.dataset.tab));
      });

      const getPos = (e) => {
        const r = canvas.getBoundingClientRect();
        const src = e.touches ? e.touches[0] : e;
        return {
          x: (src.clientX - r.left) * (canvas.width / r.width),
          y: (src.clientY - r.top) * (canvas.height / r.height)
        };
      };
      const start = (e) => { e.preventDefault(); drawing = true; const p = getPos(e); cctx.beginPath(); cctx.moveTo(p.x, p.y); };
      const move = (e) => { if (!drawing) return; e.preventDefault(); const p = getPos(e); cctx.lineTo(p.x, p.y); cctx.stroke(); };
      const end = () => { drawing = false; };
      canvas.addEventListener("mousedown", start);
      canvas.addEventListener("mousemove", move);
      window.addEventListener("mouseup", end);
      canvas.addEventListener("touchstart", start, { passive: false });
      canvas.addEventListener("touchmove", move, { passive: false });
      canvas.addEventListener("touchend", end);

      backdrop.querySelector("#sign-draw-clear")?.addEventListener("click", () => {
        cctx.clearRect(0, 0, canvas.width, canvas.height);
      });

      backdrop.querySelector("#sign-text-input")?.addEventListener("input", updateTextPreview);
      backdrop.querySelector("#sign-font-select")?.addEventListener("change", updateTextPreview);
      updateTextPreview();

      backdrop.querySelector("#sign-image-zone")?.addEventListener("click", () => {
        backdrop.querySelector("#sign-image-input")?.click();
      });
      backdrop.querySelector("#sign-image-input")?.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          imageDataUrl = reader.result;
          const img = backdrop.querySelector("#sign-image-preview");
          img.src = imageDataUrl;
          img.hidden = false;
        };
        reader.readAsDataURL(file);
      });

      const close = () => backdrop.remove();
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop || e.target.closest("[data-close]")) close();
      });

      backdrop.querySelector("#sign-modal-save")?.addEventListener("click", () => {
        let dataUrl = null;
        let label = "Signature";
        if (tab === "draw") {
          const blank = document.createElement("canvas");
          blank.width = canvas.width;
          blank.height = canvas.height;
          if (canvas.toDataURL() === blank.toDataURL()) return;
          dataUrl = canvas.toDataURL("image/png");
          label = "Drawn";
        } else if (tab === "text") {
          const text = backdrop.querySelector("#sign-text-input").value.trim();
          if (!text) return;
          const off = document.createElement("canvas");
          off.width = 480;
          off.height = 120;
          const octx = off.getContext("2d");
          octx.fillStyle = textColor;
          octx.font = `48px ${backdrop.querySelector("#sign-font-select").value}`;
          octx.textBaseline = "middle";
          octx.fillText(text, 16, 60);
          dataUrl = off.toDataURL("image/png");
          label = text.slice(0, 18);
        } else if (tab === "image") {
          if (!imageDataUrl) return;
          dataUrl = imageDataUrl;
          label = "Image";
        }
        if (!dataUrl) return;
        const id = ++sigIdSeq;
        signatures.push({ id, type: tab, dataUrl, label });
        activeSigId = id;
        close();
        renderSignWorkspace();
      });
    }

    function renderSignWorkspace() {
      const root = specialRoot();
      root.innerHTML = `
        <div class="sign-workspace">
          <div class="sign-toolbar">
            <button type="button" class="btn-primary" id="btn-new-signature">
              <span class="material-symbols-rounded">add</span>
              New Signature
            </button>
            <div class="sign-chip-row" id="sign-chip-row"></div>
          </div>
          <div class="sign-preview-pane" id="sign-preview-pane">
            <div class="sign-doc-page" id="sign-doc-page" style="${pageThumbStyle(1, sourceFile?.size || 1)}">
              <div class="sign-doc-lines" aria-hidden="true"></div>
            </div>
          </div>
          <div class="sign-footer-actions">
            <button class="btn-primary" type="button" id="btn-sign-finish" ${placements.length ? "" : "disabled"}>Finish</button>
          </div>
        </div>`;

      const chipRow = root.querySelector("#sign-chip-row");
      chipRow.innerHTML = signatures.map((s) => `
        <div class="sign-chip${s.id === activeSigId ? " is-active" : ""}" data-sig="${s.id}">
          <img src="${s.dataUrl}" alt="" />
          <span>${escapeHtml(s.label)}</span>
          <button type="button" class="sign-chip-copy" data-copy="${s.id}" title="Copy">Copy</button>
          <button type="button" class="sign-chip-del" data-del="${s.id}" aria-label="Delete">×</button>
        </div>`).join("");

      const page = root.querySelector("#sign-doc-page");
      placements.forEach((p) => {
        const sig = signatures.find((s) => s.id === p.sigId);
        if (!sig) return;
        const el = document.createElement("div");
        el.className = "sign-placement";
        el.dataset.place = p.id;
        el.style.left = p.x + "%";
        el.style.top = p.y + "%";
        el.innerHTML = `
          <img src="${sig.dataUrl}" alt="" draggable="false" />
          <button type="button" class="sign-place-del" data-place-del="${p.id}" aria-label="Remove">×</button>
          <button type="button" class="sign-place-dup" data-place-dup="${p.id}" title="Duplicate">+</button>`;
        page.appendChild(el);

        let dragging = false;
        let ox = 0;
        let oy = 0;
        el.addEventListener("mousedown", (e) => {
          if (e.target.closest("button")) return;
          dragging = true;
          const rect = page.getBoundingClientRect();
          ox = e.clientX - rect.left - (p.x / 100) * rect.width;
          oy = e.clientY - rect.top - (p.y / 100) * rect.height;
          e.preventDefault();
        });
        window.addEventListener("mousemove", (e) => {
          if (!dragging) return;
          const rect = page.getBoundingClientRect();
          const nx = ((e.clientX - rect.left - ox) / rect.width) * 100;
          const ny = ((e.clientY - rect.top - oy) / rect.height) * 100;
          p.x = Math.min(85, Math.max(0, nx));
          p.y = Math.min(88, Math.max(0, ny));
          el.style.left = p.x + "%";
          el.style.top = p.y + "%";
        });
        window.addEventListener("mouseup", () => { dragging = false; });
      });

      root.querySelector("#btn-new-signature")?.addEventListener("click", openSignatureModal);

      chipRow.addEventListener("click", (e) => {
        const del = e.target.closest("[data-del]");
        if (del) {
          const id = Number(del.dataset.del);
          signatures = signatures.filter((s) => s.id !== id);
          placements = placements.filter((p) => p.sigId !== id);
          if (activeSigId === id) activeSigId = signatures[0]?.id || null;
          renderSignWorkspace();
          return;
        }
        const copy = e.target.closest("[data-copy]");
        if (copy) {
          const src = signatures.find((s) => s.id === Number(copy.dataset.copy));
          if (!src) return;
          const id = ++sigIdSeq;
          signatures.push({ id, type: src.type, dataUrl: src.dataUrl, label: src.label + " copy" });
          activeSigId = id;
          renderSignWorkspace();
          return;
        }
        const chip = e.target.closest("[data-sig]");
        if (chip) {
          activeSigId = Number(chip.dataset.sig);
          renderSignWorkspace();
        }
      });

      page.addEventListener("click", (e) => {
        if (e.target.closest(".sign-placement")) {
          const del = e.target.closest("[data-place-del]");
          if (del) {
            placements = placements.filter((p) => String(p.id) !== String(del.dataset.placeDel));
            renderSignWorkspace();
            return;
          }
          const dup = e.target.closest("[data-place-dup]");
          if (dup) {
            const src = placements.find((p) => String(p.id) === String(dup.dataset.placeDup));
            if (src) {
              placements.push({
                id: ++placeIdSeq,
                sigId: src.sigId,
                x: Math.min(80, src.x + 4),
                y: Math.min(84, src.y + 4)
              });
              renderSignWorkspace();
            }
            return;
          }
          return;
        }
        if (!activeSigId) {
          if (!signatures.length) openSignatureModal();
          return;
        }
        const rect = page.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100 - 8;
        const y = ((e.clientY - rect.top) / rect.height) * 100 - 4;
        placements.push({
          id: ++placeIdSeq,
          sigId: activeSigId,
          x: Math.min(85, Math.max(0, x)),
          y: Math.min(88, Math.max(0, y))
        });
        renderSignWorkspace();
      });

      root.querySelector("#btn-sign-finish")?.addEventListener("click", finishSign);
      setView("workspace");
    }

    async function finishSign() {
      if (!placements.length || !sourceFile) return;
      if (!tryStartProcess([sourceFile], finishSign)) return;
      const token = bumpToken();
      const ok = await runProcessProgress(sourceFile, token, "Signing...", 1800);
      if (!ok) return;
      const base = sourceFile.name.replace(/\.pdf$/i, "") || "document";
      showResult({
        blob: makeDemoPdfBlob("signed"),
        filename: `${base}_signed.pdf`,
        title: "Signing complete",
        statsHtml: `<span>${placements.length} signature${placements.length > 1 ? "s" : ""} applied</span>`,
        downloadLabel: "Download signed PDF"
      });
      renderUI();
    }

    async function startWithFile(file) {
      sourceFile = file;
      signatures = [];
      placements = [];
      activeSigId = null;
      const token = bumpToken();
      const ok = await runUploadProgress(file, token);
      if (!ok) return;
      renderSignWorkspace();
      renderUI();
    }

    bindUploadZone(ctx, (files) => {
      const pdfs = files.filter(isPdfFile);
      if (!pdfs.length) return;
      startWithFile(pdfs[0]);
    });

    document.getElementById("btn-workspace-back")?.addEventListener("click", () => {
      sourceFile = null;
      signatures = [];
      placements = [];
      document.getElementById("sign-modal-backdrop")?.remove();
    });

    setView("upload");
    renderUI();
  }

  function init(tool, els, bindUserSwitcher, onSyncUserState) {
    const config = { tool, els, bindUserSwitcher, onSyncUserState };
    const wf = tool.workflow;
    if (wf === "split") initSplit(config);
    else if (wf === "merge") initMerge(config);
    else if (wf === "sign") initSign(config);
    else console.error("[WPSToolWorkflowsExtra] Unknown workflow:", wf);
  }

  global.WPSToolWorkflowsExtra = {
    init,
    initSplit,
    initMerge,
    initSign
  };
})(typeof window !== "undefined" ? window : globalThis);
